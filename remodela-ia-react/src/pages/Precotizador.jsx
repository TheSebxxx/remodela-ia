import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Precotizador.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Precotizador({ setVista }) {
  const { usuario } = useContext(AuthContext);
  const [materialesDB, setMaterialesDB] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [materialElegido, setMaterialElegido] = useState("");
  const [metros, setMetros] = useState("");
  const [ambientes, setAmbientes] = useState("");
  const [tipoProyecto, setTipoProyecto] = useState("");
  const [cargando, setCargando] = useState(true);
  const [historial, setHistorial] = useState([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  useEffect(() => {
    const obtenerMateriales = async () => {
      try {
        const res = await fetch('/api/materiales');
        if (!res.ok) throw new Error("Error en la respuesta");
        const data = await res.json();
        setMaterialesDB(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerMateriales();
  }, []);

  // Lógica de cálculos
  const totalMateriales = seleccionados.reduce((acc, el) => acc + el.total, 0);
  const manoObra = totalMateriales * 0.4;
  const transporte = totalMateriales > 0 ? 85000 : 0;
  const subtotal = totalMateriales + manoObra + transporte;
  const iva = subtotal * 0.19;
  const totalFinal = subtotal + iva;

  const agregarMaterial = () => {
    const mat = materialesDB.find(m => m.id === parseInt(materialElegido));
    const cantidad = parseFloat(metros);
    if (mat && cantidad > 0) {
      const nuevoItem = {
        id: mat.id,
        nombre: mat.nombre,
        unidad: mat.unidad_medida || 'm²',
        precioUnitario: mat.precio_unitario,
        cantidad: cantidad,
        total: mat.precio_unitario * cantidad
      };
      setSeleccionados([...seleccionados, nuevoItem]);
      setMetros("");
      setMaterialElegido("");
    }
  };

  const guardarCotizacion = async () => {
    const payload = {
      usuario_id: usuario.id,
      total_estimado: totalFinal,
      detalles_json: {
        tipo: tipoProyecto,
        ambientes: ambientes,
        items: seleccionados
      }
    };
    try {
      const res = await fetch('/api/cotizaciones/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return res.ok;
    } catch (error) {
      console.error("Error al guardar:", error);
      return false;
    }
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString();
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("Presupuesto de Remodelación", 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Fecha: ${fecha}`, 14, 30);
    doc.text(`Cliente: ${usuario?.email || 'Usuario Registrado'}`, 14, 35);
    doc.text(`Proyecto: ${tipoProyecto || 'Remodelación General'}`, 14, 40);

    const columnas = ["Material", "Cantidad", "Precio Unit.", "Total"];
    const filas = seleccionados.map(item => [
      item.nombre,
      `${item.cantidad} ${item.unidad}`,
      `$${item.precioUnitario.toLocaleString()}`,
      `$${item.total.toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: 50,
      head: [columnas],
      body: filas,
      theme: 'grid',
      headStyles: { fillColor: [255, 126, 0] },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Subtotal: $${subtotal.toLocaleString()}`, 14, finalY);
    doc.text(`IVA (19%): $${iva.toLocaleString()}`, 14, finalY + 7);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL FINAL: $${totalFinal.toLocaleString()}`, 14, finalY + 17);
    doc.save(`Cotizacion_${tipoProyecto || 'RemodelaIA'}.pdf`);
  };

  // FUNCIÓN UNIFICADA: Guardar y Descargar
  const procesarCotizacion = async () => {
    if (!usuario) return alert("Debes iniciar sesión para realizar esta acción.");
    if (seleccionados.length === 0) return alert("Agrega materiales a la lista.");
    
    const guardadoExitoso = await guardarCotizacion();
    if (guardadoExitoso) {
      generarPDF();
      alert("✅ Cotización guardada y descargada con éxito.");
    } else {
      alert("❌ Error al procesar la solicitud.");
    }
  };

  const cargarHistorial = async () => {
    if (!usuario) return alert("Inicia sesión para ver tu historial.");
    try {
      const res = await fetch(`/api/cotizaciones/historial/${usuario.id}`);
      const data = await res.json();
      setHistorial(data);
      setMostrarHistorial(!mostrarHistorial);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    }
  };

  const seleccionarDelHistorial = (cot) => {
    setTipoProyecto(cot.detalles_json.tipo || "");
    setAmbientes(cot.detalles_json.ambientes || "");
    setSeleccionados(cot.detalles_json.items || []);
    setMostrarHistorial(false);
  };

  if (cargando) return <div className="loading">Cargando catálogo...</div>;

  return (
    <div className="precotizador-container">
      <button className="btn-volver-atras" onClick={() => setVista('ia')}>
        ← Volver a la asesoría
      </button>

      <div className="header-mockup">
        <span className="tag-orange">COTIZADOR INTELIGENTE</span>
        <h1>Genera tu presupuesto en minutos</h1>
      </div>

      <div className="main-grid">
        <div className="card-detalles">
          <h3><span className="icon">📙</span> Detalles del Proyecto</h3>
          
          <div className="input-full">
            <label>Tipo de Proyecto</label>
            <input 
              type="text" 
              placeholder="Ej: Remodelación de Cocina" 
              value={tipoProyecto}
              onChange={(e) => setTipoProyecto(e.target.value)}
            />
          </div>

          <div className="row-inputs">
            <div className="input-half">
              <label>Metros cuadrados</label>
              <input type="number" placeholder="0.00" value={metros} onChange={(e) => setMetros(e.target.value)} />
            </div>
            <div className="input-half">
              <label>Número de ambientes</label>
              <input type="number" placeholder="0" value={ambientes} onChange={(e) => setAmbientes(e.target.value)} />
            </div>
          </div>

          <div className="materiales-seleccionados-section">
            <label>Materiales Seleccionados</label>
            <div className="lista-materiales">
              {seleccionados.map((item, index) => (
                <div key={index} className="item-material-card">
                  <div className="item-info">
                    <div className="item-image-placeholder"></div>
                    <div className="item-text">
                      <p className="item-name">{item.nombre}</p>
                      <p className="item-meta">{item.cantidad} {item.unidad} x ${item.precioUnitario.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="item-price">${item.total.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="agregar-material-container">
              <select className="select-material-invisible" value={materialElegido} onChange={(e) => setMaterialElegido(e.target.value)}>
                <option value="">+ Seleccionar material para añadir</option>
                {materialesDB.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
              <button className="btn-dashed-add" onClick={agregarMaterial}>+ Agregar Material</button>
            </div>
          </div>
        </div>

        <div className="card-resumen-dark">
          <h3 className="resumen-title" style={{ color: 'white' }}><span className="icon">📄</span> Resumen de Cotización</h3>
          <div className="resumen-item"><span>Materiales:</span><span>${totalMateriales.toLocaleString()}</span></div>
          <div className="resumen-item"><span>Mano de obra:</span><span>${manoObra.toLocaleString()}</span></div>
          <div className="resumen-item"><span>Transporte:</span><span>${transporte.toLocaleString()}</span></div>
          <div className="divider"></div>
          <div className="resumen-item"><span>Subtotal:</span><span>${subtotal.toLocaleString()}</span></div>
          <div className="resumen-item"><span>IVA (19%):</span><span>${iva.toLocaleString()}</span></div>

          <div className="total-destacado">
            <div className="total-label">TOTAL:<span className="precio-final">${totalFinal.toLocaleString()}</span></div>
          </div>

          <div className="acciones-resumen">
            <button className="btn-orange-mockup" onClick={procesarCotizacion}>
               💾 Guardar y Descargar PDF
            </button>
            <button className="btn-outline-mockup" onClick={cargarHistorial}>
                <span className="icon">⏳</span> {mostrarHistorial ? "Ocultar Historial" : "Ver Historial"}
            </button>
            
            {mostrarHistorial && (
                <div className="historial-panel-estetico">
                    <h4>Proyectos Recientes</h4>
                    <div className="historial-scroll">
                      {historial.length === 0 ? <p className="empty-msg">No hay registros aún.</p> : 
                          historial.map(cot => (
                              <div key={cot.id} className="historial-card-item" onClick={() => seleccionarDelHistorial(cot)}>
                                  <div className="historial-info">
                                    <span className="historial-date">{new Date(cot.created_at).toLocaleDateString()}</span>
                                    <span className="historial-type">{cot.detalles_json.tipo || "Sin nombre"}</span>
                                  </div>
                                  <strong className="historial-price">${cot.total_estimado.toLocaleString()}</strong>
                              </div>
                          ))
                      }
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}