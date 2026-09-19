import { useEffect, useState } from 'react';
import { listar, crear, actualizar, eliminar } from '../api/periodos';

export function PeriodoLista() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);
  const [errores, setErrores] = useState({});

  const cargarDatos = () => {
    setCargando(true);
    listar()
      .then((r) => setDatos(r.results))
      .catch(() => setError('No se pudo cargar la lista de periodos.'))
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
    if (!confirm('¿Eliminar este periodo?')) return;
    await eliminar(id);
    cargarDatos();
  };

  if (form) {
    return (
      <form onSubmit={handleSubmit}>
        <h3>{form.id ? 'Editar periodo' : 'Nuevo periodo'}</h3>
        <div>
          <label>Nombre</label>
          <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          {errores.nombre?.[0] && <p role="alert">{errores.nombre[0]}</p>}
        </div>
        <div>
          <label>Fecha inicio</label>
          <input type="date" value={form.fecha_inicio || ''} onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })} required />
          {errores.fecha_inicio?.[0] && <p role="alert">{errores.fecha_inicio[0]}</p>}
        </div>
        <div>
          <label>Fecha fin</label>
          <input type="date" value={form.fecha_fin || ''} onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })} required />
          {errores.fecha_fin?.[0] && <p role="alert">{errores.fecha_fin[0]}</p>}
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
      <button onClick={() => setForm({ nombre: '', fecha_inicio: '', fecha_fin: '' })}>+ Nuevo periodo</button>
      {datos.length === 0 ? (
        <p>Todavía no hay periodos registrados.</p>
      ) : (
        <table>
          <thead><tr><th>Nombre</th><th>Inicio</th><th>Fin</th><th>Acciones</th></tr></thead>
          <tbody>
            {datos.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.fecha_inicio}</td>
                <td>{p.fecha_fin}</td>
                <td>
                  <button onClick={() => setForm(p)}>Editar</button>
                  <button onClick={() => handleEliminar(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}