from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    Estudiante, Docente, Curso, Materia,
    Periodo, Matricula, Evaluacion, Calificacion,
)
from .serializers import (
    EstudianteSerializer, DocenteSerializer, CursoSerializer, MateriaSerializer,
    PeriodoSerializer, MatriculaSerializer, EvaluacionSerializer, CalificacionSerializer,
)


class EstudianteViewSet(viewsets.ModelViewSet):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer
    search_fields = ['nombre', 'documento']

    @action(detail=True, methods=['get'])
    def boletin(self, request, pk=None):
        """GET /api/estudiantes/5/boletin/ — todas las notas de este estudiante."""
        estudiante = self.get_object()
        calificaciones = estudiante.calificaciones.select_related(
            'evaluacion', 'evaluacion__materia'
        )
        serializer = CalificacionSerializer(calificaciones, many=True)
        return Response({
            'estudiante': estudiante.nombre,
            'calificaciones': serializer.data,
        })


class DocenteViewSet(viewsets.ModelViewSet):
    queryset = Docente.objects.all()
    serializer_class = DocenteSerializer
    search_fields = ['nombre', 'documento']


class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer
    filterset_fields = ['jornada']


class MateriaViewSet(viewsets.ModelViewSet):
    queryset = Materia.objects.select_related('profesor').all()
    serializer_class = MateriaSerializer
    filterset_fields = ['profesor']


class PeriodoViewSet(viewsets.ModelViewSet):
    queryset = Periodo.objects.all()
    serializer_class = PeriodoSerializer


class MatriculaViewSet(viewsets.ModelViewSet):
    queryset = Matricula.objects.select_related('estudiante', 'curso', 'periodo').all()
    serializer_class = MatriculaSerializer
    filterset_fields = ['curso', 'periodo']


class EvaluacionViewSet(viewsets.ModelViewSet):
    queryset = Evaluacion.objects.select_related('materia', 'periodo').all()
    serializer_class = EvaluacionSerializer
    filterset_fields = ['materia', 'periodo']


class CalificacionViewSet(viewsets.ModelViewSet):
    queryset = Calificacion.objects.select_related('estudiante', 'evaluacion').all()
    serializer_class = CalificacionSerializer
    filterset_fields = ['evaluacion']
    search_fields = ['estudiante__nombre']