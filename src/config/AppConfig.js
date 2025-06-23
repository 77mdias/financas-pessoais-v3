// =============================================================================
// APP CONFIG - Configuração Centralizada da Aplicação
// =============================================================================

/**
 * Classe de configuração centralizada da aplicação
 * Gerencia todas as configurações, variáveis de ambiente e constantes
 */
export class AppConfig {
  constructor() {
    // Detecta ambiente
    this.environment = this._detectEnvironment();

    // Configurações base
    this.app = this._getAppConfig();
    this.api = this._getApiConfig();
    this.ui = this._getUIConfig();
    this.transaction = this._getTransactionConfig();
    this.renderer = this._getRendererConfig();
    this.storage = this._getStorageConfig();
    this.analytics = this._getAnalyticsConfig();

    console.log(`🔧 AppConfig inicializada para ambiente: ${this.environment}`);
  }

  /**
   * Detecta o ambiente atual
   * @private
   */
  _detectEnvironment() {
    // Webpack define process.env.NODE_ENV automaticamente
    if (typeof process !== 'undefined' && process.env.NODE_ENV) {
      return process.env.NODE_ENV;
    }

    // Fallback baseado na URL
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    }

    return 'production';
  }

  /**
   * Configurações gerais da aplicação
   * @private
   */
  _getAppConfig() {
    return {
      name: 'Finanças Pessoais',
      version: '3.0.0',
      description: 'Aplicação moderna de finanças pessoais',
      author: 'Finance Team',

      // Features flags
      features: {
        darkMode: true,
        exportData: true,
        importData: false, // Futuro
        charts: false,     // Futuro
        categories: false, // Futuro
        budgets: false,    // Futuro
        goals: false       // Futuro
      },

      // Configurações de performance
      performance: {
        enableLazyLoading: true,
        enableCaching: true,
        maxCacheAge: 5 * 60 * 1000, // 5 minutos
        debounceDelay: 300,
        throttleDelay: 100
      }
    };
  }

  /**
   * Configurações da API
   * @private
   */
  _getApiConfig() {
    const baseURL = this.environment === 'development'
      ? 'http://localhost:3001'
      : '/api'; // Para produção com proxy

    return {
      baseURL,
      endpoints: {
        transactions: '/transactions'
      },
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,

      // Headers padrão
      defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },

      // Configurações de cache
      cache: {
        enabled: true,
        ttl: 5 * 60 * 1000, // 5 minutos
        maxSize: 100 // máximo de entradas em cache
      }
    };
  }

  /**
   * Configurações da interface do usuário
   * @private
   */
  _getUIConfig() {
    return {
      // Temas
      theme: {
        default: 'light',
        available: ['light', 'dark'],
        storageKey: 'finance-app-theme'
      },

      // Animações
      animations: {
        enabled: true,
        duration: {
          fast: 150,
          normal: 300,
          slow: 500
        },
        easing: 'ease-in-out'
      },

      // Notificações
      notifications: {
        enabled: true,
        duration: 4000,
        position: 'top-right',
        maxVisible: 3
      },

      // Formulários
      forms: {
        validateOnBlur: true,
        validateOnChange: false,
        showErrorsImmediately: false,
        clearOnSuccess: true
      },

      // Responsividade
      breakpoints: {
        mobile: 480,
        tablet: 768,
        desktop: 1024,
        wide: 1280
      },

      // Acessibilidade
      a11y: {
        announceChanges: true,
        focusManagement: true,
        keyboardNavigation: true
      }
    };
  }

  /**
   * Configurações específicas das transações
   * @private
   */
  _getTransactionConfig() {
    return {
      // Validação
      validation: {
        minValue: -999999.99,
        maxValue: 999999.99,
        maxNameLength: 100,
        requiredFields: ['nome', 'valor']
      },

      // Formatação
      formatting: {
        currency: 'BRL',
        locale: 'pt-BR',
        decimals: 2,
        showSymbol: true,
        showZeroCents: true
      },

      // Ordenação padrão
      defaultSort: {
        field: 'id',
        direction: 'desc'
      },

      // Filtros
      filters: {
        defaultDateRange: 30, // dias
        categories: [], // Para implementação futura
        types: ['income', 'expense']
      },

      // Paginação (para implementação futura)
      pagination: {
        enabled: false,
        pageSize: 20,
        maxPages: 100
      }
    };
  }

  /**
   * Configurações do renderizador
   * @private
   */
  _getRendererConfig() {
    return {
      // Configurações do template
      template: {
        useVirtualDOM: false, // Para implementação futura
        enableSSR: false,     // Para implementação futura
        minifyHTML: this.environment === 'production'
      },

      // Configurações de componentes
      components: {
        lazyLoad: true,
        preloadCritical: true,
        enableHMR: this.environment === 'development'
      },

      // Configurações de renderização
      rendering: {
        batchUpdates: true,
        debounceRender: 16, // ~60fps
        enableAnimations: true
      }
    };
  }

  /**
   * Configurações de armazenamento
   * @private
   */
  _getStorageConfig() {
    return {
      // Local Storage
      localStorage: {
        enabled: true,
        prefix: 'finance-app-',
        encryptSensitiveData: false, // Para implementação futura
        maxSize: 5 * 1024 * 1024 // 5MB
      },

      // Session Storage
      sessionStorage: {
        enabled: true,
        prefix: 'finance-session-'
      },

      // Cache do navegador
      browserCache: {
        enabled: true,
        version: this.app.version,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
      }
    };
  }

  /**
   * Configurações de analytics (futuro)
   * @private
   */
  _getAnalyticsConfig() {
    return {
      enabled: this.environment === 'production',

      // Google Analytics
      ga: {
        trackingId: null, // Para configurar em produção
        anonymizeIP: true,
        trackPageViews: true,
        trackEvents: true
      },

      // Eventos customizados
      events: {
        trackTransactions: true,
        trackErrors: true,
        trackPerformance: true,
        trackUserInteractions: false
      }
    };
  }

  /**
   * Obtém configuração por caminho (dot notation)
   * @param {string} path - Caminho da configuração (ex: 'api.baseURL')
   * @param {*} defaultValue - Valor padrão se não encontrado
   */
  get(path, defaultValue = null) {
    const keys = path.split('.');
    let current = this;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }

    return current;
  }

  /**
   * Define configuração por caminho (dot notation)
   * @param {string} path - Caminho da configuração
   * @param {*} value - Valor a ser definido
   */
  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = this;

    for (const key of keys) {
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    current[lastKey] = value;
  }

  /**
   * Verifica se uma feature está habilitada
   * @param {string} featureName - Nome da feature
   */
  isFeatureEnabled(featureName) {
    return this.get(`app.features.${featureName}`, false);
  }

  /**
   * Verifica se está em ambiente de desenvolvimento
   */
  isDevelopment() {
    return this.environment === 'development';
  }

  /**
   * Verifica se está em ambiente de produção
   */
  isProduction() {
    return this.environment === 'production';
  }

  /**
   * Obtém URL completa da API
   * @param {string} endpoint - Endpoint da API
   */
  getApiUrl(endpoint = '') {
    const baseURL = this.get('api.baseURL');
    return endpoint ? `${baseURL}${endpoint}` : baseURL;
  }

  /**
   * Obtém configurações de acordo com o dispositivo
   */
  getDeviceConfig() {
    const width = window.innerWidth;
    const breakpoints = this.get('ui.breakpoints');

    let device = 'desktop';
    if (width <= breakpoints.mobile) {
      device = 'mobile';
    } else if (width <= breakpoints.tablet) {
      device = 'tablet';
    }

    return {
      device,
      isMobile: device === 'mobile',
      isTablet: device === 'tablet',
      isDesktop: device === 'desktop',
      width,
      height: window.innerHeight
    };
  }

  /**
   * Exporta configurações (sem dados sensíveis)
   */
  export() {
    const safeConfig = JSON.parse(JSON.stringify(this));

    // Remove dados sensíveis
    if (safeConfig.analytics?.ga?.trackingId) {
      safeConfig.analytics.ga.trackingId = '[HIDDEN]';
    }

    return safeConfig;
  }

  /**
   * Log das configurações (apenas desenvolvimento)
   */
  debug() {
    if (this.isDevelopment()) {
      console.group('🔧 Configurações da Aplicação');
      console.log('Ambiente:', this.environment);
      console.log('Versão:', this.app.version);
      console.log('API Base URL:', this.api.baseURL);
      console.log('Features habilitadas:',
        Object.entries(this.app.features)
          .filter(([, enabled]) => enabled)
          .map(([name]) => name)
      );
      console.log('Dispositivo:', this.getDeviceConfig());
      console.groupEnd();
    }
  }
} 
