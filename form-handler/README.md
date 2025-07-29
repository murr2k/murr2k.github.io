# Form Handler API

A scalable, secure form handler API designed to process form submissions from multiple applications and send email notifications.

## Features

- 🔐 **API Key Authentication**: Secure access with app-specific API keys
- 📧 **Multiple Email Providers**: Support for Gmail, SendGrid, AWS SES, and generic SMTP
- 🛡️ **Spam Protection**: Built-in spam detection and honeypot field support
- ⚡ **Rate Limiting**: Configurable rate limits per IP and per app
- 🌐 **CORS Support**: Configurable origins for cross-origin requests
- 📊 **Logging & Monitoring**: Comprehensive logging with Winston
- 🚀 **Production Ready**: Docker containerized with health checks

## Quick Start

### 1. Generate API Keys

```bash
# Generate a secure API key
openssl rand -hex 32
```

### 2. Deploy to Fly.io

```bash
# Install Fly CLI if you haven't already
curl -L https://fly.io/install.sh | sh

# Login to Fly.io
fly auth login

# Create the app (one-time setup)
fly apps create murr2k-form-handler

# Set secrets (replace with your values)
fly secrets set \
  GMAIL_USER="your-email@gmail.com" \
  GMAIL_APP_PASSWORD="your-app-password" \
  API_KEYS="your-api-key:murr2k-github-io" \
  ALLOWED_ORIGINS="https://murr2k.github.io" \
  DEFAULT_EMAIL="murr2k@gmail.com" \
  APP_EMAILS='{"murr2k-github-io":"murr2k@gmail.com"}'

# Deploy
fly deploy

# Check deployment status
fly status
```

### 3. Test the API

```bash
# Health check
curl https://murr2k-form-handler.fly.dev/health

# Submit a form (replace YOUR_API_KEY)
curl -X POST https://murr2k-form-handler.fly.dev/api/v1/forms/submit \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

## API Documentation

### POST /api/public/contact (Public Endpoint)

Submit a form without API key - restricted to whitelisted domains.

**Headers:**
- `Content-Type`: application/json
- `Origin`: Must be from allowed domain

**Allowed Domains:**
- https://murr2k.github.io
- https://murraykopit.com
- http://localhost:8000
- http://localhost:8001

### POST /api/v1/forms/submit (Authenticated)

Submit a form for email processing with API key.

**Headers:**
- `X-API-Key`: Your API key (required)
- `Content-Type`: application/json

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Contact Request",
  "message": "Your message here",
  "phone": "555-1234",        // optional
  "company": "Acme Corp",     // optional
  "website": "https://...",   // optional
  "metadata": {}              // optional custom fields
}
```

**Response:**
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "id": "request-id"
}
```

## Configuration

### Environment Variables

See `.env.example` for all available options.

### Email Providers

#### Gmail
1. Enable 2-factor authentication
2. Generate an app-specific password
3. Set `EMAIL_PROVIDER=gmail`

#### SendGrid
1. Get API key from SendGrid
2. Set `EMAIL_PROVIDER=sendgrid`
3. Set `SENDGRID_API_KEY`

#### Custom SMTP
1. Set `EMAIL_PROVIDER=smtp`
2. Configure SMTP_* variables

### Adding New Apps

1. Generate a new API key
2. Add to API_KEYS: `key1:app1,key2:app2`
3. Add origin to ALLOWED_ORIGINS
4. Optionally add app-specific email to APP_EMAILS

## Security Features

- API key authentication
- Rate limiting (10 requests/15min per IP)
- CORS protection
- Input validation with Joi
- Spam detection
- Helmet.js security headers
- Non-root Docker user

## Monitoring

- Health endpoint: `/health`
- Structured JSON logging
- Request IDs for tracing
- Error tracking

## Development

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Run tests
npm test
```

## Troubleshooting

### Common Issues

1. **CORS Error**: Add your domain to ALLOWED_ORIGINS
2. **Rate Limit**: Wait 15 minutes or contact admin
3. **Email Not Sending**: Check email provider configuration
4. **401 Unauthorized**: Verify API key is correct

### Logs

```bash
# View recent logs
fly logs

# Stream logs
fly logs -f
```

## License

MIT