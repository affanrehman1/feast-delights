from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from supabase_client.client import supabase

@csrf_exempt
def delete_customer(request, customer_id):
    if request.method == 'DELETE':
        try:
            response = supabase.table("customer").delete().eq("customer_id", customer_id).execute()
            
            if response.data:
                return JsonResponse({"success": True, "message": f"Customer {customer_id} deleted."})
            else:
                return JsonResponse({"success": False, "error": "Customer not found."}, status=404)
        
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)
            
    return JsonResponse({"error": "Method not allowed"}, status=405)