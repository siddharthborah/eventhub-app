# Security Checklist for Git Repository

## ✅ Pre-Commit Security Verification

Before pushing to any Git repository, ensure the following:

### 1. Environment Variables
- [ ] `.env` files are in `.gitignore` ✅
- [ ] No hardcoded API keys in source code ✅
- [ ] All secrets use `os.Getenv()` or environment variables ✅

### 2. Auth0 Configuration
- [ ] `AUTH0_CLIENT_SECRET` uses environment variable ✅
- [ ] `AUTH0_DOMAIN` uses environment variable ✅
- [ ] No Auth0 secrets in source code ✅

### 3. Database Configuration
- [ ] Database passwords use environment variables ✅
- [ ] No hardcoded database credentials ✅
- [ ] Connection strings use environment variables ✅

### 4. Session Management
- [ ] Session secret uses environment variable ✅
- [ ] No hardcoded session keys ✅

### 5. Google Maps API
- [ ] API key uses environment variable ✅
- [ ] Fallback placeholders are safe ✅

### 6. Files to Exclude
Ensure these patterns are in `.gitignore`:
```
.env
.env.local
.env.*.local
*.key
*.pem
*.p12
config/secrets.json
```

### 7. Safe Placeholder Values
These are safe to commit (they're just examples):
- `your-auth0-domain.auth0.com`
- `your-auth0-client-id`
- `your-auth0-client-secret`
- `YOUR_GOOGLE_MAPS_API_KEY`
- `your-random-session-secret-key`

### 8. Development vs Production
- [ ] Development defaults are safe placeholders ✅
- [ ] Production requires real environment variables ✅
- [ ] No production secrets in code ✅

## 🔍 Quick Security Scan Commands

Run these before committing:

```bash
# Check for potential secrets
grep -r "sk_" . --exclude-dir=node_modules
grep -r "pk_" . --exclude-dir=node_modules
grep -r "AIza" . --exclude-dir=node_modules

# Check for hardcoded passwords
grep -ri "password.*=" . --exclude-dir=node_modules | grep -v "your-password"

# Check for API keys
grep -ri "api.*key" . --exclude-dir=node_modules | grep -v "your_actual_api_key_here"
```

## ✅ Repository Status: SECURE
All sensitive information has been properly externalized to environment variables.
Safe to push to public repository. 