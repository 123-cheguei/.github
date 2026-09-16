import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  getInfo() {
    return {
      name: 'Fatal Model API',
      version: '0.1.0',
      description: 'API do marketplace Fatal Model com IA, confiança e privacidade',
      sprint: 'Sprint 0 - Setup Inicial',
      features: {
        auth: false,
        users: false,
        profiles: false,
        search: false,
        ai: false,
      },
    };
  }
}
