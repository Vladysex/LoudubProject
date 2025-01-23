from django.contrib.auth.decorators import login_required
from django.contrib.sites import requests
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.template.loader import render_to_string
from django.contrib.auth import login,logout
from django.contrib.auth.views import LoginView
from .forms import SignUpForm, LoginForm, ContactMessage, ContactForm
import json

def home(request):
    return render(request, 'index.html')

def contact(request):
    return render(request, 'contact.html')

def about(request):
    return render(request, 'generic.html')

def sign_up(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            login(request, user)
            return redirect('profile')
    else:
        form = SignUpForm()
    return render(request, 'sign_up.html', {'form': form})

class CustomLoginView(LoginView):
    template_name = 'login.html'
    authentication_form = LoginForm

def logout_view(request):
    logout(request)
    return redirect('home')

@login_required
def profile(request):
    messages = ContactMessage.objects.all().order_by('-created_at') if request.user.is_staff else None
    return render(request, 'profile.html', {'messages': messages})
def contact_us(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            return render(request, 'contact.html',{'form': ContactForm(), 'success': True})
    else:
        form = ContactForm()

    return render(request, 'contact.html', {'form': form})

@login_required
def admin_mail_view(request):
    if not request.user.is_staff:
        return render(request, 'login.html' )
    messages = ContactMessage.objects.all().order_by('-created_at')
    return render(request, 'mail_content.html', {'messages': messages})


def delete_message(request, id):
    if request.method == 'DELETE':
        message = get_object_or_404(ContactMessage, id=id)
        message.delete()
        return JsonResponse({'success': True})

def update_message(request, id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            message = get_object_or_404(ContactMessage, id=id)

            if 'message' in data:
                message.message = data['message']
                message.save()

            return JsonResponse({'status': 'success', 'message': 'Message updated successfully'})
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data'})
