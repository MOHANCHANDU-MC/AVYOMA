# AVYOMA CRM — Deployment Guide

## Production Build

```bash
# Generate optimized static production bundle in dist/
npm run build
```

The output bundle in `dist/` can be served via NGINX, AWS S3 + CloudFront, Vercel, or Netlify.

### NGINX Configuration Example

```nginx
server {
    listen 80;
    server_name crm.avyoma.com;

    root /var/www/avyoma-crm/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
