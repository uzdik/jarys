from django.urls import path
from . import views

urlpatterns = [
    path('', views.race, name='race'),
]
