from django.shortcuts import render
from django.http import HttpResponse
from .models import review 


# Create your views here.
def index(request):
    
    context = {
        "css_file": "/static/css/styles.css",
        "js_file": "/static/js/script.js",
        
    }
    

    if request.method == "POST":

        name = request.POST.get("name")
        phone_number = request.POST.get("phone_number")
        interest = request.POST.get("interest")
        message = request.POST.get("message")

        review.objects.create(
            name=name,
            phone_number=phone_number,
            interest=interest,
            message=message
        )

    return render(request, "index.html", context)


from django.http import JsonResponse
import json

def contact(request):
    if request.method == "POST":
        data = json.loads(request.body)

        name = data.get("name")
        phone_number = data.get("phone_number") or data.get("phone")
        interest = data.get("interest")
        message = data.get("message")

        if not name or not phone_number or not interest or not message:
            return JsonResponse({"success": False, "error": "Missing required fields"}, status=400)

        review.objects.create(
            name=name,
            phone_number=phone_number,
            interest=interest,
            message=message
        )

        return JsonResponse({"success": True})

    return JsonResponse({"success": False}, status=400)    
