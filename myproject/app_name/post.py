from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from supabase_client.client import supabase

@csrf_exempt
def add_customers(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "POST request required"})

    try:
        data = json.loads(request.body)

        payload = {
            "name": data.get("name"),
            "email": data.get("email"),
            "password": data.get("password"),  
            "phone": data.get("phone"),
            "address": data.get("address")
        }

        response = supabase.table("customer").insert(payload, returning="representation").execute()

        if response.data:
            return JsonResponse({"success": True, "data": response.data[0]})
        else:
            return JsonResponse({"success": False, "error": "Failed to insert customer."})

    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)})
