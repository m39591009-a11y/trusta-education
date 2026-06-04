from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('student', 'amount', 'method', 'received_by', 'date')
    list_filter = ('method', 'date')
    search_fields = ('student__first_name', 'student__last_name')