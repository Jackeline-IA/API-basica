from django.contrib import admin
from .models import (
    Profesor, Materia, Curso, Periodo,
    Estudiante, Matricula, Evaluacion, Calificacion
)


@admin.register(Profesor)
class ProfesorAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'documento', 'email')
    search_fields = ('nombre', 'documento')


@admin.register(Materia)
class MateriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'creditos', 'profesor')
    list_filter = ('profesor',)


@admin.register(Curso)
class CursoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'jornada')


@admin.register(Periodo)
class PeriodoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'fecha_inicio', 'fecha_fin')


@admin.register(Estudiante)
class EstudianteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'documento', 'email')
    search_fields = ('nombre', 'documento')


@admin.register(Matricula)
class MatriculaAdmin(admin.ModelAdmin):
    list_display = ('estudiante', 'curso', 'periodo', 'fecha_matricula')
    list_filter = ('curso', 'periodo')


@admin.register(Evaluacion)
class EvaluacionAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'materia', 'periodo', 'porcentaje')
    list_filter = ('materia', 'periodo')


@admin.register(Calificacion)
class CalificacionAdmin(admin.ModelAdmin):
    list_display = ('estudiante', 'evaluacion', 'nota')
    list_filter = ('evaluacion',)
    search_fields = ('estudiante__nombre',)