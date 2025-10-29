export const authSchemas = {
    User: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                example: '01234567-89ab-cdef-0123-456789abcdef'
            },
            cpf: {
                type: 'string',
                example: '12345678901',
                description: 'CPF do usuário (11 dígitos)'
            },
            email: {
                type: 'string',
                format: 'email',
                example: 'usuario@email.com'
            },
            firstName: {
                type: 'string',
                example: 'João'
            },
            lastName: {
                type: 'string',
                example: 'Silva'
            }
        }
    },
    RegisterUserRequest: {
        type: 'object',
        required: ['cpf', 'password'],
        properties: {
            cpf: {
                type: 'string',
                example: '12345678901',
                description: 'CPF do usuário (11 dígitos numéricos)'
            },
            password: {
                type: 'string',
                format: 'password',
                example: 'SenhaForte123',
                description: 'Senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas e números'
            },
            email: {
                type: 'string',
                format: 'email',
                example: 'usuario@email.com',
                description: 'Email do usuário (opcional)'
            },
            firstName: {
                type: 'string',
                example: 'João',
                description: 'Nome do usuário (opcional)'
            },
            lastName: {
                type: 'string',
                example: 'Silva',
                description: 'Sobrenome do usuário (opcional)'
            }
        }
    },
    RegisterUserResponse: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                example: '01234567-89ab-cdef-0123-456789abcdef'
            },
            cpf: {
                type: 'string',
                example: '12345678901'
            },
            email: {
                type: 'string',
                format: 'email',
                example: 'usuario@email.com'
            },
            firstName: {
                type: 'string',
                example: 'João'
            },
            lastName: {
                type: 'string',
                example: 'Silva'
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T10:30:00.000Z'
            },
            updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T10:30:00.000Z'
            }
        }
    },
    LoginRequest: {
        type: 'object',
        required: ['cpf', 'password'],
        properties: {
            cpf: {
                type: 'string',
                example: '12345678901',
                description: 'CPF do usuário (11 dígitos numéricos)'
            },
            password: {
                type: 'string',
                format: 'password',
                example: 'SenhaForte123',
                description: 'Senha do usuário'
            }
        }
    },
    LoginResponse: {
        type: 'object',
        properties: {
            accessToken: {
                type: 'string',
                example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
                description: 'Token JWT de acesso'
            },
            refreshToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                description: 'Token JWT de renovação'
            },
            expiresIn: {
                type: 'number',
                example: 3600,
                description: 'Tempo de expiração do token em segundos'
            },
            tokenType: {
                type: 'string',
                example: 'Bearer',
                description: 'Tipo do token'
            },
            user: {
                $ref: '#/components/schemas/User'
            }
        }
    },
    RefreshTokenRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
            refreshToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                description: 'Token de renovação obtido no login'
            }
        }
    },
    RefreshTokenResponse: {
        type: 'object',
        properties: {
            accessToken: {
                type: 'string',
                example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
                description: 'Novo token JWT de acesso'
            },
            refreshToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                description: 'Novo token JWT de renovação'
            },
            expiresIn: {
                type: 'number',
                example: 3600,
                description: 'Tempo de expiração do token em segundos'
            },
            tokenType: {
                type: 'string',
                example: 'Bearer',
                description: 'Tipo do token'
            }
        }
    },
    LogoutRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
            refreshToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                description: 'Token de renovação a ser revogado'
            }
        }
    }
};
