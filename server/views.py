from django.shortcuts import render, redirect
from django.conf import settings
import os

def index(request):
    return render(request, 'index.html')

def start(request):
    return redirect("client/")
