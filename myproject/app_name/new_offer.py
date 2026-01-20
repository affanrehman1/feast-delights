import json
import traceback
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from supabase_client.client import supabase

@csrf_exempt
def create_offer(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            offer_payload = {
                "name": data.get("name"),
                "discount_percent": data.get("discount_percent"),
                "valid_from": data.get("valid_from"), 
                "valid_to": data.get("valid_to"),     
                "description": data.get("description"),
            }
            
            response = supabase.table("offer").insert(
                offer_payload, 
                returning="representation"
            ).execute()

            if response.data:
                return JsonResponse({
                    "success": True, 
                    "message": "Offer created successfully.",
                    "offer": response.data[0] 
                }, status=201)
            else:
                error_details = getattr(response, 'error', 'Unknown database error or empty response.')
                return JsonResponse({
                    "success": False, 
                    "error": "Failed to insert offer.",
                    "details": error_details
                }, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON format in request body."}, status=400)
        except Exception as e:
            print("--- OFFER INSERTION TRACEBACK ---")
            traceback.print_exc()
            print("---------------------------------")
            
            return JsonResponse({"success": False, "error": f"Internal Server Error during database insertion. Check console for details."}, status=500)
    
    return JsonResponse({"error": "Method not allowed. Use POST."}, status=405)