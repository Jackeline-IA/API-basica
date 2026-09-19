from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Profesor(models.Model):
    nombre = models.CharField(max_length=100)
    documento = models.CharField(max_length=20, unique=True)
    email = models.EmailField(blank=True, null=True)

    class Meta:
        ordering = ['nombre']
        verbose_name_plural = 'Profesores'

    def __str__(self):
        return self.nombre


class Materia(models.Model):
    nombre = models.CharField(max_length=100)
    creditos = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)],
    )
    profesor = models.ForeignKey(
        Profesor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='materias',
    )

    class Meta:
        ordering = ['nombre']
        verbose_name_plural = 'Materias'

    def __str__(self):
        return self.nombre


class Curso(models.Model):
    nombre = models.CharField(max_length=50) 
    jornada = models.CharField(max_length=20, blank=True) 

    class Meta:
        ordering = ['nombre']
        verbose_name_plural = 'Cursos'

    def __str__(self):
        return self.nombre


class Periodo(models.Model):
    nombre = models.CharField(max_length=20, unique=True) 
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()

    class Meta:
        ordering = ['-fecha_inicio']
        verbose_name_plural = 'Periodos'

    def __str__(self):
        return self.nombre


class Estudiante(models.Model):
    nombre = models.CharField(max_length=100)
    documento = models.CharField(max_length=20, unique=True)
    email = models.EmailField(blank=True, null=True)

    class Meta:
        ordering = ['nombre']
        verbose_name_plural = 'Estudiantes'

    def __str__(self):
        return self.nombre


class Matricula(models.Model):
    estudiante = models.ForeignKey(
        Estudiante,
        on_delete=models.CASCADE,
        related_name='matriculas',
    )
    curso = models.ForeignKey(
        Curso,
        on_delete=models.PROTECT,
        related_name='matriculas',
    )
    periodo = models.ForeignKey(
        Periodo,
        on_delete=models.PROTECT,
        related_name='matriculas',
    )
    fecha_matricula = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('estudiante', 'curso', 'periodo')
        ordering = ['-fecha_matricula', 'id']
        verbose_name_plural = 'Matrículas'

    def __str__(self):
        return f"{self.estudiante.nombre} - {self.curso.nombre} ({self.periodo.nombre})"


class Evaluacion(models.Model):
    materia = models.ForeignKey(
        Materia,
        on_delete=models.PROTECT,
        related_name='evaluaciones',
    )
    periodo = models.ForeignKey(
        Periodo,
        on_delete=models.PROTECT,
        related_name='evaluaciones',
    )
    nombre = models.CharField(max_length=100)
    porcentaje = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )

    class Meta:
        ordering = ['nombre']
        verbose_name_plural = 'Evaluaciones'

    def __str__(self):
        return f"{self.nombre} - {self.materia.nombre}"


class Calificacion(models.Model):
    estudiante = models.ForeignKey(
        Estudiante,
        on_delete=models.CASCADE,
        related_name='calificaciones',
    )
    evaluacion = models.ForeignKey(
        Evaluacion,
        on_delete=models.PROTECT,
        related_name='calificaciones',
    )
    nota = models.DecimalField(
        max_digits=3,
        decimal_places=1,  # ej: 4.5
        validators=[MinValueValidator(0), MaxValueValidator(5)],
    )

    class Meta:
        unique_together = ('estudiante', 'evaluacion')
        ordering = ['id']
        verbose_name_plural = 'Calificaciones'

    def __str__(self):
        return f"{self.estudiante.nombre} - {self.evaluacion.nombre}: {self.nota}"