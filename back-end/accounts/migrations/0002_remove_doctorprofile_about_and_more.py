# Generated by Django 5.1.3 on 2025-05-20 05:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='doctorprofile',
            name='about',
        ),
        migrations.RemoveField(
            model_name='doctorprofile',
            name='skills',
        ),
    ]
