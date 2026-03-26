# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible
receiving such patches depend on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

Please report (suspected) security vulnerabilities to
**[safwen.pheros@gmail.com](mailto:safwen.pheros@gmail.com)**. You will receive
a response from us within 48 hours. If the issue is confirmed, we will release
a patch as soon as possible depending on complexity but historically within a few

days.

Please include:

- Description of the vulnerability
- Steps to reproduce the issue
- Possible impact of the vulnerability
- Suggested fix (if any)

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine the affected versions
2. Audit code to find any potential similar problems
3. Prepare fixes for all supported versions
4. Release new versions as soon as possible

## Security Best Practices

When deploying Procreation AI:

1. **Keep dependencies updated** - Regularly run `npm audit fix`
2. **Use strong session secrets** - Generate with `openssl rand -base64 32`
3. **Secure your database** - Use strong passwords and restrict access
4. **Environment variables** - Never commit `.env` files
5. **API key rotation** - Rotate keys regularly
6. **Rate limiting** - Enable rate limiting for API routes
7. **HTTPS only** - Use HTTPS in production
8. **Content Security Policy** - Implement CSP headers

## Security Features

- Iron Session for secure authentication
- Rate limiting on API routes
- Input validation with Zod
- CSRF protection
- Secure password hashing with bcrypt
- API key authentication for sensitive endpoints

## Known Security Considerations

### AI API Keys

Your AI provider API keys are stored in environment variables. Make sure to:
- Never expose keys in client-side code
- Rotate keys regularly
- Monitor usage for unexpected spikes

### Blockchain Integration

When using NFT features:
- Store private keys securely
- Use hardware wallets for production
- Test on devnet before mainnet
- Validate all transactions

### File Uploads

Images are processed and stored via Cloudinary:
- File size limits are enforced
- Content type validation is performed
- Images are scanned for malicious content

## Acknowledgments

We thank the following for responsibly disclosing security issues:

* [List of security researchers will be added here]
