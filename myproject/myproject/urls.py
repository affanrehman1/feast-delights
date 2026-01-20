from django.contrib import admin
from django.urls import path
from app_name import get
from app_name import post
from app_name import delete
from app_name import search
from app_name import insert_item
from app_name import get_item
from app_name import get_specific_item
from app_name import delete_item
from app_name import send_notification
from app_name import new_offer
from app_name import get_offers
from app_name import delete_offer
from app_name import create_payment
from app_name import get_payments
from app_name import delete_payment
from app_name import create_order_header
from app_name import get_order_headers
from app_name import delete_order_header
from app_name import create_order_item
from app_name import get_order_items
from app_name import delete_order_item
from app_name import place_order


urlpatterns = [
    path('admin/', admin.site.urls),
    path("customer/", get.get_customers),
    path("add/",post.add_customers),
    path("customer/<str:customer_id>/", delete.delete_customer),
    path("search/", get.search_customers),
    path("search/advanced/", search.search_advanced, name="search_advanced"),
    path("menu/items/", insert_item.create_menu_item, name="create_menu_item"),
    path("menu/get_items/", get_item.get_menu_items, name="get_menu_items"),
    path('menu/category/<path:category_name>/', get_specific_item.get_items_by_category, name='get_items_by_category'),
    path("menu/items/<int:item_id>/", delete_item.delete_menu_item, name="delete_menu_item"),
    path("notifications/", send_notification.create_notification, name="create_notification"),
    path("offers/", new_offer.create_offer, name="create_offer"),
    path("offers/get_offers", get_offers.get_all_offers, name="get_all_offers"),
    path("offers/<int:offer_id>/", delete_offer.delete_offer, name="delete_offer"),
    path("payments/", create_payment.create_payment, name="create_payment"),
    path("payments/", get_payments.get_all_payments, name="get_all_payments"),
    path("payments/<int:payment_id>/", delete_payment.delete_payment, name="delete_payment"),
    path("orders/header/", create_order_header.create_order_header, name="create_order_header"),
    path("orders/get_order_headers/", get_order_headers.fetch_all_order_headers, name="fetch_all_order_headers"),
    path("orders/header/<int:order_id>/", delete_order_header.delete_order_header, name="delete_order_header"),
    path("orders/item/", create_order_item.prepare_order_item, name="prepare_order_item"),
    path("orders/get_order_items/", get_order_items.fetch_all_order_items, name="fetch_all_order_items"),
    path("orders/item/<int:order_item_id>/", delete_order_item.remove_order_item, name="remove_order_item"),

    path("place_order/", place_order.place_order, name="place_order"),

]
