import json
import traceback
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from supabase_client.client import supabase

@csrf_exempt
def create_notification(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            notification_payload = {
                "customer_id": data.get("customer_id"),
                "order_id": data.get("order_id"),
                "message": data.get("message"),
                "type": data.get("type"),
            }

            response = supabase.table("notification").insert(
                notification_payload, 
                returning="representation"
            ).execute()

            if response.data:
                return JsonResponse({
                    "success": True, 
                    "message": "Notification record created successfully.",
                    "notification": response.data[0] 
                }, status=201)
            else:
                error_details = getattr(response, 'error', 'Unknown database error or empty response.')
                return JsonResponse({
                    "success": False, 
                    "error": "Failed to insert notification record.",
                    "details": error_details
                }, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON format in request body."}, status=400)
        except Exception as e:
            print("--- NOTIFICATION INSERTION TRACEBACK ---")
            traceback.print_exc()
            print("----------------------------------------")
            
            return JsonResponse({"success": False, "error": f"Internal Server Error during database insertion. Check console for details."}, status=500)
    
    return JsonResponse({"error": "Method not allowed. Use POST."}, status=405)