// =============================================================================
// APLICAÇÃO DE FINANÇAS PESSOAIS v3.0 - WEBPACK + BABEL
// =============================================================================

// Importações de estilos
import './styles/main.scss';

// Importações de módulos
import { FinanceApp } from './app/FinanceApp.js';
import { AppConfig } from './config/AppConfig.js';

// =============================================================================
// INICIALIZAÇÃO DA APLICAÇÃO
// =============================================================================

/**
 * Função principal de inicialização
 */
const initializeApp = async () => {
  try {
    console.log('%c🚀 Iniciando Finanças Pessoais v3.0', 'color: #667eea; font-size: 16px; font-weight: bold;');
    console.log('%c⚡ Powered by Webpack + Babel + Sass', 'color: #48bb78; font-size: 12px;');

    // Remove o loader inicial
    removeInitialLoader();

    // Verifica se as classes estão disponíveis
    if (typeof AppConfig === 'undefined') {
      throw new Error('AppConfig não foi carregada corretamente');
    }
    if (typeof FinanceApp === 'undefined') {
      throw new Error('FinanceApp não foi carregada corretamente');
    }

    // Configura a aplicação
    console.log('📋 Criando configuração...');
    const config = new AppConfig();

    // Inicializa a aplicação principal
    console.log('🏗️ Criando aplicação...');
    const app = new FinanceApp(config);

    console.log('🚀 Inicializando aplicação...');
    await app.init();

    // Disponibiliza globalmente para debug
    window.financeApp = app;
    window.appConfig = config;

    // Função de debug para limpar dados corrompidos
    window.resetFinanceData = () => {
      if (confirm('⚠️ Isso irá apagar todos os dados salvos e reiniciar com dados padrão. Continuar?')) {
        app.services.transaction.storage.resetToDefaults();
        location.reload();
      }
    };

    console.log('%c✅ Aplicação inicializada com sucesso!', 'color: #38a169; font-weight: bold;');

    // Performance metrics
    logPerformanceMetrics();

  } catch (error) {
    console.error('%c❌ Erro ao inicializar aplicação:', 'color: #e53e3e; font-weight: bold;', error);
    console.error('Stack trace completo:', error.stack);
    showInitializationError(error);
  }
};

/**
 * Remove o loader inicial da tela
 */
const removeInitialLoader = () => {
  const loader = document.getElementById('initial-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.remove();
    }, 300);
  }
};

/**
 * Mostra erro de inicialização
 * @param {Error} error - Erro ocorrido
 */
const showInitializationError = (error) => {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `
      <div class="error-container">
        <div class="error-content">
          <h2 class="error-title">❌ Erro de Inicialização</h2>
          <p class="error-message">Não foi possível inicializar a aplicação.</p>
          <details class="error-details">
            <summary>Detalhes do erro</summary>
            <pre class="error-stack">${error.message}\n\n${error.stack || 'Stack não disponível'}</pre>
          </details>
          <button class="error-retry" onclick="location.reload()">
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    `;
  }
};

/**
 * Log de métricas de performance
 */
const logPerformanceMetrics = () => {
  if ('performance' in window && performance.timing) {
    const timing = performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;

    console.group('%c📊 Métricas de Performance', 'color: #4299e1;');
    console.log(`⏱️ Tempo total de carregamento: ${loadTime}ms`);
    console.log(`🎯 DOM Ready: ${domReady}ms`);
    console.log(`📦 Recursos carregados: ${performance.getEntriesByType('resource').length}`);
    console.groupEnd();
  }
};

/**
 * Configura o Service Worker (futuro)
 */
const setupServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registrado:', registration);
    } catch (error) {
      console.log('Erro ao registrar Service Worker:', error);
    }
  }
};

/**
 * Detecta recursos do navegador
 */
const detectBrowserFeatures = () => {
  const features = {
    modules: 'noModule' in HTMLScriptElement.prototype,
    fetch: 'fetch' in window,
    localStorage: 'localStorage' in window,
    serviceWorker: 'serviceWorker' in navigator,
    webGL: !!window.WebGLRenderingContext,
    webAssembly: 'WebAssembly' in window
  };

  console.group('%c🔍 Recursos do Navegador', 'color: #ed8936;');
  Object.entries(features).forEach(([feature, supported]) => {
    console.log(`${supported ? '✅' : '❌'} ${feature}: ${supported}`);
  });
  console.groupEnd();

  return features;
};

// =============================================================================
// EVENTOS DE INICIALIZAÇÃO
// =============================================================================

// Aguarda o DOM estar pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Detecta recursos do navegador
detectBrowserFeatures();

// Configura Service Worker
setupServiceWorker();

// =============================================================================
// HOT MODULE REPLACEMENT (DESENVOLVIMENTO)
// =============================================================================

if (typeof module !== 'undefined' && module.hot) {
  module.hot.accept('./app/FinanceApp.js', () => {
    console.log('🔥 Hot reloading FinanceApp...');
    // Recarrega a aplicação
    location.reload();
  });

  module.hot.accept('./styles/main.scss', () => {
    console.log('🎨 Hot reloading styles...');
    // O CSS é recarregado automaticamente pelo style-loader
  });
}

// =============================================================================
// TRATAMENTO DE ERROS GLOBAIS
// =============================================================================

window.addEventListener('error', (event) => {
  console.error('❌ Erro global capturado:', event.error);

  // Reporta erro para serviço de analytics (futuro)
  if (window.gtag) {
    window.gtag('event', 'exception', {
      description: event.error.message,
      fatal: false
    });
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Promise rejeitada:', event.reason);

  // Previne que o erro apareça no console do navegador
  event.preventDefault();
});

// =============================================================================
// CONSOLE BANNER
// =============================================================================

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║         💰 FINANÇAS PESSOAIS v3.0 - WEBPACK EDITION        ║
║                                                              ║
║  🏗️  Arquitetura: Modular + Webpack + Babel + Sass          ║
║  📦 Bundling: Webpack 5 com code splitting                   ║
║  🔄 Transpilação: Babel com ES6+ → ES5                      ║
║  🎨 Estilos: Sass com arquitetura BEM                       ║
║  🔧 Dev Tools: HMR + Source Maps                            ║
║  ⚡ Performance: Lazy loading + Tree shaking                 ║
║                                                              ║
║  Desenvolvido com ❤️ e tecnologias modernas                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`); 