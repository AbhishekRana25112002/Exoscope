from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .forms import BlogForm, CommentForm
from .models import Blog
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
import feedparser
from bs4 import BeautifulSoup
import requests
#implement a chatbot and finish the ui - key - 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
#NASA Picture of the day integration
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

OPENROUTER_API_KEY = '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'

def chatbot_page(request):
    return render(request, 'chatbot.html')


@csrf_exempt
def space_llm_chatbot(request):
    if request.method == 'POST':
        message = request.POST.get('message', '').strip()

        system_prompt = (
            "You are a helpful assistant that ONLY answers questions related to "
            "space, astronomy, NASA, planets, stars, galaxies, telescopes, rockets, and astrophysics. "
            "If asked anything outside of this domain, politely refuse to answer."
        )

        payload = {
            "model": "meta-llama/llama-4-maverick:free",  # Replace with a valid model ID
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ]
        }

        try:
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                json=payload,
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:8000",  # Replace with your domain
                    "X-Title": "Space Assistant"
                },
                timeout=10
            )
            data = response.json()
            reply = data['choices'][0]['message']['content']
            return JsonResponse({'response': reply})
        except Exception as e:
            print("Exception:", e)
            return JsonResponse({'response': "Something went wrong. Please try again later."})

    return JsonResponse({'error': 'Invalid request'}, status=400)



def apod_view(request):
    nasa_api_key = 'S7MI7LkuLOlLDqiTMK7KPzVl22ueOPaQaHx8wMgh'
    selected_date = request.GET.get('date')  # format: YYYY-MM-DD

    api_url = 'https://api.nasa.gov/planetary/apod'
    params = {
        'api_key': nasa_api_key,
    }
    if selected_date:
        params['date'] = selected_date

    apod_data = {}
    error_msg = None

    try:
        response = requests.get(api_url, params=params, timeout=5)
        response.raise_for_status()
        apod_data = response.json()
    except requests.RequestException as e:
        error_msg = f"Error fetching APOD: {e}"

    return render(request, 'apod.html', {
        'apod': apod_data,
        'error': error_msg,
        'selected_date': selected_date,
    })

def space_widgets(request):
    context = {
        'nasa_api_key': 'S7MI7LkuLOlLDqiTMK7KPzVl22ueOPaQaHx8wMgh',  # Your NASA API key
        'cesium_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmYmVkZDA1OC1mNDhkLTRmYjYtODA4NC1iNzE5ZjU4YjJjMTkiLCJpZCI6MzA1ODgyLCJpYXQiOjE3NDgwOTkxMzJ9._KRyachytxT3rBUqAW5LegBaO1MbIzaxlgb7x9_1bI4',
    }
    return render(request, 'space_widgets.html', context)


def astronomy_news(request):
    API_URL = "https://api.spaceflightnewsapi.net/v4/articles"
    params = {
        "limit": 10,
        "sort": "publishedAt",
        "order": "desc",
    }

    news_items = []
    error_msg = None

    try:
        resp = requests.get(API_URL, params=params, timeout=5)
        resp.raise_for_status()
        data = resp.json()

        # v4 returns a list at the top level
        articles = data if isinstance(data, list) else data.get("results", [])

        for art in articles:
            title   = art.get("title", "No title")
            link    = art.get("url", "#")
            summary = (art.get("summary") or "")[:200] + "…"

            # pick the first available date field
            raw_date = art.get("publishedAt") or art.get("updatedAt") or ""
            # split off the time portion if present
            published = raw_date.split("T")[0] if raw_date else "Unknown date"

            # image fallback logic unchanged
            img = art.get("imageUrl")
            if not img:
                try:
                    page = requests.get(link, timeout=3)
                    soup = BeautifulSoup(page.text, "html.parser")
                    meta = soup.find("meta", property="og:image")
                    img = meta and meta.get("content")
                except Exception:
                    img = None

            news_items.append({
                "title":     title,
                "link":      link,
                "summary":   summary,
                "published": published,
                "image_url": img,
            })

    except requests.RequestException as e:
        error_msg = f"Could not fetch news: {e}"

    return render(request, "astronomy_news.html", {
        "news_items": news_items,
        "error":      error_msg,
    })


def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')  # or wherever you want to go after login
        else:
            messages.error(request, 'Invalid username or password')
    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    messages.success(request, "Logged out successfully.")
    return redirect('login')


def signup(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')

        if password1 != password2:
            messages.error(request, "Passwords do not match")
        elif User.objects.filter(username=username).exists():
            messages.error(request, "Username already taken")
        else:
            user = User.objects.create_user(username=username, password=password1)
            login(request, user)
            return redirect('home')
    
    return render(request, 'signup.html')

@login_required(login_url='login')
def submit_blog(request):
    if request.method == 'POST':
        form = BlogForm(request.POST, request.FILES)
        if form.is_valid():
            blog = form.save(commit=False)
            # blog.author = request.user
            blog.author = User.objects.first()
            blog.save()
            return redirect('blogs')  # We'll create this next
    else:
        form = BlogForm()
    return render(request, 'submit_blog.html', {'form': form})


def home(request):
    return render(request, 'home.html')

def results(request):
    return render(request, 'results.html')

def analysis(request):
    return render(request, 'analysis.html')


def blog(request):
    return render(request, 'blog-reader.html')

def astronomy_widgets(request):
    return render(request, 'astronomy-widgets.html')

def blogs(request):
    blogs = Blog.objects.order_by('-created_at')
    return render(request, 'space-blogs.html', {'blogs': blogs})

def blog_detail(request, pk):
    blog = get_object_or_404(Blog, pk=pk)
    if request.method == "POST":
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.blog = blog
            comment.save()
            return redirect('blog_detail', pk=pk)
    else:
        form = CommentForm()
    return render(request, 'blog_detail.html', {
        'blog': blog,
        'form': form
    })



