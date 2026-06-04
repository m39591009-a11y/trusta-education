from django.contrib import admin
from .models import Student

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'phone', 'group', 'status', 'balance')
    list_filter = ('status', 'group')
    search_fields = ('first_name', 'last_name', 'phone')