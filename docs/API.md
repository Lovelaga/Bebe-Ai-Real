# API Documentation

## Base URL
http://localhost:3001/api

## Authentication
All protected endpoints require JWT token:
```
Authorization: Bearer <token>
```

## Endpoints

### Health Check
**GET** `/health`

Response: `{ "status": "healthy", "timestamp": "...", "uptime": 1234.56 }`

### API Info
**GET** `/info`

Response: `{ "service": "Backend API", "version": "1.0.0", "status": "running", "port": 3001 }`

## WebSocket
**Connection:** `ws://localhost:3001`

**Events:** `connected`, `message`, `broadcast`, `disconnect`

## Error Codes
- 200: OK
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

## Rate Limiting
100 requests per minute per IP
