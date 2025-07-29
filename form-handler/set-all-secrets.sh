#!/bin/bash

echo "==================================="
echo "Setting ALL required secrets"
echo "==================================="

# IMPORTANT: Replace this with your actual Gmail app password
read -sp "Enter your Gmail App Password (16 characters, no spaces): " gmail_pass
echo ""

echo "Setting secrets..."

# Set each secret individually to avoid fly.toml parsing issues
fly secrets set GMAIL_USER="murr2k@gmail.com" -a murr2k-form-handler
fly secrets set GMAIL_APP_PASSWORD="$gmail_pass" -a murr2k-form-handler
fly secrets set EMAIL_PROVIDER="gmail" -a murr2k-form-handler
fly secrets set DEFAULT_EMAIL="murr2k@gmail.com" -a murr2k-form-handler
fly secrets set ALLOWED_ORIGINS="https://murr2k.github.io,https://murraykopit.com,http://localhost:8000,http://localhost:8001" -a murr2k-form-handler
fly secrets set APP_EMAILS='{"murr2k-github-io":"murr2k@gmail.com","murraykopit-com":"murr2k@gmail.com"}' -a murr2k-form-handler
fly secrets set SMTP_FROM='"Murray Kopit" <noreply@murraykopit.com>' -a murr2k-form-handler
fly secrets set NODE_ENV="production" -a murr2k-form-handler
fly secrets set LOG_LEVEL="info" -a murr2k-form-handler

# Generate and set API keys
api_key1=$(openssl rand -hex 32)
api_key2=$(openssl rand -hex 32)
fly secrets set API_KEYS="${api_key1}:murr2k-github-io,${api_key2}:backup" -a murr2k-form-handler

echo ""
echo "✅ All secrets set successfully!"
echo ""
echo "==================================="
echo "IMPORTANT: Save these API keys!"
echo "==================================="
echo "murr2k-github-io: $api_key1"
echo "backup-key: $api_key2"
echo "==================================="
echo ""
echo "The app will restart automatically. Check logs with:"
echo "fly logs -a murr2k-form-handler"