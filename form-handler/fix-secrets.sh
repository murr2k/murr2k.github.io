#!/bin/bash

echo "Setting essential secrets for form handler..."

# You need to update these values
GMAIL_USER="murr2k@gmail.com"
GMAIL_APP_PASSWORD="YOUR_GMAIL_APP_PASSWORD"  # Replace with your actual app password

fly secrets set \
  EMAIL_PROVIDER="gmail" \
  GMAIL_USER="$GMAIL_USER" \
  GMAIL_APP_PASSWORD="$GMAIL_APP_PASSWORD" \
  ALLOWED_ORIGINS="https://murr2k.github.io" \
  DEFAULT_EMAIL="$GMAIL_USER"

echo "Secrets set! The app will restart automatically."