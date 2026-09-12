from django.db import models


class Estudiante(models.Model):
    nombre = models.CharField(max_length=100)
    documento = models.CharField(max_length=20, unique=True)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return self.nombre


class Materia(models.Model):
    nombre = models.CharField(max_length=100)
    creditos = models.PositiveIntegerField(default=1)

    def __str__(self):
        return self.nombre


class Calificacion(models.Model):
    estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE, related_name='calificaciones')
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE, related_name='calificaciones')
    nota = models.DecimalField(max_digits=3, decimal_places=1)  # ej: 4.5
    periodo = models.CharField(max_length=20)  # ej: "2026-1"

    def __str__(self):
        return f"{self.estudiante.nombre} - {self.materia.nombre}: {self.nota}"

    class Meta:
        unique_together = ('estudiante', 'materia', 'periodo')