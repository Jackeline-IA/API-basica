from django.contrib import admin
from .models import Estudiante, Materia, Calificacion


@admin.register(Estudiante)
class EstudianteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'documento', 'email')
    search_fields = ('nombre', 'documento')


@admin.register(Materia)
class MateriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'creditos')


@admin.register(Calificacion)
class CalificacionAdmin(admin.ModelAdmin):
    list_display = ('estudiante', 'materia', 'nota', 'periodo')
    list_filter = ('periodo', 'materia')
    search_fields = ('estudiante__nombre',)