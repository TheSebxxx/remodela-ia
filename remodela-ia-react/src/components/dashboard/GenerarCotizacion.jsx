import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function GenerarCotizacion({ onCreated }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cliente_nombre: '',
    proyecto_tipo: 'COTIZACION PARQUE ORIENTE AURORA FULL TERMINACION',
    total_personalizado: '',
    modalidad_contrato: 'TODO COSTO',
    seleccion: {},
    carpinteria_personalizada: [],
    otros_items: []
  });

  const seccionesOriginales = [
    { titulo: "DEMOLICION", items: ["Lavadero", "Enchape que entrega la constructora", "Estufa y barras de estufa"] },
    { titulo: "ESTUCO APARTAMENTO", items: ["Placa", "Muros"] },
    { titulo: "PLOMERIA", items: ["Instalación de sanitario y lavamanos baño principal", "Ducha y llave ducha", "Cambiar lavadero"] },
    { titulo: "MORTERO", items: ["Apartamento completo", "Realce para closet", "Realce para cocina", "Realce para barra"] },
    { titulo: "ELECTRICOS", items: ["Instalación de luces LED en todo el apartamento", "Instalación de luz LED para los nichos"] },
    { titulo: "INSTALACIÓN DE DRYWALL", items: ["Cocina completa", "Baños en L", "Zona de ropas"] },
    { titulo: "PINTURA APARTAMENTO (3 MANOS BLANCO)", items: ["Muros", "Placa"] },
    { titulo: "ENCHAPE DE MUROS CON CERAMICA (ELEGIDO A GUSTO DEL PROPIETARIO)", items: ["Cocina completa", "Baño principal (1 nicho)", "Baño auxiliar (1 nicho)", "Zona de ropas"] },
    { titulo: "ENCHAPE DE PISO CON CERAMICA (ELEGIDO A GUSTO DEL PROPIETARIO)", items: ["Habitaciones", "Sala", "Comedor", "Cocina", "Baños", "Zona de ropas"] }
  ];

  const handleSeleccionarTodo = (e) => {
    if (e.target.checked) {
      const nuevaSeleccion = {};
      seccionesOriginales.forEach(sec => {
        nuevaSeleccion[sec.titulo] = [...sec.items];
      });
      setFormData({ ...formData, seleccion: nuevaSeleccion });
    } else {
      setFormData({ ...formData, seleccion: {} });
    }
  };

  const agregarItemDinamico = (lista) => {
    setFormData({
      ...formData,
      [lista]: [...formData[lista], { descripcion: '', valor: formData.modalidad_contrato }]
    });
  };

  const actualizarItemDinamico = (lista, index, campo, valor) => {
    const nuevos = [...formData[lista]];
    nuevos[index][campo] = valor;
    setFormData({ ...formData, [lista]: nuevos });
  };

  const eliminarItemDinamico = (lista, index) => {
    setFormData({ ...formData, [lista]: formData[lista].filter((_, i) => i !== index) });
  };

  const handleSelect = (titulo, item) => {
    const actual = formData.seleccion[titulo] || [];
    const nueva = actual.includes(item) ? actual.filter(i => i !== item) : [...actual, item];
    setFormData({ ...formData, seleccion: { ...formData.seleccion, [titulo]: nueva } });
  };

  const generarPDF = async (datos) => {
    setLoading(true);
    try {
      // GUARDAR EN BASE DE DATOS
      const { error } = await supabase.from('cotizaciones_admin').insert([{
        cliente_nombre: datos.cliente_nombre,
        proyecto_tipo: datos.proyecto_tipo,
        total_contrato: parseFloat(datos.total_personalizado),
        items_seleccionados: { fijos: datos.seleccion, carpinteria: datos.carpinteria_personalizada, otros: datos.otros_items },
        condiciones: { modalidad: datos.modalidad_contrato }
      }]);

      if (error) throw error;

      // GENERAR PDF
      const doc = new jsPDF();
      const margin = 20;

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

      // --- CLAUSULAS ORIGINALES RESTAURADAS ---
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
      alert("Guardado y PDF generado con éxito.");
    } catch (err) {
      alert("Error en el proceso.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#0f172a', color: 'white', padding: '30px', borderRadius: '15px', maxWidth: '1200px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ color: '#f472b6', margin: 0 }}>📝 Generador Arturo Rojas SAS</h2>
        <div style={{ background: '#1e293b', padding: '8px 15px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>MODALIDAD:</span>
          {['TODO COSTO', 'MANO DE OBRA'].map(mod => (
            <label key={mod} style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: formData.modalidad_contrato === mod ? '#22c55e' : 'white' }}>
              <input type="radio" name="modalidad" checked={formData.modalidad_contrato === mod} onChange={() => setFormData({...formData, modalidad_contrato: mod})} style={{ accentColor: '#22c55e' }} />
              {mod}
            </label>
          ))}
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); generarPDF(formData); }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <input required placeholder="Proyecto" value={formData.proyecto_tipo} onChange={e => setFormData({...formData, proyecto_tipo: e.target.value})} style={{ padding: '12px', background: '#1e293b', color: 'white', border: '1px solid #334155', borderRadius: '8px' }} />
          <input required placeholder="Cliente" value={formData.cliente_nombre} onChange={e => setFormData({...formData, cliente_nombre: e.target.value})} style={{ padding: '12px', background: '#1e293b', color: 'white', border: '1px solid #334155', borderRadius: '8px' }} />
          <input required type="number" placeholder="Total $" value={formData.total_personalizado} onChange={e => setFormData({...formData, total_personalizado: e.target.value})} style={{ padding: '12px', background: '#1e293b', color: 'white', border: '1px solid #334155', borderRadius: '8px' }} />
        </div>

        <div style={{ marginBottom: '20px', background: '#1e293b', padding: '10px 20px', borderRadius: '10px', display: 'inline-block', border: '1px solid #22c55e' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', color: '#22c55e' }}>
            <input type="checkbox" onChange={handleSeleccionarTodo} style={{ accentColor: '#22c55e', width: '18px', height: '18px' }} />
            SELECCIONAR TODAS LAS SECCIONES FIJAS
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr', gap: '30px', alignItems: 'start' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
            {seccionesOriginales.map((sec, i) => (
              <div key={i} style={{ background: '#1e293b', padding: '15px', borderRadius: '10px', border: '1px solid #334155' }}>
                <h4 style={{ color: '#22c55e', fontSize: '0.85rem', marginBottom: '12px', textTransform: 'uppercase' }}>{sec.titulo}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sec.items.map(it => (
                    <label key={it} style={{ display: 'grid', gridTemplateColumns: '20px 1fr', alignItems: 'start', gap: '10px', fontSize: '0.8rem', color: '#ffffff', cursor: 'pointer' }}>
                      <input type="checkbox" checked={formData.seleccion[sec.titulo]?.includes(it) || false} onChange={() => handleSelect(sec.titulo, it)} style={{ accentColor: '#22c55e', marginTop: '2px' }} />
                      <span>{it}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '20px' }}>
            <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '2px dashed #ec4899' }}>
              <h4 style={{ color: '#ec4899', fontSize: '0.9rem', marginBottom: '15px' }}>🪚 CARPINTERÍA <button type="button" onClick={() => agregarItemDinamico('carpinteria_personalizada')} style={{ float: 'right', background: '#ec4899', color: 'white', border: 'none', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}>+</button></h4>
              {formData.carpinteria_personalizada.map((item, index) => (
                <div key={index} style={{ marginBottom: '10px', padding: '8px', background: '#0f172a', borderRadius: '8px' }}>
                  <textarea placeholder="Descripción..." value={item.descripcion} onChange={(e) => actualizarItemDinamico('carpinteria_personalizada', index, 'descripcion', e.target.value)} style={{ width: '100%', background: 'transparent', color: 'white', border: 'none', fontSize: '0.8rem', outline: 'none' }} />
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <input value={item.valor} onChange={(e) => actualizarItemDinamico('carpinteria_personalizada', index, 'valor', e.target.value)} style={{ flex: 1, background: '#1e293b', color: '#fbbf24', border: '1px solid #334155', borderRadius: '4px', fontSize: '0.75rem' }} />
                    <button type="button" onClick={() => eliminarItemDinamico('carpinteria_personalizada', index)} style={{ background: '#ef4444', border: 'none', color: 'white', borderRadius: '4px' }}>X</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '2px dashed #0ea5e9' }}>
              <h4 style={{ color: '#0ea5e9', fontSize: '0.9rem', marginBottom: '15px' }}>➕ OTROS <button type="button" onClick={() => agregarItemDinamico('otros_items')} style={{ float: 'right', background: '#0ea5e9', color: 'white', border: 'none', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}>+</button></h4>
              {formData.otros_items.map((item, index) => (
                <div key={index} style={{ marginBottom: '10px', padding: '8px', background: '#0f172a', borderRadius: '8px' }}>
                  <textarea placeholder="Descripción..." value={item.descripcion} onChange={(e) => actualizarItemDinamico('otros_items', index, 'descripcion', e.target.value)} style={{ width: '100%', background: 'transparent', color: 'white', border: 'none', fontSize: '0.8rem', outline: 'none' }} />
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <input value={item.valor} onChange={(e) => actualizarItemDinamico('otros_items', index, 'valor', e.target.value)} style={{ flex: 1, background: '#1e293b', color: '#0ea5e9', border: '1px solid #334155', borderRadius: '4px', fontSize: '0.75rem' }} />
                    <button type="button" onClick={() => eliminarItemDinamico('otros_items', index)} style={{ background: '#ef4444', border: 'none', color: 'white', borderRadius: '4px' }}>X</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '30px', padding: '15px', background: '#ec4899', color: 'white', borderRadius: '10px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '1.1rem', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'PROCESANDO...' : '💾 GUARDAR Y GENERAR COTIZACIÓN FINAL'}
        </button>
      </form>
    </div>
  );
}