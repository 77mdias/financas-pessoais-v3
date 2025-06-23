/**
 * Classe utilitária para formatação de dados
 */
export class Formatter {
  /**
   * Formata valores monetários para o padrão brasileiro
   * @param {number} value - Valor a ser formatado
   * @param {boolean} showCurrency - Se deve mostrar o símbolo da moeda
   * @returns {string} Valor formatado
   */
  static formatCurrency(value, showCurrency = false) {
    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };

    if (showCurrency) {
      options.style = 'currency';
      options.currency = 'BRL';
    }

    return value.toLocaleString('pt-BR', options);
  }

  /**
   * Formata um valor monetário com sinal
   * @param {number} value - Valor a ser formatado
   * @returns {Object} Objeto com valor formatado e informações
   */
  static formatTransactionValue(value) {
    // Verifica se o valor é válido
    if (isNaN(value) || value === null || value === undefined) {
      return {
        formattedValue: '0,00',
        sign: '+',
        typeClass: 'income',
        isIncome: true,
        displayValue: '+ R$ 0,00'
      };
    }

    const numericValue = parseFloat(value) || 0;
    const isIncome = numericValue >= 0;
    const formattedValue = this.formatCurrency(Math.abs(numericValue));
    const sign = isIncome ? '+' : '-';
    const typeClass = isIncome ? 'income' : 'expense';

    return {
      formattedValue,
      sign,
      typeClass,
      isIncome,
      displayValue: `${sign} R$ ${formattedValue}`
    };
  }

  /**
   * Formata o saldo total
   * @param {number} total - Valor total do saldo
   * @returns {Object} Objeto com saldo formatado e informações
   */
  static formatBalance(total) {
    // Verifica se o valor é válido
    const numericTotal = isNaN(total) ? 0 : parseFloat(total) || 0;

    const isPositive = numericTotal >= 0;
    const absoluteValue = Math.abs(numericTotal);
    const formattedValue = this.formatCurrency(absoluteValue);

    return {
      formattedValue,
      isPositive,
      displayValue: isPositive ? formattedValue : `- ${formattedValue}`,
      cssClass: isPositive ? '' : 'negative'
    };
  }

  /**
   * Sanitiza strings para prevenir XSS
   * @param {string} str - String a ser sanitizada
   * @returns {string} String sanitizada
   */
  static sanitizeString(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Valida se um valor é um número válido
   * @param {any} value - Valor a ser validado
   * @returns {boolean} True se for um número válido
   */
  static isValidNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  /**
   * Valida se uma string não está vazia
   * @param {string} str - String a ser validada
   * @returns {boolean} True se a string não estiver vazia
   */
  static isValidString(str) {
    return typeof str === 'string' && str.trim().length > 0;
  }

  /**
   * Formata uma data no padrão brasileiro
   * @param {Date} date - Data a ser formatada
   * @returns {string} Data formatada
   */
  static formatDate(date = new Date()) {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Formata data e hora no padrão brasileiro
   * @param {Date} date - Data a ser formatada
   * @returns {string} Data e hora formatadas
   */
  static formatDateTime(date = new Date()) {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Trunca texto com reticências
   * @param {string} text - Texto a ser truncado
   * @param {number} maxLength - Comprimento máximo
   * @returns {string} Texto truncado
   */
  static truncateText(text, maxLength = 50) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Capitaliza a primeira letra de cada palavra
   * @param {string} str - String a ser capitalizada
   * @returns {string} String capitalizada
   */
  static capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }
} 