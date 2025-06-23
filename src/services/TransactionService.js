import { StorageService } from './StorageService.js';

/**
 * Serviço responsável por todas as operações de transações
 * Usa localStorage para persistência e API como fallback
 */
export class TransactionService {
  constructor(apiUrl = null) {
    this.storage = new StorageService();
    this.useLocalStorage = true; // Prioriza localStorage para melhor performance

    // Detecta automaticamente se está em produção ou desenvolvimento
    if (!apiUrl) {
      const isProduction = window.location.hostname !== 'localhost';
      this.apiUrl = isProduction
        ? '/api/transactions'  // API de produção
        : 'http://localhost:3001/transactions';  // json-server local
    } else {
      this.apiUrl = apiUrl;
    }

    console.log(`🔧 TransactionService inicializado (localStorage: ${this.useLocalStorage})`);
  }

  /**
   * Busca todas as transações
   * @returns {Promise<Array>} Lista de transações
   */
  async getAllTransactions() {
    if (this.useLocalStorage) {
      try {
        const transactions = this.storage.loadTransactions();
        return Promise.resolve(transactions);
      } catch (error) {
        console.error('Erro ao carregar do localStorage:', error);
        // Fallback para API
      }
    }

    // Fallback para API
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar transações da API:', error);
      // Último fallback: dados padrão
      return this.storage.getDefaultTransactions();
    }
  }

  /**
   * Busca uma transação específica por ID
   * @param {string|number} id - ID da transação
   * @returns {Promise<Object>} Dados da transação
   */
  async getTransactionById(id) {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar transação:', error);
      throw error;
    }
  }

  /**
   * Cria uma nova transação
   * @param {Object} transactionData - Dados da transação
   * @param {string} transactionData.name - Nome da transação
   * @param {number} transactionData.value - Valor da transação
   * @returns {Promise<Object>} Transação criada
   */
  async createTransaction(transactionData) {
    if (this.useLocalStorage) {
      try {
        const transactions = this.storage.addTransaction(transactionData);
        const newTransaction = transactions[transactions.length - 1];
        console.log('✅ Transação criada no localStorage:', newTransaction);
        return Promise.resolve(newTransaction);
      } catch (error) {
        console.error('Erro ao criar no localStorage:', error);
      }
    }

    // Fallback para API
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar transação na API:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma transação existente
   * @param {string|number} id - ID da transação
   * @param {Object} transactionData - Dados atualizados da transação
   * @returns {Promise<Object>} Transação atualizada
   */
  async updateTransaction(id, transactionData) {
    if (this.useLocalStorage) {
      try {
        this.storage.updateTransaction(id, transactionData);
        const updatedTransaction = { id, ...transactionData };
        console.log('✅ Transação atualizada no localStorage:', updatedTransaction);
        return Promise.resolve(updatedTransaction);
      } catch (error) {
        console.error('Erro ao atualizar no localStorage:', error);
      }
    }

    // Fallback para API
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar transação na API:', error);
      throw error;
    }
  }

  /**
   * Exclui uma transação
   * @param {string|number} id - ID da transação a ser excluída
   * @returns {Promise<void>}
   */
  async deleteTransaction(id) {
    if (this.useLocalStorage) {
      try {
        this.storage.deleteTransaction(id);
        console.log('✅ Transação excluída do localStorage:', id);
        return Promise.resolve();
      } catch (error) {
        console.error('Erro ao excluir do localStorage:', error);
      }
    }

    // Fallback para API
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao excluir transação na API:', error);
      throw error;
    }
  }

  /**
   * Verifica se a API está disponível
   * @returns {Promise<boolean>} True se a API estiver disponível
   */
  async checkApiHealth() {
    try {
      const response = await fetch(this.apiUrl);
      return response.ok;
    } catch {
      return false;
    }
  }
} 