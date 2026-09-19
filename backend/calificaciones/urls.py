from rest_framework.routers import DefaultRouter
from .views import (
    EstudianteViewSet, DocenteViewSet, CursoViewSet, MateriaViewSet,
    PeriodoViewSet, MatriculaViewSet, EvaluacionViewSet, CalificacionViewSet,
)

router = DefaultRouter()
router.register(r'estudiantes', EstudianteViewSet)
router.register(r'docentes', DocenteViewSet)
router.register(r'cursos', CursoViewSet)
router.register(r'materias', MateriaViewSet)
router.register(r'periodos', PeriodoViewSet)
router.register(r'matriculas', MatriculaViewSet)
router.register(r'evaluaciones', EvaluacionViewSet)
router.register(r'calificaciones', CalificacionViewSet)

urlpatterns = router.urls