#!/bin/bash

echo "==================================="
echo "Form Handler API - Setup Secrets"
echo "==================================="
echo ""

# Gmail Configuration
echo "📧 Gmail App Password Setup:"
echo "1. Go to: https://myaccount.google.com/apppasswords"
echo "2. Sign in with your Gmail account (murr2k@gmail.com)"
echo "3. Select 'Mail' as the app"
echo "4. Select 'Other' as the device and name it 'Form Handler API'"
echo "5. Copy the 16-character password (no spaces)"
echo ""

read -p "Enter your Gmail address [murr2k@gmail.com]: " gmail_user
gmail_user=${gmail_user:-murr2k@gmail.com}

read -sp "Enter your Gmail App Password: " gmail_pass
echo ""

# Generate API keys
echo ""
echo "🔐 Generating API keys..."
api_key1=$(openssl rand -hex 32)
api_key2=$(openssl rand -hex 32)

echo ""
echo "Generated API Keys:"
echo "1. murr2k-github-io: $api_key1"
echo "2. backup-key: $api_key2"
echo ""

# Confirm before setting secrets
echo "==================================="
echo "Ready to set the following secrets:"
echo "- GMAIL_USER: $gmail_user"
echo "- GMAIL_APP_PASSWORD: [hidden]"
echo "- API_KEYS: Two keys for your apps"
echo "- ALLOWED_ORIGINS: GitHub Pages and local dev"
echo "- DEFAULT_EMAIL: $gmail_user"
echo "==================================="
echo ""

read -p "Continue? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "Setup cancelled."
    exit 1
fi

# Set secrets
echo ""
echo "Setting Fly.io secrets..."

fly secrets set \
  GMAIL_USER="$gmail_user" \
  GMAIL_APP_PASSWORD="$gmail_pass" \
  EMAIL_PROVIDER="gmail" \
  API_KEYS="${api_key1}:murr2k-github-io,${api_key2}:backup" \
  ALLOWED_ORIGINS="https://murr2k.github.io,https://murraykopit.com,http://localhost:8000,http://localhost:8001" \
  DEFAULT_EMAIL="$gmail_user" \
  APP_EMAILS='{"murr2k-github-io":"'$gmail_user'","murraykopit-com":"'$gmail_user'"}' \
  SMTP_FROM='"Murray Kopit" <noreply@murraykopit.com>' \
  NODE_ENV="production" \
  LOG_LEVEL="info"

echo ""
echo "✅ Secrets configured successfully!"
echo ""
echo "==================================="
echo "IMPORTANT: Save these API keys!"
echo "==================================="
echo "murr2k-github-io: $api_key1"
echo "backup-key: $api_key2"
echo ""
echo "You'll need these for authenticated API calls from other apps."
echo "==================================="