import traceback
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from supabase_client.client import supabase

@require_http_methods(["GET"])
def get_all_payments(request):
    try:
        response = supabase.table("payment").select("*").execute()
        
        if response.data:
            return JsonResponse(response.data, safe=False)
        else:
            return JsonResponse({"message": "No payment records found."}, status=200)

    except Exception as e:
        print("--- GET ALL PAYMENTS TRACEBACK ---")
        traceback.print_exc()
        print("----------------------------------")
        return JsonResponse({"error": f"Internal Server Error: {str(e)}"}, status=500)