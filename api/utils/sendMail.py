from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
def sendMail(to,subject,html_file_name,context):
    subject, from_email = subject, settings.EMAIL_HOST_USER
    text_content = 'This is an important message.'
    html_content = render_to_string(html_file_name,context)
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
    msg.attach_alternative(html_content, "text/html")
    msg.send()
