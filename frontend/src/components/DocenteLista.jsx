import { useEffect, useState } from 'react';
import { listar, crear, actualizar, eliminar } from '../api/docentes';

export function DocenteLista() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);
  const [errores, setErrores] = useState({});

  const cargarDatos = () => {
    setCargando(true);
    listar()
      .then((r) => setDatos(r.results))
      .catch(() => setError('No se pudo cargar la lista de docentes.'))
      .finally(() => setCargando(false));
  };

  useEffect(cargarDatos, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores({});
    try {
      if (form.id) await actualizar(form.id, form);
      else await crear(form);
      setForm(null);
      cargarDatos();
    } catch (err) {
      setErrores(err.response?.status === 400 ? err.response.data : { general: ['Error de conexión.'] });
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este docente?')) return;
    await eliminar(id);
    cargarDatos();
  };

  if (form) {
    return (
      <form onSubmit={handleSubmit}>
        <h3>{form.id ? 'Editar docente' : 'Nuevo docente'}</h3>
        <div>
          <label>Nombre</label>
          <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          {errores.nombre?.[0] && <p role="alert">{errores.nombre[0]}</p>}
        </div>
        <div>
          <label>Documento</label>
          <input value={form.documento} onChange={(e) => setForm({ ...form, documento: e.target.value })} required />
          {errores.documento?.[0] && <p role="alert">{errores.documento[0]}</p>}
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {errores.email?.[0] && <p role="alert">{errores.email[0]}</p>}
        </div>
        <div>
          <label>Especialidad</label>
          <input value={form.especialidad || ''} onChange={(e) => setForm({ ...form, especialidad: e.target.value })} />
        </div>
        {errores.general?.[0] && <p role="alert">{errores.general[0]}</p>}
        <button type="submit">Guardar</button>
        <button type="button" onClick={() => setForm(null)}>Cancelar</button>
      </form>
    );
  }

  if (cargando) return <p>Cargando…</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <div>
      <button onClick={() => setForm({ nombre: '', documento: '', email: '', especialidad: '' })}>
        + Nuevo docente
      </button>
      {datos.length === 0 ? (
        <p>Todavía no hay docentes registrados.</p>
      ) : (
        <table>
          <thead>
            <tr><th>Nombre</th><th>Documento</th><th>Especialidad</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {datos.map((d) => (
              <tr key={d.id}>
                <td>{d.nombre}</td>
                <td>{d.documento}</td>
                <td>{d.especialidad}</td>
                <td>
                  <button onClick={() => setForm(d)}>Editar</button>
                  <button onClick={() => handleEliminar(d.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}