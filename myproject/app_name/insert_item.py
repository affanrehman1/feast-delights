import json
import traceback
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from supabase_client.client import supabase

@csrf_exempt
def create_menu_item(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            item_payload = {
                "category": data.get("category"),
                "name": data.get("name"),
                "description": data.get("description"),
                "price": data.get("price"),
                "image_url": data.get("image_url"),
                "available": data.get("available", True), 
                "stock_quantity": data.get("stock_quantity"),
            }

            response = supabase.table("menu_item").insert(
                item_payload, 
                returning="representation" 
            ).execute()
            
            if response.data:
                return JsonResponse({
                    "success": True, 
                    "message": "Menu item created successfully.",
                    "item": response.data[0] 
                }, status=201)
            else:
                error_details = getattr(response, 'error', 'Unknown database error or empty response.')
                return JsonResponse({
                    "success": False, 
                    "error": "Failed to insert menu item.",
                    "details": error_details
                }, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON format in request body."}, status=400)
        except Exception as e:
            print("--- DATABASE INSERTION TRACEBACK ---")
            traceback.print_exc()
            print("------------------------------------")
            
            return JsonResponse({"success": False, "error": f"Internal Server Error during database insertion. Check console for details."}, status=500)
    
    return JsonResponse({"error": "Method not allowed. Use POST."}, status=405)