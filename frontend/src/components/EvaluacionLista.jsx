import { useEffect, useState } from 'react';
import { listar, crear, actualizar, eliminar } from '../api/evaluaciones';
import { listar as listarMaterias } from '../api/materias';
import { listar as listarPeriodos } from '../api/periodos';

export function EvaluacionLista() {
  const [datos, setDatos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);
  const [errores, setErrores] = useState({});

  const cargarDatos = () => {
    setCargando(true);
    listar()
      .then((r) => setDatos(r.results))
      .catch(() => setError('No se pudo cargar la lista de evaluaciones.'))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarDatos();
    listarMaterias().then((r) => setMaterias(r.results));
    listarPeriodos().then((r) => setPeriodos(r.results));
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
    if (!confirm('¿Eliminar esta evaluación?')) return;
    await eliminar(id);
    cargarDatos();
  };

  if (form) {
    return (
      <form onSubmit={handleSubmit}>
        <h3>{form.id ? 'Editar evaluación' : 'Nueva evaluación'}</h3>
        <div>
          <label>Nombre</label>
          <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          {errores.nombre?.[0] && <p role="alert">{errores.nombre[0]}</p>}
        </div>
        <div>
          <label>Materia</label>
          <select value={form.materia} onChange={(e) => setForm({ ...form, materia: e.target.value })} required>
            <option value="">Seleccione…</option>
            {materias.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select>
          {errores.materia?.[0] && <p role="alert">{errores.materia[0]}</p>}
        </div>
        <div>
          <label>Periodo</label>
          <select value={form.periodo} onChange={(e) => setForm({ ...form, periodo: e.target.value })} required>
            <option value="">Seleccione…</option>
            {periodos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
          {errores.periodo?.[0] && <p role="alert">{errores.periodo[0]}</p>}
        </div>
        <div>
          <label>Porcentaje</label>
          <input type="number" step="0.01" min="0" max="100" value={form.porcentaje} onChange={(e) => setForm({ ...form, porcentaje: e.target.value })} required />
          {errores.porcentaje?.[0] && <p role="alert">{errores.porcentaje[0]}</p>}
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
      <button onClick={() => setForm({ nombre: '', materia: '', periodo: '', porcentaje: '' })}>
        + Nueva evaluación
      </button>
      {datos.length === 0 ? (
        <p>Todavía no hay evaluaciones registradas.</p>
      ) : (
        <table>
          <thead><tr><th>Nombre</th><th>Materia</th><th>Porcentaje</th><th>Acciones</th></tr></thead>
          <tbody>
            {datos.map((ev) => (
              <tr key={ev.id}>
                <td>{ev.nombre}</td>
                <td>{ev.materia_nombre}</td>
                <td>{ev.porcentaje}%</td>
                <td>
                  <button onClick={() => setForm(ev)}>Editar</button>
                  <button onClick={() => handleEliminar(ev.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}