import React, { useState, useEffect, useCallback } from 'react';
import UserManagement from '../components/UserManagement';
import GlobalMetrics from '../components/dashboard/GlobalMetrics';
import InventoryManagement from '../components/InventoryManagement';
import GestionCotizaciones from '../components/dashboard/GestionCotizaciones';
import GenerarCotizacion from '../components/dashboard/GenerarCotizacion'; 
import ListaCotizaciones from '../components/dashboard/ListaCotizaciones'; 
import SidebarProfile from './SidebarProfile'; 
import { supabase } from '../lib/supabaseClient';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [seccion, setSeccion] = useState('metricas');
  const [materiales, setMateriales] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [solicitudesClientes, setSolicitudesClientes] = useState([]); // Solicitudes de la App
  const [registrosAdmin, setRegistrosAdmin] = useState([]); // PDFs generados por ti

  const refrescarDatos = useCallback(async () => {
    try {
      console.log("Sincronizando datos...");
      const [resMat, resUser, resSol, resAdmin] = await Promise.all([
        supabase.from('catalogo_materiales').select('*'),
        supabase.from('perfiles').select('*'),
        supabase.from('cotizaciones')
          .select(`*, perfiles:usuario_id ( nombre_completo, telefono, email )`)
          .order('created_at', { ascending: false }),
        supabase.from('cotizaciones_admin')
          .select('*')
          .order('created_at', { ascending: false })
      ]);

      if (resMat.data) setMateriales(resMat.data);
      if (resUser.data) setUsuarios(resUser.data);
      if (resSol.data) setSolicitudesClientes(resSol.data);
      if (resAdmin.data) setRegistrosAdmin(resAdmin.data);

    } catch (error) {
      console.error("Error al refrescar dashboard:", error.message);
    }
  }, []);

  useEffect(() => {
    refrescarDatos();
  }, [refrescarDatos]);

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>REMODELA-IA</h2>
          <span className="admin-tag">MODO ADMIN</span>
        </div>
        
        <nav className="admin-menu">
          <button className={seccion === 'metricas' ? 'active' : ''} onClick={() => setSeccion('metricas')}>
            📊 Métricas Globales
          </button>
          
          <button className={seccion === 'nueva_cotizacion' ? 'active' : ''} onClick={() => setSeccion('nueva_cotizacion')}>
            🛠️ Crear Presupuesto
          </button>

          <button className={seccion === 'ver_registros' ? 'active' : ''} onClick={() => setSeccion('ver_registros')}>
            📋 Registro de PDF's
          </button>

          <button className={seccion === 'solicitudes' ? 'active' : ''} onClick={() => setSeccion('solicitudes')}>
            📩 Solicitudes Clientes
          </button>

          <button className={seccion === 'inventario' ? 'active' : ''} onClick={() => setSeccion('inventario')}>
            📦 Gestión Inventario
          </button>

          <button className={seccion === 'usuarios' ? 'active' : ''} onClick={() => setSeccion('usuarios')}>
            👥 Usuarios y Roles
          </button>
        </nav>
        
        <SidebarProfile />
      </aside>

      <main className="admin-content">
        {/* MÉTRICAS: CAMBIADO A solicitudesClientes para mostrar solo datos de la App */}
        {seccion === 'metricas' && (
          <div className="view-fade">
            <GlobalMetrics 
              materiales={materiales} 
              usuarios={usuarios} 
              tareas={solicitudesClientes} // <--- ANTES ESTABA EN registrosAdmin
              onRefresh={refrescarDatos} 
            />
          </div>
        )}

        {seccion === 'nueva_cotizacion' && (
          <div className="view-fade">
            <GenerarCotizacion onCreated={() => { refrescarDatos(); setSeccion('ver_registros'); }} />
          </div>
        )}

        {seccion === 'ver_registros' && (
          <div className="view-fade">
            <ListaCotizaciones />
          </div>
        )}

        {seccion === 'solicitudes' && (
          <div className="view-fade">
            <GestionCotizaciones 
              cotizaciones={solicitudesClientes} 
              onRefresh={refrescarDatos} 
            />
          </div>
        )}

        {seccion === 'inventario' && (
          <div className="view-fade">
            <InventoryManagement onRefresh={refrescarDatos} />
          </div>
        )}

        {seccion === 'usuarios' && (
          <div className="view-fade">
            <UserManagement onRefresh={refrescarDatos} />
          </div>
        )}
      </main>
    </div>
  );
}