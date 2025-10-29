export const commonSchemas = {
    ApiResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true
            },
            content: {
                type: 'object'
            }
        }
    },
    ApiError: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: false
            },
            error: {
                type: 'object',
                properties: {
                    code: {
                        type: 'string',
                        example: 'VALIDATION_ERROR'
                    },
                    message: {
                        type: 'string',
                        example: 'Erro de validação'
                    }
                }
            }
        }
    }
};
