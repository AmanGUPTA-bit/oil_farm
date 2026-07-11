import json

from django.test import TestCase
from django.urls import reverse

from .models import review


class ContactViewTests(TestCase):
    def test_contact_view_creates_review_from_js_payload(self):
        response = self.client.post(
            reverse('contact'),
            data=json.dumps({
                'name': 'Aman',
                'phone': '9876543210',
                'interest': 'mo',
                'message': 'Interested in mustard oil',
            }),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(review.objects.count(), 1)
        created_review = review.objects.get()
        self.assertEqual(created_review.name, 'Aman')
        self.assertEqual(created_review.phone_number, '9876543210')
        self.assertEqual(created_review.interest, 'mo')
        self.assertEqual(created_review.message, 'Interested in mustard oil')
