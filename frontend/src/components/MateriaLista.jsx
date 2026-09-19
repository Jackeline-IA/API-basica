import { useEffect, useState } from 'react';
import { listar, crear, actualizar, eliminar } from '../api/materias';
import { listar as listarDocentes } from '../api/docentes';

export function MateriaLista() {
  const [datos, setDatos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);
  const [errores, setErrores] = useState({});

  const cargarDatos = () => {
    setCargando(true);
    listar()
      .then((r) => setDatos(r.results))
      .catch(() => setError('No se pudo cargar la lista de materias.'))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarDatos();
    listarDocentes().then((r) => setDocentes(r.results));
  }, []);

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
    if (!confirm('¿Eliminar esta materia?')) return;
    await eliminar(id);
    cargarDatos();
  };

  if (form) {
    return (
      <form onSubmit={handleSubmit}>
        <h3>{form.id ? 'Editar materia' : 'Nueva materia'}</h3>
        <div>
          <label>Nombre</label>
          <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          {errores.nombre?.[0] && <p role="alert">{errores.nombre[0]}</p>}
        </div>
        <div>
          <label>Créditos</label>
          <input type="number" min="1" value={form.creditos} onChange={(e) => setForm({ ...form, creditos: e.target.value })} required />
        </div>
        <div>
          <label>Profesor</label>
          <select value={form.profesor} onChange={(e) => setForm({ ...form, profesor: e.target.value })} required>
            <option value="">Seleccione…</option>
            {docentes.map((d) => <option key={d.id} value={d.id}>{d.nombre}</option>)}
          </select>
          {errores.profesor?.[0] && <p role="alert">{errores.profesor[0]}</p>}
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
      <button onClick={() => setForm({ nombre: '', creditos: 1, profesor: '' })}>+ Nueva materia</button>
      {datos.length === 0 ? (
        <p>Todavía no hay materias registradas.</p>
      ) : (
        <table>
          <thead><tr><th>Nombre</th><th>Créditos</th><th>Profesor</th><th>Acciones</th></tr></thead>
          <tbody>
            {datos.map((m) => (
              <tr key={m.id}>
                <td>{m.nombre}</td>
                <td>{m.creditos}</td>
                <td>{m.profesor_nombre}</td>
                <td>
                  <button onClick={() => setForm(m)}>Editar</button>
                  <button onClick={() => handleEliminar(m.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}