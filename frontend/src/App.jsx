import { EstudianteLista } from './components/EstudianteLista';
import { DocenteLista } from './components/DocenteLista';
import { CursoLista } from './components/CursoLista';
import { MateriaLista } from './components/MateriaLista';
import { PeriodoLista } from './components/PeriodoLista';
import { MatriculaLista } from './components/MatriculaLista';
import { EvaluacionLista } from './components/EvaluacionLista';
import { CalificacionLista } from './components/CalificacionLista';

function App() {
  return (
    <div>
      <h1>Registro de Calificaciones</h1>
      <h2>Estudiantes</h2><EstudianteLista />
      <h2>Docentes</h2><DocenteLista />
      <h2>Cursos</h2><CursoLista />
      <h2>Materias</h2><MateriaLista />
      <h2>Periodos</h2><PeriodoLista />
      <h2>Matrículas</h2><MatriculaLista />
      <h2>Evaluaciones</h2><EvaluacionLista />
      <h2>Calificaciones</h2><CalificacionLista />
    </div>
  );
}

export default App;