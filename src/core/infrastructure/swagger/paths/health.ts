export const healthPaths = {
    '/health': {
        get: {
            summary: 'Health check endpoint',
            description: 'Verifica se a API de autenticação está funcionando',
            tags: ['Health'],
            responses: {
                200: {
                    description: 'API está funcionando',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: {
                                        type: 'string',
                                        example: 'UP'
                                    },
                                    timestamp: {
                                        type: 'string',
                                        format: 'date-time',
                                        example: '2024-01-15T10:30:00.000Z'
                                    },
                                    service: {
                                        type: 'string',
                                        example: 'fiap-pos-tech-auth'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
