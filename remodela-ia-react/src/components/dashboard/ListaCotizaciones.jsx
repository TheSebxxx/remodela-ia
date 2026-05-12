import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ListaCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCotizaciones = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cotizaciones_admin')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error:', error);
    else setCotizaciones(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCotizaciones();
  }, []);

  // --- FUNCIÓN DE RE-GENERACIÓN CON TODAS LAS CLÁUSULAS COMPLETAS ---
  const volverADescargar = (cot) => {
    const doc = new jsPDF();
    const margin = 20;
    const datos = {
      cliente_nombre: cot.cliente_nombre,
      proyecto_tipo: cot.proyecto_tipo,
      total_personalizado: cot.total_contrato,
      modalidad_contrato: cot.condiciones?.modalidad || 'TODO COSTO',
      seleccion: cot.items_seleccionados?.fijos || {},
      carpinteria_personalizada: cot.items_seleccionados?.carpinteria || [],
      otros_items: cot.items_seleccionados?.otros || []
    };

    // Encabezado Profesional
    doc.setFontSize(9);
    doc.text("Floridablanca 2026", margin, 15);
    doc.setFont("helvetica", "bold");
    doc.text("CONSTRUCCIONES & ACABADOS", margin, 20);
    doc.text("ARTURO ROJAS SAS", margin, 25);
    doc.setFont("helvetica", "normal");
    doc.text("NIT 901391633-7", margin, 30);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(datos.proyecto_tipo.toUpperCase(), margin, 40);
    doc.text(`CLIENTE: ${datos.cliente_nombre.toUpperCase()}`, margin, 46);
    doc.line(margin, 48, 190, 48);

    const body = [];
    Object.keys(datos.seleccion).forEach(titulo => {
      if (datos.seleccion[titulo].length > 0) {
        body.push([{ content: titulo, styles: { fontStyle: 'bold', fillColor: [245, 245, 245] } }, ""]);
        datos.seleccion[titulo].forEach(it => body.push([`  • ${it}`, datos.modalidad_contrato]));
      }
    });

    if (datos.carpinteria_personalizada.length > 0) {
      body.push([{ content: "CARPINTERIA Y MADERA", styles: { fontStyle: 'bold', fillColor: [245, 245, 245] } }, ""]);
      datos.carpinteria_personalizada.forEach(item => body.push([`  • ${item.descripcion}`, item.valor]));
    }

    if (datos.otros_items.length > 0) {
      body.push([{ content: "OTROS CONCEPTOS", styles: { fontStyle: 'bold', fillColor: [245, 245, 245] } }, ""]);
      datos.otros_items.forEach(item => body.push([`  • ${item.descripcion}`, item.valor]));
    }

    autoTable(doc, {
      startY: 52,
      head: [['DESCRIPCIÓN DEL ÍTEM', 'VALOR']],
      body: body,
      theme: 'grid',
      headStyles: { fillColor: [255, 193, 7], textColor: [0, 0, 0] },
      styles: { fontSize: 7.5 }
    });

    let y = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    const total = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(datos.total_personalizado);
    doc.text(`TOTAL COTIZACION: ${total}`, margin, y);

    // --- MATERIALES NO INCLUIDOS (RESTAURADOS COMPLETOS) ---
    y += 10;
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text("EL PROPIETARIO SE ENCARGA DE COMPRAR LOS SIGUIENTES MATERIALES YA Q NO VAN INCLUIDOS EN EL", margin, y);
    doc.text("CONTRATO TODO COSTO:", margin, y + 4);
    
    doc.setFont("helvetica", "normal");
    const materialesNo = [
      "- CUBIERTA DE COCINA (ESTUFA) LAS MEDIDAS SON DE 60CM * 51CM",
      "- CAMPANA EXTRACTORA.",
      "- LAVAPLATOS Y GRIFERÍA, DESAGÜE",
      "- LAVAMANOS Y GRIFERÍA, DESAGÜE",
      "- LAMPARAS DE LUJO",
      "- LLAVE LAVADORA",
      "- SANITARIO, LAVAMANOS BAÑO PRINCIPAL",
      "- ELECTRODOMESTICOS EN GENERAL"
    ];
    materialesNo.forEach((m, i) => doc.text(m, margin + 5, y + 10 + (i * 4)));

    // --- CLÁUSULAS FINALES (RESTAURADAS COMPLETAS) ---
    y = y + 45;
    doc.setFont("helvetica", "bold");
    doc.text("NOTA CONTRATO TODO COSTO: - - - - - - - -", margin, y);
    
    doc.setFont("helvetica", "normal");
    const clausulasFinales = [
      "LA EJECUCIÓN DE LA OBRA SE LLEVARÁ A CABO EN 60 DÍAS HÁBILES A PARTIR DE LA FECHA DEL",
      "PRIMER ABONO. (NO SE CUENTAN SABADOS NO, DOMINGOS NO, FESTIVOS NO).",
      "LA EJECUCION DE MANO DE OBRA SON 30 DIAS HABILES.",
      "LA COMPRA DE LA CERÁMICA DEL APARTAMENTO TENDRÁ UN TOPE DE 40.000 PESOS POR METRO",
      "CUADRADO, SI ESTE LLEGA A EXCEDER EL PROPIETARIO SE ENCARGARÁ DE PAGAR EL EXCEDENTE.",
      "SE ACLARA ESTE CONTRATO VA COTIZADO CON CERÁMICA, SI EL CLIENTE LLEGARA A ESCOGER UN",
      "PORCELANATO SE SUMARIAN $ 750.000 MÁS AL VALOR TOTAL DEL CONTRATO YA QUE EL VALOR DE",
      "INSTALACIÓN DEL PORCELANATO ES DIFERENTE.",
      "EN CASO DE QUE EL PROPIETARIO LLEGARA A ESCOGER UN PORCELANATO O CERAMICA RECTIFICADA",
      "DEBERA PAGAR EL EXEDENTE DEL PEGANTE YA QUE SU VALOR ES DIFERENTE DE CERAMICA A",
      "PORCELANATO",
      "LA EMPRESA DE ENCARGARA DE LOS ESCOMBROS Y DEL PAGO DEL ACARREO DE ESTOS.",
      "NO NOS HACEMOS RESPONSABLES DE IVA NI RETENCIONES.",
      "LA EMPRESA SE HACE RESPONSABLE DEL PAGO DE SEGURIDAD DE LOS TRABAJADORES,",
      "EL PAGO DEL CONTRATO SE REALIZARÁ EN CUATRO PARTES IGUALES, PARA INICIAR 25% DEL",
      "VALOR DEL CONTRATO, Y LOS 3 PAGOS SIGUIENTES SE DIVIDIRAN EN EL TIEMPO DE DURACION DE",
      "LA OBRA SIENDO EL ULTIMO 25% EL DIA DE LA ENTREGA DEL PROYECTO."
    ];
    
    clausulasFinales.forEach((linea, i) => {
        if (y + 6 + (i * 4) > 280) { doc.addPage(); y = 20; } 
        doc.text(linea, margin, y + 6 + (i * 4));
    });

    let firmaY = Math.max(y + 80, 260);
    if (firmaY > 280) { doc.addPage(); firmaY = 40; }
    doc.text("__________________________", margin, firmaY);
    doc.setFont("helvetica", "bold");
    doc.text("PEDRO ARTURO ROJAS ACEVEDO", margin, firmaY + 5);
    doc.text("Representante Legal", margin, firmaY + 10);

    doc.save(`Cotizacion_${datos.cliente_nombre}.pdf`);
  };

  const eliminarCotizacion = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este registro permanentemente?")) return;
    const { error } = await supabase.from('cotizaciones_admin').delete().eq('id', id);
    if (!error) fetchCotizaciones();
  };

  const cotizacionesFiltradas = cotizaciones.filter(c => 
    c.cliente_nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div style={{ background: '#0f172a', color: 'white', padding: '30px', borderRadius: '15px', border: '1px solid #1e293b' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: '25px', alignItems: 'center' }}>
        <h2 style={{ color: '#f472b6', margin: 0 }}>📋 Registro de Cotizaciones</h2>
        
        <input 
          type="text" 
          placeholder="🔍 Buscar por nombre del cliente..." 
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ 
            flex: 1, 
            maxWidth: '500px', 
            padding: '12px', 
            borderRadius: '10px', 
            background: '#1e293b', 
            border: '1px solid #334155', 
            color: 'white',
            outline: 'none'
          }}
        />

        <button onClick={fetchCotizaciones} style={{ background: '#1e293b', color: '#22c55e', border: '1px solid #22c55e', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
          ACTUALIZAR
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #334155', textAlign: 'left', color: '#94a3b8', fontSize: '0.85rem' }}>
              <th style={{ padding: '15px' }}>CLIENTE</th>
              <th style={{ padding: '15px' }}>PROYECTO</th>
              <th style={{ padding: '15px' }}>TOTAL</th>
              <th style={{ padding: '15px', textAlign: 'center' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {cotizacionesFiltradas.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#475569' }}>No se encontraron registros.</td></tr>
            ) : (
              cotizacionesFiltradas.map((cot) => (
                <tr key={cot.id} style={{ borderBottom: '1px solid #1e293b', transition: '0.3s' }}>
                  <td style={{ padding: '15px', fontWeight: 'bold', textTransform: 'uppercase' }}>{cot.cliente_nombre}</td>
                  <td style={{ padding: '15px', fontSize: '0.8rem', color: '#cbd5e1' }}>{cot.proyecto_tipo}</td>
                  <td style={{ padding: '15px', color: '#22c55e', fontWeight: 'bold' }}>
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cot.total_contrato)}
                  </td>
                  <td style={{ padding: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button 
                      onClick={() => volverADescargar(cot)}
                      style={{ background: '#0ea5e9', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                    >
                      📥 DESCARGAR PDF
                    </button>
                    <button 
                      onClick={() => eliminarCotizacion(cot.id)}
                      style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}