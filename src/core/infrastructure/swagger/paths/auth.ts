export const authPaths = {
    '/auth/register': {
        post: {
            summary: 'Registrar novo usuário',
            description: 'Cria um novo usuário no sistema de autenticação (Keycloak)',
            tags: ['Authentication'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/RegisterUserRequest'
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Usuário criado com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                allOf: [
                                    { $ref: '#/components/schemas/ApiResponse' },
                                    {
                                        type: 'object',
                                        properties: {
                                            content: {
                                                $ref: '#/components/schemas/RegisterUserResponse'
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                },
                400: {
                    description: 'Dados inválidos',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ApiError'
                            },
                            examples: {
                                invalidCpf: {
                                    summary: 'CPF inválido',
                                    value: {
                                        success: false,
                                        error: {
                                            code: 'VALIDATION_ERROR',
                                            message: 'CPF deve conter 11 dígitos numéricos'
                                        }
                                    }
                                },
                                weakPassword: {
                                    summary: 'Senha fraca',
                                    value: {
                                        success: false,
                                        error: {
                                            code: 'VALIDATION_ERROR',
                                            message: 'Senha deve ter no mínimo 8 caracteres'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                409: {
                    description: 'Usuário já existe',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ApiError'
                            },
                            example: {
                                success: false,
                                error: {
                                    code: 'USER_ALREADY_EXISTS',
                                    message: 'Usuário com este CPF já existe'
                                }
                            }
                        }
                    }
                },
                500: {
                    description: 'Erro interno do servidor',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ApiError'
                            }
                        }
                    }
                }
            }
        }
    },
    '/auth/login': {
        post: {
            summary: 'Fazer login',
            description: 'Autentica um usuário e retorna tokens de acesso',
            tags: ['Authentication'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/LoginRequest'
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Login realizado com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                allOf: [
                                    { $ref: '#/components/schemas/ApiResponse' },
                                    {
                                        type: 'object',
                                        properties: {
                                            content: {
                                                $ref: '#/components/schemas/LoginResponse'
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                },
                400: {
                    description: 'Dados inválidos',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ApiError'
                            }
                        }
                    }
                },
                401: {
                    description: 'Credenciais inválidas',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ApiError'
                            },
                            example: {
                                success: false,
                                error: {
                                    code: 'INVALID_CREDENTIALS',
                                    message: 'CPF ou senha inválidos'
                                }
                            }
                        }
                    }
                },
                500: {
                    description: 'Erro interno do servidor',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ApiError'
                            }
                        }
                    }
                }
            }
        }
    },
    '/auth/refresh': {
        post: {
            summary: 'Renovar token de acesso',
            description: 'Renova o token de acesso usando um refresh token válido',
            tags: ['Authentication'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/RefreshTokenRequest'
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Token renovado com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                allOf: [
                                    { $ref: '#/components/schemas/ApiResponse' },
                                    {
                                        type: 'object',
                                        properties: {
                                            content: {
                                                $ref: '#/components/schemas/RefreshTokenResponse'
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                },
                400: {
                    description: 'Refresh token não fornecido',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ApiError'
                            }
                        }
                    }
                },
                401: {
                    description: 'Refresh token inválido ou expirado',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ApiError'
                            },
                            example: {
                                success: false,
                                error: {
                                    code: 'INVALID_TOKEN',
                                    message: 'Refresh token inválido ou expirado'
                                }
                            }
                        }
                    }
                },
                500: {
                    description: 'Erro interno do servidor',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ApiError'
                            }
                        }
                    }
                }
            }
        }
    },
    '/auth/logout': {
        post: {
            summary: 'Fazer logout',
            description: 'Revoga o refresh token e encerra a sessão do usuário',
            tags: ['Authentication'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/LogoutRequest'
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Logout realizado com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                allOf: [
                                    { $ref: '#/components/schemas/ApiResponse' },
                                    {
                                        type: 'object',
                                        properties: {
                                            content: {
                                                type: 'object',
                                                properties: {
                                                    message: {
                                                        type: 'string',
                                                        example: 'Logout realizado com sucesso'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                },
                400: {
                    description: 'Refresh token não fornecido',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ApiError'
                            }
                        }
                    }
                },
                500: {
                    description: 'Erro interno do servidor',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ApiError'
                            }
                        }
                    }
                }
            }
        }
    }
};
