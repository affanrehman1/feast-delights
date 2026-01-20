import traceback
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from supabase_client.client import supabase

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_offer(request, offer_id):
    try:
        response = supabase.table("offer").delete().eq("offer_id", offer_id).execute()
        
        if response.data and len(response.data) > 0:
            return JsonResponse({
                "success": True, 
                "message": f"Offer {offer_id} deleted successfully."
            })
        else:
            return JsonResponse({
                "success": False, 
                "error": f"Offer with ID {offer_id} not found."
            }, status=404)
            
    except Exception as e:
        print("--- OFFER DELETION TRACEBACK ---")
        traceback.print_exc()
        print("--------------------------------")
        return JsonResponse({"success": False, "error": f"Internal Server Error: {str(e)}"}, status=500)