from django.contrib import admin
from .models import Group

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'subject', 'teacher', 'price', 'is_active')
    list_filter = ('is_active', 'subject')
    search_fields = ('name', 'subject')