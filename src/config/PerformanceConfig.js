/**
 * Configurações de Performance
 * Centraliza todas as configurações relacionadas à otimização de performance
 */

export const PerformanceConfig = {
  // Cache
  BALANCE_CACHE_TTL: 100, // ms

  // Debounce
  BALANCE_UPDATE_DEBOUNCE: 100, // ms
  COUNT_UPDATE_DEBOUNCE: 100, // ms
  SEARCH_DEBOUNCE: 300, // ms

  // Rendering
  CHUNK_SIZE: 20, // Número de itens por chunk
  LARGE_LIST_THRESHOLD: 50, // Limite para usar renderização por chunks

  // Animations
  ANIMATION_DURATION: 300, // ms
  STAGGER_DELAY: 50, // ms entre animações em sequência

  // Virtual Scrolling (para implementação futura)
  VIRTUAL_SCROLL_THRESHOLD: 100,
  VISIBLE_ITEMS_BUFFER: 5,

  // Network
  REQUEST_TIMEOUT: 5000, // ms
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // ms

  // Memory
  MAX_CACHED_ITEMS: 1000,
  CACHE_CLEANUP_INTERVAL: 300000, // 5 minutos

  // Performance monitoring
  PERFORMANCE_MONITORING: true,
  LOG_SLOW_OPERATIONS: true,
  SLOW_OPERATION_THRESHOLD: 100 // ms
};

/**
 * Utilitários de Performance
 */
export class PerformanceUtils {
  static measureTime(name, fn) {
    if (!PerformanceConfig.PERFORMANCE_MONITORING) {
      return fn();
    }

    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const duration = end - start;

    if (PerformanceConfig.LOG_SLOW_OPERATIONS && duration > PerformanceConfig.SLOW_OPERATION_THRESHOLD) {
      console.warn(`⚠️ Operação lenta detectada: ${name} levou ${duration.toFixed(2)}ms`);
    }

    return result;
  }

  static async measureAsyncTime(name, fn) {
    if (!PerformanceConfig.PERFORMANCE_MONITORING) {
      return await fn();
    }

    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    const duration = end - start;

    if (PerformanceConfig.LOG_SLOW_OPERATIONS && duration > PerformanceConfig.SLOW_OPERATION_THRESHOLD) {
      console.warn(`⚠️ Operação assíncrona lenta detectada: ${name} levou ${duration.toFixed(2)}ms`);
    }

    return result;
  }

  /**
   * Throttle function para limitar execuções
   */
  static throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * RequestAnimationFrame otimizado
   */
  static scheduleWork(callback) {
    return requestAnimationFrame(() => {
      requestAnimationFrame(callback);
    });
  }

  /**
   * Batch de atualizações DOM
   */
  static batchDOMUpdates(updates) {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        updates.forEach(update => update());
        resolve();
      });
    });
  }
}

export default PerformanceConfig; 