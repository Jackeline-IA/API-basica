from django.db import models


class Estudiante(models.Model):
    nombre = models.CharField(max_length=150)
    documento = models.CharField(max_length=20, unique=True)
    email = models.EmailField(blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Docente(models.Model):
    nombre = models.CharField(max_length=150)
    documento = models.CharField(max_length=20, unique=True)
    email = models.EmailField(blank=True)
    especialidad = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Curso(models.Model):
    nombre = models.CharField(max_length=20)
    jornada = models.CharField(
        max_length=10,
        choices=[('MAÑANA', 'Mañana'), ('TARDE', 'Tarde'), ('NOCHE', 'Noche')],
        default='MAÑANA',
    )

    class Meta:
        ordering = ['nombre']

    def __str__(self):
        return f"{self.nombre} ({self.jornada})"


class Materia(models.Model):
    nombre = models.CharField(max_length=100)
    creditos = models.PositiveIntegerField(default=1)
    profesor = models.ForeignKey(
        Docente, on_delete=models.PROTECT, related_name='materias'
    )

    class Meta:
        ordering = ['nombre']
        verbose_name_plural = 'Materias'

    def __str__(self):
        return self.nombre


class Periodo(models.Model):
    nombre = models.CharField(max_length=40)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()

    class Meta:
        ordering = ['fecha_inicio']

    def __str__(self):
        return self.nombre


class Matricula(models.Model):
    estudiante = models.ForeignKey(
        Estudiante, on_delete=models.PROTECT, related_name='matriculas'
    )
    curso = models.ForeignKey(
        Curso, on_delete=models.PROTECT, related_name='matriculas'
    )
    periodo = models.ForeignKey(
        Periodo, on_delete=models.PROTECT, related_name='matriculas'
    )
    fecha_matricula = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ['-fecha_matricula']
        unique_together = ('estudiante', 'curso', 'periodo')

    def __str__(self):
        return f"{self.estudiante} - {self.curso} - {self.periodo}"


class Evaluacion(models.Model):
    nombre = models.CharField(max_length=100)
    materia = models.ForeignKey(
        Materia, on_delete=models.CASCADE, related_name='evaluaciones'
    )
    periodo = models.ForeignKey(
        Periodo, on_delete=models.PROTECT, related_name='evaluaciones'
    )
    porcentaje = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        ordering = ['periodo', 'materia']

    def __str__(self):
        return f"{self.nombre} - {self.materia}"


class Calificacion(models.Model):
    estudiante = models.ForeignKey(
        Estudiante, on_delete=models.CASCADE, related_name='calificaciones'
    )
    evaluacion = models.ForeignKey(
        Evaluacion, on_delete=models.CASCADE, related_name='calificaciones'
    )
    nota = models.DecimalField(max_digits=3, decimal_places=1)

    class Meta:
        ordering = ['evaluacion']
        unique_together = ('estudiante', 'evaluacion')

    def __str__(self):
        return f"{self.estudiante} - {self.evaluacion}: {self.nota}"