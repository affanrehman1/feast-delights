import json
import traceback
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from supabase_client.client import supabase

@csrf_exempt
def create_order_header(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            order_payload = {
                "customer_id": data.get("customer_id"),
                "delivery_type": data.get("delivery_type"),
                "status": data.get("status"),
                "total_amount": data.get("total_amount"),
                "order_date": data.get("order_date"), 
                "offer_id": data.get("offer_id"),     
                "payment_id": data.get("payment_id"), 
            }
            
            order_payload = {k: v for k, v in order_payload.items() if v is not None}

            response = supabase.table("order_header").insert(
                order_payload, 
                returning="representation"
            ).execute()

            if response.data:
                return JsonResponse({
                    "success": True, 
                    "message": "Order header created successfully.",
                    "order": response.data[0] 
                }, status=201)
            else:
                error_details = getattr(response, 'error', 'Unknown database error or empty response.')
                return JsonResponse({
                    "success": False, 
                    "error": "Failed to create order header.",
                    "details": error_details
                }, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON format in request body."}, status=400)
        except Exception as e:
            print("--- ORDER HEADER INSERTION TRACEBACK ---")
            traceback.print_exc()
            print("----------------------------------------")
            
            return JsonResponse({"success": False, "error": f"Internal Server Error during database insertion. Check console for details."}, status=500)
    
    return JsonResponse({"error": "Method not allowed. Use POST."}, status=405)