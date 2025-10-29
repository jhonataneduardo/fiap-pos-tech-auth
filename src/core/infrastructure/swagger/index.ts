import swaggerJSDoc from 'swagger-jsdoc';
import { schemas } from './schemas';
import { paths } from './paths';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'FIAP Pos Tech Auth API',
        version: '1.0.0',
        description: 'API de autenticação e autorização com Keycloak - Tech Challenge FIAP',
        contact: {
            name: 'FIAP Pós-Tech',
            email: 'contact@fiap.com.br'
        }
    },
    servers: [
        {
            url: 'http://localhost:3002',
            description: 'Development server'
        }
    ],
    components: {
        schemas,
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Token JWT obtido através do endpoint de login'
            }
        }
    },
    paths
};

const swaggerOptions: swaggerJSDoc.Options = {
    definition: swaggerDefinition,
    apis: []
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
