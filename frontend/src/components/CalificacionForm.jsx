import { useEffect, useState } from 'react';
import { crear, actualizar } from '../api/calificaciones';
import { listar as listarEstudiantes } from '../api/estudiantes';
import { listar as listarEvaluaciones } from '../api/evaluaciones';

export function CalificacionForm({ calificacionEditar, onGuardado, onCancelar }) {
  const [datos, setDatos] = useState(
    calificacionEditar || { estudiante: '', evaluacion: '', nota: '' }
  );
  const [estudiantes, setEstudiantes] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    listarEstudiantes().then((r) => setEstudiantes(r.results));
    listarEvaluaciones().then((r) => setEvaluaciones(r.results));
  }, []);

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setErrores({});
    try {
      if (calificacionEditar) {
        await actualizar(calificacionEditar.id, datos);
      } else {
        await crear(datos);
      }
      onGuardado();
    } catch (err) {
      if (err.response?.status === 400) {
        setErrores(err.response.data);
      } else {
        setErrores({ general: ['Error de conexión con el servidor.'] });
      }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{calificacionEditar ? 'Editar calificación' : 'Nueva calificación'}</h3>

      <div>
        <label>Estudiante</label>
        <select name="estudiante" value={datos.estudiante} onChange={handleChange} required>
          <option value="">Seleccione…</option>
          {estudiantes.map((est) => (
            <option key={est.id} value={est.id}>
              {est.nombre} ({est.documento})
            </option>
          ))}
        </select>
        {errores.estudiante?.[0] && <p role="alert">{errores.estudiante[0]}</p>}
      </div>

      <div>
        <label>Evaluación</label>
        <select name="evaluacion" value={datos.evaluacion} onChange={handleChange} required>
          <option value="">Seleccione…</option>
          {evaluaciones.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.nombre} — {ev.materia_nombre}
            </option>
          ))}
        </select>
        {errores.evaluacion?.[0] && <p role="alert">{errores.evaluacion[0]}</p>}
      </div>

      <div>
        <label>Nota</label>
        <input
          name="nota"
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={datos.nota}
          onChange={handleChange}
          required
        />
        {errores.nota?.[0] && <p role="alert">{errores.nota[0]}</p>}
      </div>

      {errores.general?.[0] && <p role="alert">{errores.general[0]}</p>}

      <button type="submit" disabled={guardando}>
        {guardando ? 'Guardando…' : 'Guardar'}
      </button>
      <button type="button" onClick={onCancelar}>
        Cancelar
      </button>
    </form>
  );
}