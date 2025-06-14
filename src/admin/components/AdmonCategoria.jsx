import React, { useEffect, useState } from 'react';

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const API_URL = 'http://localhost:8080/api/categorias';

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = () => {
    setLoading(true);
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(() => setError('Error al cargar categorías'))
      .finally(() => setLoading(false));
  };

  const resetFormulario = () => {
    setNombre('');
    setDescripcion('');
    setEditando(null);
    setError(null);
    setSuccess(null);
  };

  const handleEdit = (categoria) => {
    setNombre(categoria.nombre);
    setDescripcion(categoria.descripcion || '');
    setEditando(categoria.id);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      setLoading(true);
      fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(() => {
          setSuccess('Categoría eliminada correctamente');
          cargarCategorias();
        })
        .catch(() => setError('Error al eliminar categoría'))
        .finally(() => setLoading(false));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const categoria = { nombre, descripcion };
    const url = editando ? `${API_URL}/${editando}` : API_URL;
    const method = editando ? 'PUT' : 'POST';

    setLoading(true);
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoria),
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al guardar categoría');
        setSuccess(editando ? 'Categoría actualizada' : 'Categoría creada');
        cargarCategorias();
        resetFormulario();
      })
      .catch(() => setError('Error al guardar categoría'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-3">📚 Gestión de Categorías</h2>

      <form className="row g-3 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
        </div>
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Descripción (opcional)" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
        </div>
        <div className="col-12 text-end">
          <button type="submit" className="btn btn-primary">{editando ? 'Actualizar' : 'Agregar'}</button>
          {editando && <button type="button" onClick={resetFormulario} className="btn btn-secondary ms-2">Cancelar</button>}
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="row g-4">
        {categorias.map(categoria => (
          <div className="col-md-4" key={categoria.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{categoria.nombre}</h5>
                <p className="text-muted">{categoria.descripcion || 'Sin descripción'}</p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(categoria)}>Editar</button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(categoria.id)}>Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}