from django.shortcuts import render,redirect
from datetime import datetime

from django.contrib.auth import authenticate,login,logout

# from django.views.generic import CreateView,View,TemplateView
from django.views import View,generic
from .forms import ProfileForm,UserForm,LoginForm

# Create your views here.


class LoginPage(View):


    template_name = 'accounts/login.html'

    def get(self,request,*args,**kwargs):

        context = {
            'form':LoginForm
        }
        return render(request,self.template_name,context)
    
    def post(self,request,*args,**kwargs):
        login_form = LoginForm(data=request.POST)

        if login_form.is_valid():
            dt = request.POST
            user = authenticate(username=dt['username'],password=dt['password'])
            login(request,user)

            return redirect('index')


        context = {
            'form':login_form
        }
        return render(request,self.template_name,context)
    

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
            if profile_form.is_valid():
                user = user_form.save()
                profile = profile_form.save(commit=False)
                profile.user = user
                profile.save()
                login(request,user)

                return redirect('index')

        context = {
            'user_form':user_form,
            'profile_form':profile_form
        }
        
        return render(request,self.template_name,context)


def createProfile(request):

    template_name = 'accounts/create_account.html'

    
def logoutUser(request):

    logout(request)

    return redirect('login')