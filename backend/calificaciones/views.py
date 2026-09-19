from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    Profesor, Materia, Curso, Periodo,
    Estudiante, Matricula, Evaluacion, Calificacion
)
from .serializers import (
    ProfesorSerializer, MateriaSerializer, CursoSerializer, PeriodoSerializer,
    EstudianteSerializer, MatriculaSerializer, EvaluacionSerializer, CalificacionSerializer
)


class ProfesorViewSet(viewsets.ModelViewSet):
    queryset = Profesor.objects.all()
    serializer_class = ProfesorSerializer


class MateriaViewSet(viewsets.ModelViewSet):
    queryset = Materia.objects.all()
    serializer_class = MateriaSerializer


class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer


class PeriodoViewSet(viewsets.ModelViewSet):
    queryset = Periodo.objects.all()
    serializer_class = PeriodoSerializer


class EstudianteViewSet(viewsets.ModelViewSet):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer

    @action(detail=True, methods=['get'])
    def boletin(self, request, pk=None):
        # Ejemplo: GET /api/estudiantes/1/boletin/?periodo=2026-1
        estudiante = self.get_object()
        periodo_nombre = request.query_params.get('periodo')

        if not periodo_nombre:
            return Response({'error': 'Debes indicar un periodo, ejemplo: ?periodo=2026-1'}, status=400)

        calificaciones = Calificacion.objects.filter(
            estudiante=estudiante,
            evaluacion__periodo__nombre=periodo_nombre
        )

        # Agrupamos las calificaciones por materia usando un diccionario simple
        materias = {}

        for calificacion in calificaciones:
            materia = calificacion.evaluacion.materia
            nota = calificacion.nota
            porcentaje = calificacion.evaluacion.porcentaje

            if materia.id not in materias:
                materias[materia.id] = {
                    'materia': materia.nombre,
                    'evaluaciones': [],
                    'suma_ponderada': 0,
                    'suma_porcentajes': 0,
                }

            materias[materia.id]['evaluaciones'].append({
                'nombre': calificacion.evaluacion.nombre,
                'porcentaje': porcentaje,
                'nota': nota,
            })
            materias[materia.id]['suma_ponderada'] += nota * porcentaje
            materias[materia.id]['suma_porcentajes'] += porcentaje

        # Calculamos la nota final de cada materia: promedio ponderado por porcentaje
        materias_lista = []
        for datos in materias.values():
            if datos['suma_porcentajes'] > 0:
                nota_final = round(datos['suma_ponderada'] / datos['suma_porcentajes'], 2)
            else:
                nota_final = None

            materias_lista.append({
                'materia': datos['materia'],
                'nota_final': nota_final,
                'evaluaciones': datos['evaluaciones'],
            })

        return Response({
            'estudiante': estudiante.nombre,
            'periodo': periodo_nombre,
            'materias': materias_lista,
        })


class MatriculaViewSet(viewsets.ModelViewSet):
    queryset = Matricula.objects.all()
    serializer_class = MatriculaSerializer


class EvaluacionViewSet(viewsets.ModelViewSet):
    queryset = Evaluacion.objects.all()
    serializer_class = EvaluacionSerializer


class CalificacionViewSet(viewsets.ModelViewSet):
    queryset = Calificacion.objects.all()
    serializer_class = CalificacionSerializer