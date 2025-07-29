# Changelog

All notable changes to murr2k.github.io will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-29

### Added
- Initial release with murraykopit.com design
- Professional portfolio layout with hero, expertise, services, projects, and contact sections
- Responsive design optimized for all devices
- Animated UI elements and smooth scrolling
- GitHub integration for dynamic project display
- Form handler API deployed on Fly.io
  - Email delivery via Gmail
  - Public endpoint with domain-based authentication
  - Rate limiting and spam protection
  - No API keys exposed in public code
- Working contact form with visual feedback
- Health check endpoint for monitoring
- Automatic port selection for preview server
- Jekyll blog with web-based editor (preserved from original site)

### Changed
- Replaced entire site design with murraykopit.com replica
- Updated all styling to match new design system
- Modified preview.py to auto-select available ports near 8000
- Contact form now sends real emails instead of showing alerts

### Security
- Implemented domain-based authentication for form submissions
- Added CORS protection with configurable allowed origins
- Secured form handler with rate limiting
- Added honeypot field for spam detection
- All secrets stored in Fly.io environment variables

### Technical Details
- Form Handler API: https://murr2k-form-handler.fly.dev
- Public endpoint: /api/public/contact
- Deployment: 2 instances on Fly.io for high availability
- Email provider: Gmail with app-specific password
- No build process required - vanilla HTML/CSS/JS

## [Pre-1.0.0]

### Features
- Jekyll blog functionality
- Blog editor with authentication
- GitHub Pages deployment
- Basic portfolio structure