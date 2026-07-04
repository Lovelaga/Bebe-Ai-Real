# Deployment Guide

## Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Update .env with production values
- [ ] Enable HTTPS/TLS
- [ ] Configure database backups
- [ ] Set up monitoring
- [ ] Configure CI/CD
- [ ] Review security settings

## Docker Deployment
```bash
docker build -t bebe-ai-real:latest .
docker tag bebe-ai-real:latest your-registry/bebe-ai-real:latest
docker push your-registry/bebe-ai-real:latest
```

## Cloud Platforms

### Heroku
```bash
heroku create your-app
heroku addons:create heroku-postgresql
git push heroku main
```

### AWS / Google Cloud / Azure
See cloud provider documentation for containerized deployment.
