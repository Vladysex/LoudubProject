from django.contrib import admin
from django.urls import path
from . import views
from .views import sign_up, CustomLoginView, logout_view, contact_us, admin_mail_view, delete_message, update_message
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('', views.home, name='home'),
    path('contact/', contact_us, name='contact'),
    path('about/', views.about, name='about'),
    path('register/', sign_up, name='sign_up'),
    path('login/', CustomLoginView.as_view(), name='log_in'),
    path('logout/', logout_view, name='log_out'),
    path('profile/', views.profile, name='profile'),
    path('profile/mail/', admin_mail_view, name='admin_mail'),
    path('delete-message/<int:id>/', delete_message, name='delete_message'),
    path('update-message/<int:id>/', update_message, name='update_message'),

]