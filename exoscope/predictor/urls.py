from django.urls import path
from . import views
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('', views.home, name='home'),
    path('results/', views.results, name='results'),
    path('analysis/', views.analysis, name='analysis'),
    path('blogs/', views.blogs, name='blogs'),
    path('blogs/<int:pk>/', views.blog_detail, name='blog_detail'),
    path('widgets/',views.astronomy_widgets, name='widgets'),
    path('submit/', views.submit_blog, name='submit_blog'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('signup/', views.signup, name='signup'),
    path('astronomy-news/', views.astronomy_news, name='astronomy_news'),
    path('space_widgets/', views.space_widgets, name = 'space_widgets'),
    path('apod/', views.apod_view, name='apod'),
    path('chatbot/', views.chatbot_page, name='chatbot_page'),
    path('spacebot/', views.space_llm_chatbot, name='space_llm_chatbot'),
]

