from django.db import models


class Profesor(models.Model):
    nombre = models.CharField(max_length=100)
    documento = models.CharField(max_length=20, unique=True)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return self.nombre


class Materia(models.Model):
    nombre = models.CharField(max_length=100)
    creditos = models.PositiveIntegerField(default=1)
    profesor = models.ForeignKey(Profesor, on_delete=models.SET_NULL, null=True, blank=True, related_name='materias')

    def __str__(self):
        return self.nombre


class Curso(models.Model):
    nombre = models.CharField(max_length=50)  # ej: "10-A"
    jornada = models.CharField(max_length=20, blank=True)  # ej: "Mañana"

    def __str__(self):
        return self.nombre


class Periodo(models.Model):
    nombre = models.CharField(max_length=20, unique=True)  # ej: "2026-1"
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()

    def __str__(self):
        return self.nombre


class Estudiante(models.Model):
    nombre = models.CharField(max_length=100)
    documento = models.CharField(max_length=20, unique=True)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return self.nombre


class Matricula(models.Model):
    estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE, related_name='matriculas')
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name='matriculas')
    periodo = models.ForeignKey(Periodo, on_delete=models.CASCADE, related_name='matriculas')
    fecha_matricula = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.estudiante.nombre} - {self.curso.nombre} ({self.periodo.nombre})"

    class Meta:
        unique_together = ('estudiante', 'curso', 'periodo')


class Evaluacion(models.Model):
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE, related_name='evaluaciones')
    periodo = models.ForeignKey(Periodo, on_delete=models.CASCADE, related_name='evaluaciones')
    nombre = models.CharField(max_length=100)  # ej: "Parcial 1"
    porcentaje = models.DecimalField(max_digits=5, decimal_places=2)  # ej: 30.00

    def __str__(self):
        return f"{self.nombre} - {self.materia.nombre}"


class Calificacion(models.Model):
    estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE, related_name='calificaciones')
    evaluacion = models.ForeignKey(Evaluacion, on_delete=models.CASCADE, related_name='calificaciones')
    nota = models.DecimalField(max_digits=3, decimal_places=1)  # ej: 4.5

    def __str__(self):
        return f"{self.estudiante.nombre} - {self.evaluacion.nombre}: {self.nota}"

    class Meta:
        unique_together = ('estudiante', 'evaluacion')