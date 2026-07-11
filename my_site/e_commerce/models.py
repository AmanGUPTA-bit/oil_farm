


# Create your models here.
from django.db import models

CATEGORY_CHOICES = [
    ('mo', 'mustard oil'),
    ('gn', 'groundnut oil'),
    ('so', 'sesame oil'),
    ('co', 'coconut oil'),
]

class review(models.Model):
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    interest = models.CharField(max_length=2, choices=CATEGORY_CHOICES)
    message = models.TextField()

    def __str__(self):
        return self.name