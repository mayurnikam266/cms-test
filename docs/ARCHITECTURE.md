# Test Agency - Project Documentation

## Overview

Test Agency is a production-ready, full-stack e-commerce platform designed specifically for selling solar panels and electronic products. Built with modern security practices and scalable architecture.

## Key Features

### Security
- Admin-only authentication system
- JWT with refresh tokens
- Role-based access control
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- SQL injection protection
- Private S3 bucket with signed URLs
- HTTPS/SSL encryption

### Product Management
- Full CRUD operations
- Category management
- Image upload to AWS S3
- Status management (Active/Inactive/Draft)
- Stock tracking
- Specifications and detailed descriptions

### Admin Dashboard
- Secure login
- Product statistics
- Category management
- Image upload interface
- Real-time updates

## Architecture

### Backend (NestJS)
- **Auth Module**: JWT authentication with guards
- **Products Module**: Product CRUD operations
- **Categories Module**: Category management
- **Users Module**: User management
- **Upload Module**: S3 integration
- **Database**: PostgreSQL with TypeORM

### Frontend (Next.js)
- **Public Pages**: Product browsing, detail pages
- **Admin Panel**: Protected dashboard, product/category management
- **API Client**: Axios with interceptors for token refresh
- **Styling**: Tailwind CSS with custom design system

## Security Implementation

### OWASP Top 10 Protection

1. **Injection**: Parameterized queries via TypeORM
2. **Broken Authentication**: JWT with refresh tokens, secure password hashing
3. **Sensitive Data Exposure**: Environment variables, HTTPS, secure headers
4. **XML External Entities**: JSON-only API
5. **Broken Access Control**: Role-based guards, admin-only routes
6. **Security Misconfiguration**: Helmet.js, secure defaults
7. **XSS**: Input validation, Content-Security-Policy headers
8. **Insecure Deserialization**: Class-validator for DTOs
9. **Using Components with Known Vulnerabilities**: Regular updates
10. **Insufficient Logging & Monitoring**: PM2 logs, Nginx logs

## Development Workflow

### Local Development

1. Setup PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Start backend: `npm run dev`
5. Start frontend: `npm run dev`

### Code Structure

```
src/
├── auth/           # Authentication logic
├── products/       # Product management
├── categories/     # Category management
├── users/          # User management
├── upload/         # S3 integration
└── database/       # DB configuration
```

## Deployment Architecture

```
Internet
    ↓
Nginx (Reverse Proxy + SSL)
    ↓
├── Frontend (Next.js on :3001)
└── Backend (NestJS on :3000)
        ↓
    PostgreSQL
        ↓
    AWS S3 (Images)
```

## API Design

### RESTful Endpoints

- `GET /api/products` - List products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Authentication Flow

1. User logs in with email/password
2. Backend validates credentials
3. Returns access token (15min) + refresh token (7 days)
4. Frontend stores tokens in localStorage
5. Axios interceptor adds token to requests
6. On 401, automatically refreshes token
7. On refresh failure, redirects to login

## Database Design

### Key Relationships

- Users → Role (admin/user)
- Products → Category (many-to-one)
- Products → Images (one-to-many)

### Indexes

- Users: email, role
- Products: categoryId, status, createdAt
- Images: productId

## Monitoring & Maintenance

### Health Checks

- PM2 process monitoring
- Nginx access/error logs
- PostgreSQL query logs
- Application error logs

### Backup Strategy

- Daily automated database backups
- 7-day retention policy
- S3 versioning for images
- Backup restoration testing

## Performance Considerations

### Optimizations

- Database indexing on frequently queried columns
- Nginx caching for static assets
- Gzip compression
- Image optimization before upload
- Lazy loading on frontend

### Scalability

- PM2 cluster mode for multiple instances
- Database connection pooling
- CDN for static assets
- Horizontal scaling with load balancer

## Cost Analysis

### AWS Lightsail
- $10/month: 1 vCPU, 2GB RAM (starter)
- $20/month: 2 vCPU, 4GB RAM (recommended)

### AWS S3
- $0.023/GB storage
- $0.005/1000 PUT requests
- Estimated: $1-5/month for images

### Total Estimated Cost
- **Development**: Free (local)
- **Production**: $15-30/month

## Testing Strategy

### Backend Testing
- Unit tests for services
- Integration tests for controllers
- E2E tests for critical flows

### Frontend Testing
- Component tests with React Testing Library
- E2E tests with Playwright
- Accessibility testing

## Future Enhancements

### Phase 2 (Optional)
- Shopping cart functionality
- Order management
- Payment integration
- Email notifications
- Customer accounts
- Product reviews
- Advanced analytics
- Multi-language support

## Troubleshooting Guide

### Common Issues

**Port Already in Use**
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

**Database Connection Failed**
```bash
sudo systemctl status postgresql
sudo systemctl restart postgresql
```

**S3 Upload Failed**
- Check AWS credentials
- Verify bucket permissions
- Check file size limits

## Contributing

### Code Style
- ESLint + Prettier for formatting
- Conventional commits
- TypeScript strict mode

### Pull Request Process
1. Create feature branch
2. Write tests
3. Update documentation
4. Submit PR with description

## Support

For issues or questions:
- Check troubleshooting guide
- Review deployment documentation
- Check application logs

## Changelog

### v1.0.0 (Initial Release)
- Admin authentication system
- Product management
- Category management
- Image upload to S3
- Public product browsing
- Admin dashboard
- AWS Lightsail deployment guide

---

**Last Updated**: January 2026
