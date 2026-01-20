import json
from django.http import JsonResponse
from supabase_client.client import supabase

def get_menu_items(request):
    if request.method == 'GET':
        try:
            response = supabase.table("menu_item").select("*").execute()
            
            menu_data = response.data
            
            return JsonResponse(menu_data, safe=False)

        except Exception as e:
            print(f"DATABASE ERROR (GET MENU ITEMS): {e}")
            return JsonResponse({"error": "Failed to retrieve menu items from database."}, status=500)
    
    return JsonResponse({"error": "Method not allowed. Use GET."}, status=405)