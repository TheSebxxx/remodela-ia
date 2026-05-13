import { useState, useEffect, useRef, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import { AuthContext } from '../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import './Chat.css';

export default function Chat({ setVista }) {
  const { usuario, logout, cargando } = useContext(AuthContext);
  const chatEndRef = useRef(null);
  const saludoEnviado = useRef(false);

  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState('');
  const [chatIdActual, setChatIdActual] = useState(uuidv4());
  const [historial, setHistorial] = useState([]);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [estaEnviando, setEstaEnviando] = useState(false);

  // --- EFECTOS ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  useEffect(() => {
    const obtenerHistorial = async () => {
      if (!usuario?.id) return;
      try {
        const res = await fetch(`/api/chat/historial/${usuario.id}`);
        if (res.ok) {
          const data = await res.json();
          setHistorial(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error en historial:", error);
      }
    };
    obtenerHistorial();
  }, [usuario?.id]);

  useEffect(() => {
    // Solo envía el saludo si no hay mensajes y es un chat nuevo
    if (usuario?.nombre && !saludoEnviado.current && mensajes.length === 0) {
      setMensajes([{ 
        rol: 'ai', 
        texto: `¡Hola ${usuario.nombre}! Soy Arturo Rojas, tu asesor de Remodela-IA. ¿Qué espacio quieres transformar hoy?` 
      }]);
      saludoEnviado.current = true;
    }
  }, [usuario?.nombre, mensajes.length]);

  // --- FUNCIONES ---
  
  // Función para cargar chats antiguos
const cargarChatPasado = async (idChat) => {
    try {
      setChatIdActual(idChat);
      
      const res = await fetch(`/api/chat/mensajes/${idChat}`);
      if (!res.ok) throw new Error("No se pudieron obtener los mensajes");
      
      const data = await res.json();
      
      // IMPORTANTE: Aquí transformamos lo que llega de Supabase al formato que usa tu Chat
      const mensajesFormateados = [];
      
      data.forEach(m => {
        // Añadimos el mensaje del usuario
        if (m.mensaje_usuario) {
          mensajesFormateados.push({ rol: 'user', texto: m.mensaje_usuario });
        }
        // Añadimos la respuesta de la IA
        if (m.respuesta_ia) {
          mensajesFormateados.push({ rol: 'ai', texto: m.respuesta_ia });
        }
      });
      
      // Reemplazamos todo el chat con la conversación recuperada
      setMensajes(mensajesFormateados);
      setMenuAbierto(false); 

    } catch (error) {
      console.error("Error al recuperar chat:", error);
      alert("No se pudo cargar la conversación antigua.");
    }
  };

  const iniciarNuevoChat = () => {
    setChatIdActual(uuidv4());
    setMensajes([{ 
      rol: 'ai', 
      texto: `¡Asesoría reiniciada! ¿En qué proyecto trabajaremos hoy, ${usuario?.nombre}?` 
    }]);
    setMenuAbierto(false);
  };

  const enviarMensaje = async () => {
    if (!input.trim() || estaEnviando) return;
    const textoUsuario = input.trim();
    setInput('');
    setEstaEnviando(true);
    setMensajes(prev => [...prev, { rol: 'user', texto: textoUsuario }]);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mensaje: textoUsuario, 
          usuarioId: usuario.id, 
          chatId: chatIdActual 
        })
      });
      if (!res.ok) throw new Error("Servidor no responde");
      const data = await res.json();
      setMensajes(prev => [...prev, { rol: 'ai', texto: data.respuesta }]);
      
      // Actualizamos el historial por si se generó un nuevo título
      const resHist = await fetch(`/api/chat/historial/${usuario.id}`);
      const dataHist = await resHist.json();
      setHistorial(Array.isArray(dataHist) ? dataHist : []);
    } catch (error) {
      console.error("Error de envío:", error);
      setMensajes(prev => [...prev, { 
        rol: 'ai', 
        texto: `Lo siento Mariana, tengo un error técnico de conexión. Verifica que el servidor en el puerto 3000 esté activo.` 
      }]);
    } finally {
      setEstaEnviando(false);
    }
  };

  if (cargando) return <div className="loading-global">Cargando perfil...</div>;
  if (!usuario) return <div className="error-acceso">Inicia sesión para usar el asesor.</div>;

  return (
    <div className="ia-page-container">
      <div className="ia-info-side">
        <span className="badge-remodela">🤖 REMODELA-IA</span>
        <h1 className="h1-dineña">Panel de <span className="text-orange">Asesoría</span></h1>
        
        <div className="panel-actions-row" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button className="btn-panel-action" onClick={() => setMenuAbierto(!menuAbierto)}>
            🕒 Ver Historial de Chats
          </button>
          
          <button 
            className="btn-panel-action" 
            onClick={() => setVista('precotizador')}
          >
            📊 Ir al Precotizador
          </button>
        </div>

        <div className="historial-wrapper">
          {menuAbierto && (
            <div className="historial-dropdown">
              <button className="btn-logout-ia" onClick={iniciarNuevoChat}>
                + Iniciar nuevo proyecto
              </button>
              <div className="historial-list">
                {historial.length > 0 ? (
                  historial.map((chat, index) => (
                    <div 
                      key={chat.id_del_chat || index} 
                      className="historial-item" 
                      onClick={() => cargarChatPasado(chat.id_del_chat)}
                      title="Haz clic para cargar este chat"
                    >
                      <p>{chat.titulo || "Conversación antigua"}</p>
                      <small>{new Date(chat.fecha).toLocaleDateString()}</small>
                    </div>
                  ))
                ) : (
                  <div className="historial-vacio">No hay proyectos previos</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="user-card-ia">
            <p>Usuario: <strong>{usuario.nombre}</strong></p>
            <button className="btn-logout-ia" onClick={logout}>Cerrar Sesión</button>
        </div>
      </div>

      <div className="ia-chat-side">
        <div className="chatbot-window">
          <div className="chatbot-header">
            <strong>Arturo Rojas - Asesor Virtual</strong>
            <span className="online-indicator"></span>
          </div>
          <div className="chatbot-messages">
            {mensajes.map((m, i) => (
              <div key={i} className={`msg-${m.rol}`}>
                <div className="bubble">
                  {m.rol === 'ai' ? (
                    <>
                      <ReactMarkdown>
                        {m.texto.replace('[ABRIR_PRECOTIZADOR]', '')}
                      </ReactMarkdown>
                      {m.texto.includes('[ABRIR_PRECOTIZADOR]') && (
                        <button 
                          className="btn-ir-precotizador"
                          onClick={() => setVista('precotizador')}
                        >
                          📊 Abrir Herramienta de Costos
                        </button>
                      )}
                    </>
                  ) : (
                    <p>{m.texto}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="chatbot-input-area">
            <input 
              id="chat-input"
              name="mensaje"
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
              placeholder="Escribe tu duda sobre remodelación..."
              autoComplete="off"
              disabled={estaEnviando}
            />
            <button 
              onClick={enviarMensaje} 
              className="btn-send-chat"
              disabled={estaEnviando}
            >
              {estaEnviando ? '...' : '➤'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}