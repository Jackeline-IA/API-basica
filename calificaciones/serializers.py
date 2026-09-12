from rest_framework import serializers
from .models import Estudiante, Materia, Calificacion


class EstudianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudiante
        fields = '__all__'


class MateriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materia
        fields = '__all__'


class CalificacionSerializer(serializers.ModelSerializer):
    estudiante_nombre = serializers.CharField(source='estudiante.nombre', read_only=True)
    materia_nombre = serializers.CharField(source='materia.nombre', read_only=True)

    class Meta:
        model = Calificacion
        fields = ['id', 'estudiante', 'estudiante_nombre', 'materia', 'materia_nombre', 'nota', 'periodo']