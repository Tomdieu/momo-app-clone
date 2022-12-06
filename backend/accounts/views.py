from django.shortcuts import render,redirect
from datetime import datetime

# from django.views.generic import CreateView,View,TemplateView
from django.views import View
from .forms import ProfileForm,UserForm

# Create your views here.

class LandingPage(View):

    template_name = 'cover.html'


    def get(self,request,*args,**kwargs):

        context = {
            'title':'TrixWallet',
            'date':datetime.now().year
        }
        
        return render(request,self.template_name,context)


class CreateProfile(View):

    template_name = 'accounts/create_account.html'

    def get(self,request,*args,**kwargs):

        context = {
            'user_form':UserForm(),
            'profile_form':ProfileForm()
        }

        return render(request,self.template_name,context)

    def post(self,request,*args,**kwargs):
        print(request.POST)
        user_form = UserForm(data=request.POST)

        profile_form = ProfileForm(data=request.POST)

        if user_form.is_valid():
            print(user_form.visible_fields['username'])
            return redirect('index')

        context = {
            'user_form':user_form,
            'profile_form':profile_form
        }
        
        return render(request,self.template_name,context)


def createProfile(request):

    template_name = 'accounts/create_account.html'

    