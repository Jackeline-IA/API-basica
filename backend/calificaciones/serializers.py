from rest_framework import serializers
from .models import (
    Estudiante, Docente, Curso, Materia,
    Periodo, Matricula, Evaluacion, Calificacion,
)


class EstudianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudiante
        fields = ['id', 'nombre', 'documento', 'email', 'fecha_nacimiento']


class DocenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Docente
        fields = ['id', 'nombre', 'documento', 'email', 'especialidad']


class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = ['id', 'nombre', 'jornada']


class MateriaSerializer(serializers.ModelSerializer):
    profesor_nombre = serializers.ReadOnlyField(source='profesor.nombre')

    class Meta:
        model = Materia
        fields = ['id', 'nombre', 'creditos', 'profesor', 'profesor_nombre']


class PeriodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Periodo
        fields = ['id', 'nombre', 'fecha_inicio', 'fecha_fin']


class MatriculaSerializer(serializers.ModelSerializer):
    estudiante_nombre = serializers.ReadOnlyField(source='estudiante.nombre')
    curso_nombre = serializers.ReadOnlyField(source='curso.nombre')

    class Meta:
        model = Matricula
        fields = [
            'id', 'estudiante', 'estudiante_nombre',
            'curso', 'curso_nombre', 'periodo', 'fecha_matricula',
        ]
        read_only_fields = ['fecha_matricula']


class EvaluacionSerializer(serializers.ModelSerializer):
    materia_nombre = serializers.ReadOnlyField(source='materia.nombre')

    class Meta:
        model = Evaluacion
        fields = ['id', 'nombre', 'materia', 'materia_nombre', 'periodo', 'porcentaje']

    def validate_porcentaje(self, value):
        if value <= 0 or value > 100:
            raise serializers.ValidationError(
                'El porcentaje debe estar entre 0 y 100.'
            )
        return value


class CalificacionSerializer(serializers.ModelSerializer):
    estudiante_nombre = serializers.ReadOnlyField(source='estudiante.nombre')
    evaluacion_nombre = serializers.ReadOnlyField(source='evaluacion.nombre')

    class Meta:
        model = Calificacion
        fields = [
            'id', 'estudiante', 'estudiante_nombre',
            'evaluacion', 'evaluacion_nombre', 'nota',
        ]

    def validate_nota(self, value):
        if value < 0 or value > 5:
            raise serializers.ValidationError(
                'La nota debe estar entre 0.0 y 5.0.'
            )
        return value