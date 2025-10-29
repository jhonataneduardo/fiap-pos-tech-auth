/**
 * DIContainer
 *
 * Container de Injeção de Dependências seguindo o padrão Registry.
 * Suporta diferentes tipos de ciclo de vida para as dependências:
 * - Singleton: Uma única instância compartilhada
 * - Transient: Nova instância a cada resolução
 * - Factory: Função personalizada para criar instâncias
 */

type ServiceLifetime = 'singleton' | 'transient' | 'factory';

interface ServiceRegistration {
    lifetime: ServiceLifetime;
    implementation: any;
    instance?: any;
}

class DIContainer {
    private services: Map<string, ServiceRegistration> = new Map();

    /**
     * Registra um serviço como Singleton (instância única compartilhada)
     */
    registerSingleton<T>(key: string, implementation: new (...args: any[]) => T): void {
        this.services.set(key, {
            lifetime: 'singleton',
            implementation,
        });
    }

    /**
     * Registra um serviço como Transient (nova instância a cada resolução)
     */
    registerTransient<T>(key: string, implementation: new (...args: any[]) => T): void {
        this.services.set(key, {
            lifetime: 'transient',
            implementation,
        });
    }

    /**
     * Registra uma factory function para criar instâncias personalizadas
     */
    registerFactory<T>(key: string, factory: () => T): void {
        this.services.set(key, {
            lifetime: 'factory',
            implementation: factory,
        });
    }

    /**
     * Registra uma instância já criada (útil para configurações, clientes externos, etc.)
     */
    registerInstance<T>(key: string, instance: T): void {
        this.services.set(key, {
            lifetime: 'singleton',
            implementation: null,
            instance,
        });
    }

    /**
     * Resolve (obtém) uma dependência registrada
     */
    resolve<T>(key: string): T {
        const registration = this.services.get(key);

        if (!registration) {
            throw new Error(`Service "${key}" not registered in DI container`);
        }

        // Se já tem instância (singleton ou registerInstance), retorna ela
        if (registration.instance) {
            return registration.instance as T;
        }

        // Factory: executa a função
        if (registration.lifetime === 'factory') {
            return registration.implementation() as T;
        }

        // Transient: sempre cria nova instância
        if (registration.lifetime === 'transient') {
            return new registration.implementation() as T;
        }

        // Singleton: cria e armazena a instância
        if (registration.lifetime === 'singleton') {
            registration.instance = new registration.implementation();
            return registration.instance as T;
        }

        throw new Error(`Unknown lifetime for service "${key}"`);
    }

    /**
     * Verifica se um serviço está registrado
     */
    has(key: string): boolean {
        return this.services.has(key);
    }

    /**
     * Remove um serviço do container
     */
    unregister(key: string): void {
        this.services.delete(key);
    }

    /**
     * Limpa todos os serviços registrados (útil para testes)
     */
    clear(): void {
        this.services.clear();
    }
}

// Exporta uma instância única do container
export const container = new DIContainer();
