import { useEffect, useState } from 'react';
import { listar, crear, actualizar, eliminar } from '../api/matriculas';
import { listar as listarEstudiantes } from '../api/estudiantes';
import { listar as listarCursos } from '../api/cursos';
import { listar as listarPeriodos } from '../api/periodos';

export function MatriculaLista() {
  const [datos, setDatos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);
  const [errores, setErrores] = useState({});

  const cargarDatos = () => {
    setCargando(true);
    listar()
      .then((r) => setDatos(r.results))
      .catch(() => setError('No se pudo cargar la lista de matrículas.'))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarDatos();
    listarEstudiantes().then((r) => setEstudiantes(r.results));
    listarCursos().then((r) => setCursos(r.results));
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
    if (!confirm('¿Eliminar esta matrícula?')) return;
    await eliminar(id);
    cargarDatos();
  };

  if (form) {
    return (
      <form onSubmit={handleSubmit}>
        <h3>{form.id ? 'Editar matrícula' : 'Nueva matrícula'}</h3>
        <div>
          <label>Estudiante</label>
          <select value={form.estudiante} onChange={(e) => setForm({ ...form, estudiante: e.target.value })} required>
            <option value="">Seleccione…</option>
            {estudiantes.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
          </select>
          {errores.estudiante?.[0] && <p role="alert">{errores.estudiante[0]}</p>}
        </div>
        <div>
          <label>Curso</label>
          <select value={form.curso} onChange={(e) => setForm({ ...form, curso: e.target.value })} required>
            <option value="">Seleccione…</option>
            {cursos.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
          {errores.curso?.[0] && <p role="alert">{errores.curso[0]}</p>}
        </div>
        <div>
          <label>Periodo</label>
          <select value={form.periodo} onChange={(e) => setForm({ ...form, periodo: e.target.value })} required>
            <option value="">Seleccione…</option>
            {periodos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
          {errores.periodo?.[0] && <p role="alert">{errores.periodo[0]}</p>}
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
      <button onClick={() => setForm({ estudiante: '', curso: '', periodo: '' })}>+ Nueva matrícula</button>
      {datos.length === 0 ? (
        <p>Todavía no hay matrículas registradas.</p>
      ) : (
        <table>
          <thead><tr><th>Estudiante</th><th>Curso</th><th>Acciones</th></tr></thead>
          <tbody>
            {datos.map((m) => (
              <tr key={m.id}>
                <td>{m.estudiante_nombre}</td>
                <td>{m.curso_nombre}</td>
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