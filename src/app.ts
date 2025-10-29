import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import config from '@/config/index';
import { setupDependencies } from '@/core/infrastructure/di/setup';
import router from '@/core/infrastructure/http/routes';
import { errorHandler, notFoundHandler } from '@/core/infrastructure/http/middlewares/error-handler';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setupDependencyInjection();
    this.configureMiddlewares();
    this.configureRoutes();
    this.configureSwagger();
    this.configureErrorHandlers();
  }

  private setupDependencyInjection(): void {
    setupDependencies();
  }

  private configureMiddlewares(): void {
    // Security
    this.app.use(helmet());

    // CORS
    this.app.use(
      cors({
        origin: config.cors.allowedOrigins,
        credentials: true,
      })
    );

    // Body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Logging
    if (config.nodeEnv === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }
  }

  private configureRoutes(): void {
    // Use main router
    this.app.use(router);
  }

  private configureSwagger(): void {
    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'FIAP Pós-Tech - Auth Service API',
          version: '1.0.0',
          description: 'API de autenticação e autorização com Keycloak - Clean Architecture',
          contact: {
            name: 'FIAP Pós-Tech',
          },
        },
        servers: [
          {
            url: `http://localhost:${config.port}`,
            description: 'Servidor de desenvolvimento',
          },
        ],
        components: {
          schemas: {
            Error: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: false,
                },
                error: {
                  type: 'object',
                  properties: {
                    code: {
                      type: 'string',
                      example: 'VALIDATION_ERROR',
                    },
                    message: {
                      type: 'string',
                      example: 'Erro de validação',
                    },
                  },
                },
              },
            },
          },
        },
      },
      apis: ['./src/modules/**/infrastructure/http/*.ts'],
    };

    const swaggerSpec = swaggerJsdoc(swaggerOptions);

    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Auth Service API Documentation - Clean Architecture',
      })
    );
  }

  private configureErrorHandlers(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }
}

export default new App().app;
