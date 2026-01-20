import json
from django.http import JsonResponse
from supabase_client.client import supabase

def get_items_by_category(request, category_name):
    if request.method == 'GET':
        try:
            response = (
                supabase
                .table("menu_item")
                .select("name, price, image_url, description")
                .eq("category", category_name)  
                .execute()
            )
            items = response.data
            return JsonResponse(items, safe=False)
        except Exception as e:
            print(f"DATABASE ERROR (GET ITEMS BY CATEGORY): {e}")
            return JsonResponse({"error": f"Failed to retrieve items for category '{category_name}'."}, status=500)
    
    return JsonResponse({"error": "Method not allowed. Use GET."}, status=405)
