# Generated by Django 5.1.3 on 2025-06-10 02:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_rename_profile_picture_user_profile_photo_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='profile_photo',
            field=models.ImageField(default='photos/defaults/user_default_photo.jpg', upload_to='photos/%y/%m/%d'),
        ),
    ]
