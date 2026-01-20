import json
import traceback
from django.http import JsonResponse
from supabase_client.client import supabase

ALLOWED_SEARCH_FIELDS = ['customer_id', 'name', 'email', 'phone', 'address']

def get_customers(request):
    data = supabase.table("customer").select("*").execute()
    return JsonResponse(data.data, safe=False)

def search_customers(request):
    if request.method == 'GET':
        
        query = supabase.table("customer").select("*")
        
        search_params = request.GET 
        
        or_filters = []
        
        for key, value in search_params.items():
            if not value:
                continue 
            
            if key == 'q':
                search_term = value
                
                or_filters.append(f"customer_id.eq.{search_term}")
                
                or_filters.append(f"name.ilike.%{search_term}%")
                
                or_filters.append(f"email.ilike.%{search_term}%")
                
                or_filters.append(f"phone.eq.{search_term}")
                continue 
            
            elif key == 'created_after':
                query = query.gt('created_at', value)
                continue
            
            elif key == 'created_before':
                query = query.lt('created_at', value)
                continue
            
            elif key == 'created_on':
                query = query.eq('created_at::date', value)
                continue
            
            elif key in ALLOWED_SEARCH_FIELDS:
                if key in ['name', 'email', 'address']:
                    query = query.ilike(key, f"%{value}%")
                else:
                    query = query.eq(key, value)

        if or_filters:
            query = query.or_(','.join(or_filters))

        try:
            response = query.execute()

            if response.data:
                return JsonResponse({"success": True, "customers": response.data})
            else:
                return JsonResponse({"success": True, "customers": [], "message": "No customers matched the search criteria."})

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)
    
    return JsonResponse({"error": "Method not allowed. Use GET."}, status=405)