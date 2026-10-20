import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '0.1.0',
      sprint: 'Sprint 1 - Fundação',
    };
  }

  getInfo() {
    return {
      name: 'Fatal Model API',
      version: '0.1.0',
      description: 'API do marketplace Fatal Model com IA, confiança e privacidade',
      sprint: 'Sprint 1 - Fundação',
      features: {
        auth: true,
        jwt: true,
        refreshToken: true,
        rbac: true,
        users: true,
        auditLogging: true,
        profiles: false,
        search: false,
        ai: false,
      },
      modules: [
        'Authentication (JWT + Refresh)',
        'User Management',
        'RBAC',
        'Audit Logging',
        'API Documentation (Swagger)',
      ],
    };
  }
}
