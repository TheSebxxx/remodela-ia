import React, { useState, useEffect } from 'react';
import './Catalogo.css';

export default function Catalogo() {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    categoria: "",
    precioMin: "",
    precioMax: "",
    busqueda: ""
  });

  const categorias = ["Pisos", "Azulejos", "Pinturas", "Accesorios"];

  const cargarMateriales = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filtros).toString();
      const res = await fetch(`/api/materiales?${query}`);
      const data = await res.json();
      setMateriales(data);
    } catch (error) {
      console.error("Error al cargar materiales:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMateriales();
  }, [filtros.categoria]); // Recarga automáticamente al cambiar categoría

  const handleInputChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  return (
    <div className="catalogo-container">
      {/* SIDEBAR DE FILTROS */}
      <aside className="filters-sidebar">
        <h2 className="filters-title">🧡 Filtros</h2>
        
        <div className="filter-group">
          <h4>Categoría</h4>
          {categorias.map(cat => (
            <label key={cat} className="filter-option">
              <input 
                type="radio" 
                name="categoria" 
                value={cat} 
                checked={filtros.categoria === cat}
                onChange={handleInputChange} 
              /> {cat}
            </label>
          ))}
          <button className="btn-reset" onClick={() => setFiltros({...filtros, categoria: ""})}>Todas</button>
        </div>

        <div className="filter-group">
          <h4>Precio</h4>
          <div className="price-inputs">
            <input type="number" name="precioMin" placeholder="Min" onChange={handleInputChange} />
            <input type="number" name="precioMax" placeholder="Max" onChange={handleInputChange} />
          </div>
        </div>

        <button className="btn-aplicar" onClick={cargarMateriales}>Aplicar Filtros</button>
      </aside>

      {/* GRILLA DE PRODUCTOS */}
      <main className="catalog-main">
        <header className="catalog-header">
          <h1>Catálogo de Materiales</h1>
          <input 
            type="text" 
            name="busqueda"
            placeholder="Buscar por nombre..." 
            className="search-bar"
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && cargarMateriales()}
          />
        </header>

        {loading ? (
          <div className="loading">Cargando materiales...</div>
        ) : (
          <div className="materials-grid">
            {materiales.map(mat => (
              <div key={mat.id} className="material-card">
                <div className="card-image">
                  <img src={mat.imagen_url || 'https://via.placeholder.com/300'} alt={mat.nombre} />
                  {mat.stock_actual > 10 ? (
                    <span className="badge stock">En stock</span>
                  ) : mat.stock_actual > 0 ? (
                    <span className="badge low-stock">Bajo stock</span>
                  ) : (
                    <span className="badge out">Agotado</span>
                  )}
                </div>
                <div className="card-info">
                  <h3>{mat.nombre}</h3>
                  <p>{mat.descripcion}</p>
                  <div className="card-footer">
                    <span className="price">${parseFloat(mat.precio_unitario).toLocaleString()} <small>/{mat.unidad_medida}</small></span>
                    <button className="btn-add">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}