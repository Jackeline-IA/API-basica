from rest_framework import serializers
from .models import (
    Profesor, Materia, Curso, Periodo,
    Estudiante, Matricula, Evaluacion, Calificacion
)


class ProfesorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profesor
        fields = '__all__'


class MateriaSerializer(serializers.ModelSerializer):
    profesor_nombre = serializers.CharField(source='profesor.nombre', read_only=True)

    class Meta:
        model = Materia
        fields = '__all__'


class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = '__all__'


class PeriodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Periodo
        fields = '__all__'


class EstudianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudiante
        fields = '__all__'


class MatriculaSerializer(serializers.ModelSerializer):
    estudiante_nombre = serializers.CharField(source='estudiante.nombre', read_only=True)
    curso_nombre = serializers.CharField(source='curso.nombre', read_only=True)
    periodo_nombre = serializers.CharField(source='periodo.nombre', read_only=True)

    class Meta:
        model = Matricula
        fields = '__all__'


class EvaluacionSerializer(serializers.ModelSerializer):
    materia_nombre = serializers.CharField(source='materia.nombre', read_only=True)

    class Meta:
        model = Evaluacion
        fields = '__all__'


class CalificacionSerializer(serializers.ModelSerializer):
    estudiante_nombre = serializers.CharField(source='estudiante.nombre', read_only=True)
    evaluacion_nombre = serializers.CharField(source='evaluacion.nombre', read_only=True)

    class Meta:
        model = Calificacion
        fields = '__all__'