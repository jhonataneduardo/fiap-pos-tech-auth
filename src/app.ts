import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import config from '@/config/index';
import { setupDependencies } from '@/core/infrastructure/di/setup';
import router from '@/core/infrastructure/http/routes';
import { errorHandler, notFoundHandler } from '@/core/infrastructure/http/middlewares/error-handler';
import { swaggerSpec } from '@/core/infrastructure/swagger';

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
    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'FIAP Pos Tech Auth API Documentation'
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
