import { useState } from 'react';
import { crear, actualizar } from '../api/estudiantes';

export function EstudianteForm({ estudianteEditar, onGuardado, onCancelar }) {
  const [datos, setDatos] = useState(
    estudianteEditar || { nombre: '', documento: '', email: '', fecha_nacimiento: '' }
  );
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setErrores({});
    try {
      if (estudianteEditar) {
        await actualizar(estudianteEditar.id, datos);
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
      <h3>{estudianteEditar ? 'Editar estudiante' : 'Nuevo estudiante'}</h3>

      <div>
        <label>Nombre</label>
        <input name="nombre" value={datos.nombre} onChange={handleChange} required />
        {errores.nombre?.[0] && <p role="alert">{errores.nombre[0]}</p>}
      </div>

      <div>
        <label>Documento</label>
        <input name="documento" value={datos.documento} onChange={handleChange} required />
        {errores.documento?.[0] && <p role="alert">{errores.documento[0]}</p>}
      </div>

      <div>
        <label>Email</label>
        <input name="email" type="email" value={datos.email} onChange={handleChange} />
        {errores.email?.[0] && <p role="alert">{errores.email[0]}</p>}
      </div>

      <div>
        <label>Fecha de nacimiento</label>
        <input
          name="fecha_nacimiento"
          type="date"
          value={datos.fecha_nacimiento || ''}
          onChange={handleChange}
        />
        {errores.fecha_nacimiento?.[0] && <p role="alert">{errores.fecha_nacimiento[0]}</p>}
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