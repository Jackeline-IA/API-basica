from rest_framework.routers import DefaultRouter
from .views import EstudianteViewSet, MateriaViewSet, CalificacionViewSet

router = DefaultRouter()
router.register(r'estudiantes', EstudianteViewSet)
router.register(r'materias', MateriaViewSet)
router.register(r'calificaciones', CalificacionViewSet)

urlpatterns = router.urls