import json
import traceback
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from supabase_client.client import supabase

@csrf_exempt
def prepare_order_item(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            order_id = data.get("order_id")
            item_id = data.get("item_id")
            quantity = data.get("quantity")

            if not all([order_id, item_id, quantity]):
                return JsonResponse({"success": False, "error": "Missing required fields: order_id, item_id, and quantity."}, status=400)

            item_response = supabase.table("menu_item").select("price").eq("item_id", item_id).single().execute()

            if not item_response.data:
                return JsonResponse({"success": False, "error": f"Item ID {item_id} not found in menu_item table."}, status=404)
            
            price_at_order = item_response.data['price']
            
            order_item_payload = {
                "order_id": order_id,
                "item_id": item_id,
                "quantity": quantity,
                "price_at_order": price_at_order, 
            }

            response = supabase.table("order_item").insert(
                order_item_payload, 
                returning="representation"
            ).execute()

            if response.data:
                return JsonResponse({
                    "success": True, 
                    "message": "Order item created successfully.",
                    "order_item": response.data[0]
                }, status=201)
            else:
                error_details = getattr(response, 'error', 'Unknown database error or empty response.')
                print(f"SUPABASE ERROR DETAILS: {error_details}")
                return JsonResponse({
                    "success": False, 
                    "error": "Failed to create order item.",
                    "details": error_details
                }, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON format in request body."}, status=400)
        except Exception as e:
            print("--- ORDER ITEM INSERTION TRACEBACK ---")
            print(f"Exception Type: {type(e).__name__}, Message: {str(e)}")
            traceback.print_exc()
            print("--------------------------------------")
            
            return JsonResponse({"success": False, "error": f"Internal Server Error during database insertion. Check console for details."}, status=500)
    
    return JsonResponse({"error": "Method not allowed. Use POST."}, status=405)