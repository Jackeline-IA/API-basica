import { useEffect, useState } from 'react';
import { listar, crear, actualizar, eliminar } from '../api/cursos';

export function CursoLista() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);
  const [errores, setErrores] = useState({});

  const cargarDatos = () => {
    setCargando(true);
    listar()
      .then((r) => setDatos(r.results))
      .catch(() => setError('No se pudo cargar la lista de cursos.'))
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
    if (!confirm('¿Eliminar este curso?')) return;
    await eliminar(id);
    cargarDatos();
  };

  if (form) {
    return (
      <form onSubmit={handleSubmit}>
        <h3>{form.id ? 'Editar curso' : 'Nuevo curso'}</h3>
        <div>
          <label>Nombre</label>
          <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          {errores.nombre?.[0] && <p role="alert">{errores.nombre[0]}</p>}
        </div>
        <div>
          <label>Jornada</label>
          <select value={form.jornada} onChange={(e) => setForm({ ...form, jornada: e.target.value })}>
            <option value="MAÑANA">Mañana</option>
            <option value="TARDE">Tarde</option>
            <option value="NOCHE">Noche</option>
          </select>
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
      <button onClick={() => setForm({ nombre: '', jornada: 'MAÑANA' })}>+ Nuevo curso</button>
      {datos.length === 0 ? (
        <p>Todavía no hay cursos registrados.</p>
      ) : (
        <table>
          <thead><tr><th>Nombre</th><th>Jornada</th><th>Acciones</th></tr></thead>
          <tbody>
            {datos.map((c) => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{c.jornada}</td>
                <td>
                  <button onClick={() => setForm(c)}>Editar</button>
                  <button onClick={() => handleEliminar(c.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}