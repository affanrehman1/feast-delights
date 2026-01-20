import json
import traceback
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from supabase_client.client import supabase

@csrf_exempt
def create_payment(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            payment_payload = {
                "order_id": data.get("order_id"),
                "payment_method": data.get("payment_method"),
                "payment_status": data.get("payment_status"),
                "amount": data.get("amount"),
            }

            response = supabase.table("payment").insert(
                payment_payload, 
                returning="representation"
            ).execute()

            if response.data:
                return JsonResponse({
                    "success": True, 
                    "message": "Payment record created successfully.",
                    "payment": response.data[0] 
                }, status=201)
            else:
                error_details = getattr(response, 'error', 'Unknown database error or empty response.')
                return JsonResponse({
                    "success": False, 
                    "error": "Failed to record payment.",
                    "details": error_details
                }, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON format in request body."}, status=400)
        except Exception as e:
            print("--- PAYMENT INSERTION TRACEBACK ---")
            traceback.print_exc()
            print("-----------------------------------")
            
            return JsonResponse({"success": False, "error": f"Internal Server Error during database insertion. Check console for details."}, status=500)
    
    return JsonResponse({"error": "Method not allowed. Use POST."}, status=405)