import React, { useEffect, useState } from 'react';

export default function AdmonPrestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [libros, setLibros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [libroId, setLibroId] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [fechaPrestamo, setFechaPrestamo] = useState('');
  const [fechaDevolucion, setFechaDevolucion] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/prestamos')
      .then(res => res.json())
      .then(setPrestamos)
      .catch(() => alert('Error al cargar préstamos'));

    fetch('http://localhost:8080/libros')
      .then(res => res.json())
      .then(setLibros)
      .catch(() => alert('Error al cargar libros'));

    fetch('http://localhost:8080/api/usuarios')
      .then(res => res.json())
      .then(setUsuarios)
      .catch(() => alert('Error al cargar usuarios'));
  }, []);

  const resetFormulario = () => {
    setLibroId('');
    setUsuarioId('');
    setFechaPrestamo('');
    setFechaDevolucion('');
    setEditandoId(null);
    setMensaje('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const prestamo = {
      fechaprestamo: fechaPrestamo,
      fechadevolucion: fechaDevolucion,
      libro: { id: Number(libroId) },
      usuario: { id: Number(usuarioId) },
    };

    const url = editandoId
      ? `http://localhost:8080/prestamos/${editandoId}`
      : 'http://localhost:8080/prestamos';

    const method = editandoId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prestamo),
      });

      if (!res.ok) throw new Error('Error al guardar el préstamo');

      setMensaje(editandoId ? 'Préstamo actualizado correctamente' : 'Préstamo registrado');
      resetFormulario();
      fetch('http://localhost:8080/prestamos')
        .then(res => res.json())
        .then(setPrestamos);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (p) => {
    setLibroId(p.libro?.id || '');
    setUsuarioId(p.usuario?.id || '');
    setFechaPrestamo(p.fechaprestamo);
    setFechaDevolucion(p.fechadevolucion);
    setEditandoId(p.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro de eliminar el préstamo?')) return;
    try {
      await fetch(`http://localhost:8080/prestamos/${id}`, { method: 'DELETE' });
      setPrestamos(prestamos.filter(p => p.id !== id));
      setMensaje('Préstamo eliminado correctamente');
    } catch {
      alert('Error al eliminar el préstamo');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">📋 Gestión de Préstamos</h2>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}

      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-3">
          <select className="form-select" value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)} required>
            <option value="">Seleccione usuario</option>
            {usuarios.map(u => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={libroId} onChange={(e) => setLibroId(e.target.value)} required>
            <option value="">Seleccione libro</option>
            {libros.map(l => (
              <option key={l.id} value={l.id}>{l.nombre || l.titulo}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <input type="date" className="form-control" value={fechaPrestamo} onChange={(e) => setFechaPrestamo(e.target.value)} required />
        </div>
        <div className="col-md-2">
          <input type="date" className="form-control" value={fechaDevolucion} onChange={(e) => setFechaDevolucion(e.target.value)} required />
        </div>
        <div className="col-md-2 d-grid">
          <button type="submit" className="btn btn-primary">{editandoId ? 'Actualizar' : 'Registrar'}</button>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Libro</th>
              <th>Préstamo</th>
              <th>Devolución</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {prestamos.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.usuario?.username}</td>
                <td>{p.libro?.nombre || p.libro?.titulo}</td>
                <td>{p.fechaprestamo}</td>
                <td>{p.fechadevolucion}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(p)}>
                    <i className="fas fa-pen"></i>
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {prestamos.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">No hay préstamos registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
