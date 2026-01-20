import json
import traceback
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from supabase_client.client import supabase

OPERATOR_MAP = {
    "eq": "eq",     
    "gt": "gt",     
    "lt": "lt",     
    "gte": "gte",   
    "lte": "lte",   
    "ilike": "ilike", 
}

ALLOWED_FIELDS = ['customer_id', 'name', 'email', 'password', 'phone', 'address', 'created_at']

@csrf_exempt
def search_advanced(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            logic_operator = data.get("logic_operator", "AND").upper() 
            filters = data.get("filters", [])

            if not filters:
                return JsonResponse({"success": False, "error": "No filters provided in the request body."}, status=400)

            supabase_filters = []

            for f in filters:
                field = f.get('field')
                operator_key = f.get('operator')
                value = f.get('value')

                if field not in ALLOWED_FIELDS:
                    return JsonResponse({"success": False, "error": f"Invalid field specified: {field}"}, status=400)

                supabase_method = OPERATOR_MAP.get(operator_key)

                if not supabase_method:
                    return JsonResponse({"success": False, "error": f"Invalid operator: {operator_key}"}, status=400)

                if operator_key == "ilike":
                    filter_string = f"{field}.{supabase_method}.{value}"
                else:
                    filter_string = f"{field}.{supabase_method}.{value}"

                supabase_filters.append(filter_string)

            query = supabase.table("customer").select("*")

            if logic_operator == "OR":
                query = query.or_(','.join(supabase_filters))
            elif logic_operator == "AND":
                query = query.and_(','.join(supabase_filters))

            response = query.execute()

            if response.data:
                return JsonResponse({"success": True, "customers": response.data})
            else:
                return JsonResponse({"success": True, "customers": [], "message": "No customers matched the search criteria."})

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON format in request body."}, status=400)
        except Exception as e:
            print(f"ADVANCED SEARCH DATABASE ERROR: {e}")
            return JsonResponse({"success": False, "error": "Internal Server Error during database query."}, status=500)

    return JsonResponse({"error": "Method not allowed. Use POST."}, status=405)