import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Aside() {
  const sidebarStyle = {
    backgroundColor: '#0d6efd', // Azul Bootstrap
    minHeight: '100vh',
    width: 240,
    padding: '2rem 1rem',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
    color: '#ffffff',
  };

  const linkStyle = {
    backgroundColor: '#e0edff',
    color: '#0d1b2a',
    border: 'none',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  };

  const hoverStyle = {
    backgroundColor: '#cfe2ff',
    color: '#0a1f3c',
  };

  const [hovered, setHovered] = useState(null);

  const menuItems = [
    { to: '/admin', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { to: '/admin/AdmonLibros', label: 'Libros', icon: 'fas fa-book' },
    { to: '/admin/AdmonUsuarios', label: 'Usuarios', icon: 'fas fa-user' },
    { to: '/admin/AdmonPrestamos', label: 'Préstamos', icon: 'fas fa-handshake' },
    { to: '/admin/AdmonAutores', label: 'Autores', icon: 'fas fa-user-edit' },
    { to: '/admin/AdmonCategorias', label: 'Categorías', icon: 'fas fa-tags' },
  ];

  return (
    <aside style={sidebarStyle}>
      <div className="d-flex align-items-center mb-4">
        <i className="fas fa-user-shield fa-lg me-2"></i>
        <span className="fs-5 fw-bold">Administrador</span>
      </div>

      <nav>
        <ul className="nav flex-column gap-2">
          {menuItems.map((item, index) => (
            <li className="nav-item" key={index}>
              <Link
                to={item.to}
                className="btn text-start w-100"
                style={{
                  ...linkStyle,
                  ...(hovered === index ? hoverStyle : {}),
                }}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                <i className={`${item.icon} me-2`}></i> {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
