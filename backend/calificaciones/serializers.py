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
from decimal import Decimal

from django.db.models import Sum
from rest_framework import serializers

from .models import (
    Profesor, Materia, Curso, Periodo,
    Estudiante, Matricula, Evaluacion, Calificacion,
)


class ProfesorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profesor
        fields = ['id', 'nombre', 'documento', 'email']


class MateriaSerializer(serializers.ModelSerializer):
    # allow_null=True: si la materia no tiene profesor, devuelve null
    # en vez de omitir el campo del JSON.
    profesor_nombre = serializers.CharField(
        source='profesor.nombre', read_only=True, allow_null=True
    )

    class Meta:
        model = Materia
        fields = ['id', 'nombre', 'creditos', 'profesor', 'profesor_nombre']


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
    def validate(self, data):
        """Valida combinaciones entre campos (también en PATCH)."""
        inicio = data.get('fecha_inicio', getattr(self.instance, 'fecha_inicio', None))
        fin = data.get('fecha_fin', getattr(self.instance, 'fecha_fin', None))
        if inicio and fin and fin <= inicio:
            raise serializers.ValidationError(
                {'fecha_fin': 'La fecha de fin debe ser posterior a la fecha de inicio.'}
            )
        return data


class EstudianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudiante
        fields = ['id', 'nombre', 'documento', 'email']


class MatriculaSerializer(serializers.ModelSerializer):
    estudiante_nombre = serializers.CharField(source='estudiante.nombre', read_only=True)
    curso_nombre = serializers.CharField(source='curso.nombre', read_only=True)
    periodo_nombre = serializers.CharField(source='periodo.nombre', read_only=True)

    class Meta:
        model = Matricula
        fields = [
            'id', 'estudiante', 'estudiante_nombre',
            'curso', 'curso_nombre', 'periodo', 'fecha_matricula',
            'curso', 'curso_nombre',
            'periodo', 'periodo_nombre',
            'fecha_matricula',
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
    materia_nombre = serializers.CharField(source='materia.nombre', read_only=True)
    periodo_nombre = serializers.CharField(source='periodo.nombre', read_only=True)

    class Meta:
        model = Evaluacion
        fields = [
            'id', 'nombre', 'porcentaje',
            'materia', 'materia_nombre',
            'periodo', 'periodo_nombre',
        ]

    def validate(self, data):
        """Los porcentajes de una materia en un periodo no pueden pasar de 100."""
        materia = data.get('materia', getattr(self.instance, 'materia', None))
        periodo = data.get('periodo', getattr(self.instance, 'periodo', None))
        porcentaje = data.get('porcentaje', getattr(self.instance, 'porcentaje', None))

        if materia and periodo and porcentaje is not None:
            otras = Evaluacion.objects.filter(materia=materia, periodo=periodo)
            if self.instance: 
                otras = otras.exclude(pk=self.instance.pk)
            usado = otras.aggregate(total=Sum('porcentaje'))['total'] or Decimal('0')
            disponible = Decimal('100') - usado
            if porcentaje > disponible:
                raise serializers.ValidationError(
                    {'porcentaje': f'Solo queda {disponible}% disponible para esta '
                                   f'materia en este periodo. Reduzca el porcentaje.'}
                )
        return data


class CalificacionSerializer(serializers.ModelSerializer):
    estudiante_nombre = serializers.CharField(source='estudiante.nombre', read_only=True)
    evaluacion_nombre = serializers.CharField(source='evaluacion.nombre', read_only=True)
    materia_nombre = serializers.CharField(
        source='evaluacion.materia.nombre', read_only=True
    )

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
        return value [
            'evaluacion', 'evaluacion_nombre',
            'materia_nombre', 'nota',
        ]
