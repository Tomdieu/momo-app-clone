from django.shortcuts import render
from datetime import datetime

# from django.views.generic import CreateView,View,TemplateView
from django.views import View
# Create your views here.

class LandingPage(View):

    template_name = 'cover.html'


    def get(self,request,*args,**kwargs):

        context = {
            'title':'TrixWallet',
            'date':datetime.now().year
        }
        
        return render(request,self.template_name,context)