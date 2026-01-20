import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from supabase_client.client import supabase

@csrf_exempt
def place_order(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed. Use POST."}, status=405)

    try:
        data = json.loads(request.body)

        customer_id = data.get("customer_id")
        items = data.get("items", [])
        if customer_id is None or not items:
            return JsonResponse({"success": False, "error": "customer_id and items are required."}, status=400)

        try:
            customer_id = int(customer_id)
        except ValueError:
            return JsonResponse({"success": False, "error": "customer_id must be an integer."}, status=400)

        customer_check = supabase.table("customer").select("customer_id").eq("customer_id", customer_id).execute()
        if not customer_check.data:
            return JsonResponse({"success": False, "error": f"Customer {customer_id} does not exist."}, status=404)

        order_header_payload = {
            "customer_id": customer_id,
            "delivery_type": data.get("delivery_type", "Pickup"),
            "status": "Pending",
            "total_amount": data.get("total_amount", 0),
            "total_amount": 0  
        }
        order_header_response = supabase.table("order_header").insert(
            order_header_payload,
            returning="representation"
        ).execute()

        if not order_header_response.data:
            return JsonResponse({"success": False, "error": "Failed to create order header."}, status=500)

        order_header = order_header_response.data[0]
        order_header_id = order_header["order_id"]

        created_items = []
        total_amount = 0

        for item in items:
            item_id = item.get("item_id")
            quantity = item.get("quantity_ordered")
            
            if item_id is None or quantity is None:
                continue

            try:
                item_id = int(item_id)
                quantity = int(quantity)
            except ValueError:
                continue

            item_check = supabase.table("menu_item").select("item_id,stock_quantity,price").eq("item_id", item_id).execute()
            if not item_check.data:
                continue
            
            current_stock = item_check.data[0].get("stock_quantity")
            if current_stock is None or current_stock < quantity:
                continue

            new_stock = current_stock - quantity
            supabase.table("menu_item").update({"stock_quantity": new_stock}).eq("item_id", item_id).execute()
            
            item_price = item_check.data[0].get("price")

            total_amount += item_price * quantity
            supabase.table("order_item").insert({
                "order_id": order_header_id,
                "item_id": item_id,
                "quantity": quantity,
                "price_at_order": item_price
            }).execute()

            created_items.append({"item_id": item_id, "quantity": quantity, "remaining_stock": new_stock})

        print("total_amount", total_amount)
        supabase.table("order_header") \
            .update({"total_amount": total_amount}) \
            .eq("order_id", order_header_id) \
            .execute()

        offer_id = data.get("offer_id")
        discount_percent = 0

        if offer_id:
            offer_check = supabase.table("offer").select("discount_percent").eq("offer_id", offer_id).execute()
            if offer_check.data:
                discount_percent = offer_check.data[0]["discount_percent"]

        discount_amount = (total_amount * discount_percent) / 100
        final_amount = total_amount - discount_amount

        payment_response = supabase.table("payment").insert({
        "order_id": order_header_id,
        "payment_method": data.get("payment_method", "Cash"),
        "payment_status": "Completed",
        "transaction_date": data.get("transaction_date", None),
        "amount": final_amount
        }, returning="representation").execute()

        if payment_response.data:
            payment_id = payment_response.data[0]["payment_id"]
            supabase.table("order_header") \
            .update({"payment_id": payment_id}) \
            .eq("order_id", order_header_id) \
            .execute()

        if offer_id:
            supabase.table("order_header") \
                .update({"offer_id": offer_id}) \
                .eq("order_id", order_header_id) \
                .execute()

        return JsonResponse({
            "success": True,
            "message": "Order placed successfully.",
            "order_header": order_header,
            "order_items": created_items,
            "total_amount_before_discount": total_amount,
            "discount_percent": discount_percent,
            "discount_amount": discount_amount,
            "final_amount_after_discount": final_amount
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"success": False, "error": "Invalid JSON format."}, status=400)
    except Exception as e:
        return JsonResponse({"success": False, "error": f"Internal server error: {str(e)}"}, status=500)
