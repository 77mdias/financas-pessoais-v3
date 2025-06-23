import { TransactionService } from '../services/TransactionService.js';

/**
 * Classe principal que coordena todas as operações de transações
 */
export class TransactionManager {
  constructor(transactionService, config = {}) {
    this.transactionService = transactionService || new TransactionService();
    this.config = config;
    this.transactions = [];

    // Cache para otimização
    this.balanceCache = null;
    this.lastBalanceUpdate = 0;
  }

  /**
   * Carrega todas as transações
   * @returns {Promise<Array>} Lista de transações
   */
  async loadAll() {
    try {
      this.transactions = await this.transactionService.getAllTransactions();
      console.log(`📊 ${this.transactions.length} transações carregadas`);
      return this.transactions;
    } catch (error) {
      console.error('❌ Erro ao carregar transações:', error);
      throw error;
    }
  }

  /**
   * Cria uma nova transação
   * @param {Object} transactionData - Dados da transação
   * @returns {Promise<Object>} Transação criada
   */
  async create(transactionData) {
    try {
      console.log('📝 Criando nova transação:', transactionData);
      const newTransaction = await this.transactionService.createTransaction(transactionData);
      this.transactions.push(newTransaction);
      this._invalidateBalanceCache(); // Invalida cache
      console.log('✅ Transação criada:', newTransaction);
      return newTransaction;
    } catch (error) {
      console.error('❌ Erro ao criar transação:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma transação
   * @param {string|number} id - ID da transação
   * @param {Object} transactionData - Dados atualizados
   * @returns {Promise<Object>} Transação atualizada
   */
  async update(id, transactionData) {
    try {
      console.log('✏️ Atualizando transação:', id, transactionData);
      const updatedTransaction = await this.transactionService.updateTransaction(id, transactionData);

      const index = this.transactions.findIndex(t => t.id == id);
      if (index !== -1) {
        this.transactions[index] = updatedTransaction;
        this._invalidateBalanceCache(); // Invalida cache
      }

      console.log('✅ Transação atualizada:', updatedTransaction);
      return updatedTransaction;
    } catch (error) {
      console.error('❌ Erro ao atualizar transação:', error);
      throw error;
    }
  }

  /**
   * Exclui uma transação
   * @param {string|number} id - ID da transação
   */
  async delete(id) {
    try {
      console.log('🗑️ Excluindo transação:', id);
      await this.transactionService.deleteTransaction(id);
      this.transactions = this.transactions.filter(t => t.id != id);
      this._invalidateBalanceCache(); // Invalida cache
      console.log('✅ Transação excluída:', id);
    } catch (error) {
      console.error('❌ Erro ao excluir transação:', error);
      throw error;
    }
  }

  /**
   * Calcula o saldo total (com cache)
   * @returns {number} Saldo total
   */
  getBalance() {
    const now = Date.now();

    // Se o cache é válido (menos de 100ms), retorna o valor cached
    if (this.balanceCache !== null && (now - this.lastBalanceUpdate) < 100) {
      return this.balanceCache;
    }

    // Recalcula o saldo
    this.balanceCache = this.transactions.reduce((total, transaction) => {
      return total + (transaction.value || 0);
    }, 0);

    this.lastBalanceUpdate = now;
    return this.balanceCache;
  }

  /**
   * Invalida o cache do saldo
   * @private
   */
  _invalidateBalanceCache() {
    this.balanceCache = null;
    this.lastBalanceUpdate = 0;
  }

  /**
   * Configura os callbacks da UI
   */
  setupUICallbacks() {
    const callbacks = {
      onCreate: (data) => this.createTransaction(data),
      onUpdate: (id, data) => this.updateTransaction(id, data),
      onEdit: (id) => this.editTransaction(id),
      onDelete: (id) => this.deleteTransaction(id),
      onCancelEdit: () => this.handleCancelEdit()
    };

    this.uiManager.setupEventListeners(callbacks);
  }

  /**
   * Carrega todas as transações
   */
  async loadTransactions() {
    try {
      this.uiManager.showLoading();

      // Verifica se a API está disponível
      const isApiHealthy = await this.transactionService.checkApiHealth();
      if (!isApiHealthy) {
        throw new Error('API não está disponível');
      }

      this.transactions = await this.transactionService.getAllTransactions();
      this.renderTransactions();
      this.updateBalance();

      console.log(`📊 ${this.transactions.length} transações carregadas`);
    } catch (error) {
      console.error('❌ Erro ao carregar transações:', error);
      this.uiManager.showError('Erro ao carregar transações. Verifique se o json-server está rodando.');
    }
  }

  /**
   * Cria uma nova transação
   * @param {Object} transactionData - Dados da transação
   */
  async createTransaction(transactionData) {
    try {
      console.log('📝 Criando nova transação:', transactionData);

      const newTransaction = await this.transactionService.createTransaction(transactionData);

      // Adiciona à lista local
      this.transactions.push(newTransaction);

      // Atualiza a interface
      this.renderTransactions();
      this.updateBalance();
      this.uiManager.resetForm();
      this.uiManager.showSuccess('Transação criada com sucesso!');

      console.log('✅ Transação criada:', newTransaction);
    } catch (error) {
      console.error('❌ Erro ao criar transação:', error);
      this.uiManager.showAlert('Erro ao criar transação. Tente novamente.');
    }
  }

  /**
   * Atualiza uma transação existente
   * @param {string|number} id - ID da transação
   * @param {Object} transactionData - Dados atualizados
   */
  async updateTransaction(id, transactionData) {
    try {
      console.log('✏️ Atualizando transação:', id, transactionData);

      const updatedTransaction = await this.transactionService.updateTransaction(id, transactionData);

      // Atualiza na lista local
      const index = this.transactions.findIndex(t => t.id == id);
      if (index !== -1) {
        this.transactions[index] = updatedTransaction;
      }

      // Atualiza a interface
      this.renderTransactions();
      this.updateBalance();
      this.uiManager.resetForm();
      this.uiManager.showSuccess('Transação atualizada com sucesso!');

      console.log('✅ Transação atualizada:', updatedTransaction);
    } catch (error) {
      console.error('❌ Erro ao atualizar transação:', error);
      this.uiManager.showAlert('Erro ao atualizar transação. Tente novamente.');
    }
  }

  /**
   * Prepara uma transação para edição
   * @param {string|number} id - ID da transação
   */
  async editTransaction(id) {
    try {
      console.log('✏️ Editando transação:', id);

      const transaction = await this.transactionService.getTransactionById(id);
      this.uiManager.enterEditMode(transaction);

      console.log('✅ Modo de edição ativado para:', transaction);
    } catch (error) {
      console.error('❌ Erro ao carregar transação para edição:', error);
      this.uiManager.showAlert('Erro ao carregar transação para edição.');
    }
  }

  /**
   * Exclui uma transação
   * @param {string|number} id - ID da transação
   */
  async deleteTransaction(id) {
    try {
      const confirmed = this.uiManager.showConfirm('Tem certeza que deseja excluir esta transação?');

      if (!confirmed) {
        return;
      }

      console.log('🗑️ Excluindo transação:', id);

      await this.transactionService.deleteTransaction(id);

      // Remove da lista local
      this.transactions = this.transactions.filter(t => t.id != id);

      // Atualiza a interface
      this.renderTransactions();
      this.updateBalance();
      this.uiManager.showSuccess('Transação excluída com sucesso!');

      console.log('✅ Transação excluída:', id);
    } catch (error) {
      console.error('❌ Erro ao excluir transação:', error);
      this.uiManager.showAlert('Erro ao excluir transação. Tente novamente.');
    }
  }

  /**
   * Manipula o cancelamento da edição
   */
  handleCancelEdit() {
    console.log('↩️ Edição cancelada');
  }

  /**
   * Renderiza as transações na interface
   */
  renderTransactions() {
    this.uiManager.renderTransactions(this.transactions);
  }

  /**
   * Atualiza o saldo na interface
   */
  updateBalance() {
    this.uiManager.updateBalance(this.transactions);
  }

  /**
   * Recarrega todas as transações
   */
  async refresh() {
    console.log('🔄 Recarregando transações...');
    await this.loadTransactions();
  }

  /**
   * Obtém estatísticas das transações
   * @returns {Object} Estatísticas
   */
  getStatistics() {
    const income = this.transactions
      .filter(t => t.value > 0)
      .reduce((sum, t) => sum + t.value, 0);

    const expenses = this.transactions
      .filter(t => t.value < 0)
      .reduce((sum, t) => sum + Math.abs(t.value), 0);

    const balance = income - expenses;

    return {
      totalTransactions: this.transactions.length,
      totalIncome: income,
      totalExpenses: expenses,
      balance,
      averageTransaction: this.transactions.length > 0
        ? balance / this.transactions.length
        : 0
    };
  }

  /**
   * Exporta transações como JSON
   * @returns {string} JSON das transações
   */
  exportTransactions() {
    return JSON.stringify(this.transactions, null, 2);
  }

  /**
   * Filtra transações por tipo
   * @param {string} type - 'income' ou 'expense'
   * @returns {Array} Transações filtradas
   */
  filterTransactionsByType(type) {
    if (type === 'income') {
      return this.transactions.filter(t => t.value >= 0);
    } else if (type === 'expense') {
      return this.transactions.filter(t => t.value < 0);
    }
    return this.transactions;
  }

  /**
   * Busca transações por nome
   * @param {string} searchTerm - Termo de busca
   * @returns {Array} Transações encontradas
   */
  searchTransactions(searchTerm) {
    const term = searchTerm.toLowerCase();
    return this.transactions.filter(t =>
      t.name.toLowerCase().includes(term)
    );
  }

  /**
   * Obtém a lista atual de transações
   * @returns {Array} Lista de transações
   */
  getTransactions() {
    return [...this.transactions];
  }

  /**
   * Verifica se está no modo de edição
   * @returns {boolean} True se está editando
   */
  isEditing() {
    return this.uiManager.isInEditMode();
  }
} 