import traceback
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from supabase_client.client import supabase

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_menu_item(request, item_id):
    try:
        response = supabase.table("menu_item").delete().eq("item_id", item_id).execute()
        
        if response.data and len(response.data) > 0:
            return JsonResponse({
                "success": True, 
                "message": f"Menu item {item_id} deleted successfully."
            })
        else:
            return JsonResponse({
                "success": False, 
                "error": f"Menu item with ID {item_id} not found."
            }, status=404)
            
    except Exception as e:
        print("--- DATABASE DELETION TRACEBACK ---")
        traceback.print_exc()
        print("------------------------------------")
        return JsonResponse({"success": False, "error": f"Internal Server Error: {str(e)}"}, status=500)