# base/signals.py

from django.db.models.signals import pre_save
from django.contrib.auth.models import User

# action to be taken before saving the user
def updateUser(sender, instance, **kwargs):
    user = instance
    if user.email != '':
        user.username = user.email
    # print('Signal Triggered')

# add the signal listener for 'updateUser'
pre_save.connect(updateUser, sender=User)

