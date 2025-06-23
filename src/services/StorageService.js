/**
 * Serviço de armazenamento local para persistir transações
 */
export class StorageService {
  constructor() {
    this.storageKey = 'financas_pessoais_transactions';
    this.isLocalStorageAvailable = this.checkLocalStorage();
  }

  /**
   * Verifica se localStorage está disponível
   * @returns {boolean}
   */
  checkLocalStorage() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Carrega transações do localStorage
   * @returns {Array} Lista de transações
   */
  loadTransactions() {
    if (!this.isLocalStorageAvailable) {
      console.warn('localStorage não disponível, usando dados padrão');
      return this.getDefaultTransactions();
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        let transactions = JSON.parse(stored);

        // Migração: converte 'amount' para 'value' se necessário
        transactions = this.migrateTransactions(transactions);

        console.log(`📊 ${transactions.length} transações carregadas do localStorage`);
        return transactions;
      }
    } catch (error) {
      console.error('Erro ao carregar transações do localStorage:', error);
    }

    // Se não há dados salvos, retorna dados padrão
    const defaultTransactions = this.getDefaultTransactions();
    this.saveTransactions(defaultTransactions);
    return defaultTransactions;
  }

  /**
   * Salva transações no localStorage
   * @param {Array} transactions - Lista de transações
   */
  saveTransactions(transactions) {
    if (!this.isLocalStorageAvailable) {
      console.warn('localStorage não disponível, dados não serão persistidos');
      return;
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(transactions));
      console.log(`💾 ${transactions.length} transações salvas no localStorage`);
    } catch (error) {
      console.error('Erro ao salvar transações no localStorage:', error);
    }
  }

  /**
   * Adiciona uma nova transação
   * @param {Object} transaction - Nova transação
   * @returns {Array} Lista atualizada de transações
   */
  addTransaction(transaction) {
    const transactions = this.loadTransactions();

    // Garante que o valor seja um número válido
    const sanitizedTransaction = {
      ...transaction,
      id: this.generateId(transactions),
      value: isNaN(transaction.value) ? 0 : parseFloat(transaction.value)
    };

    transactions.push(sanitizedTransaction);
    this.saveTransactions(transactions);
    return transactions;
  }

  /**
   * Atualiza uma transação existente
   * @param {number} id - ID da transação
   * @param {Object} updatedData - Dados atualizados
   * @returns {Array} Lista atualizada de transações
   */
  updateTransaction(id, updatedData) {
    const transactions = this.loadTransactions();
    const index = transactions.findIndex(t => t.id === id);

    if (index !== -1) {
      // Garante que o valor seja um número válido se estiver sendo atualizado
      const sanitizedData = { ...updatedData };
      if (sanitizedData.value !== undefined) {
        sanitizedData.value = isNaN(sanitizedData.value) ? 0 : parseFloat(sanitizedData.value);
      }

      transactions[index] = { ...transactions[index], ...sanitizedData };
      this.saveTransactions(transactions);
    }

    return transactions;
  }

  /**
   * Remove uma transação
   * @param {number} id - ID da transação
   * @returns {Array} Lista atualizada de transações
   */
  deleteTransaction(id) {
    const transactions = this.loadTransactions();
    const filteredTransactions = transactions.filter(t => t.id !== id);
    this.saveTransactions(filteredTransactions);
    return filteredTransactions;
  }

  /**
   * Gera um ID único para nova transação
   * @param {Array} transactions - Lista atual de transações
   * @returns {number} Novo ID
   */
  generateId(transactions) {
    if (transactions.length === 0) return 1;
    return Math.max(...transactions.map(t => t.id)) + 1;
  }

  /**
   * Migra transações antigas que usavam 'amount' para 'value'
   * @param {Array} transactions - Lista de transações
   * @returns {Array} Lista migrada
   */
  migrateTransactions(transactions) {
    let migrated = false;

    const migratedTransactions = transactions.map(transaction => {
      if (transaction.amount !== undefined && transaction.value === undefined) {
        migrated = true;
        const { amount, ...rest } = transaction;
        return { ...rest, value: amount };
      }
      return transaction;
    });

    if (migrated) {
      console.log('🔄 Transações migradas de "amount" para "value"');
      this.saveTransactions(migratedTransactions);
    }

    return migratedTransactions;
  }

  /**
   * Retorna transações padrão
   * @returns {Array} Transações padrão
   */
  getDefaultTransactions() {
    return [
      { id: 1, name: "Salário", value: 5000 },
      { id: 2, name: "Mercado", value: -350 },
      { id: 3, name: "Freelance", value: 1200 }
    ];
  }

  /**
   * Limpa todos os dados salvos
   */
  clearAllData() {
    if (this.isLocalStorageAvailable) {
      localStorage.removeItem(this.storageKey);
      console.log('🗑️ Todos os dados foram removidos');
    }
  }

  /**
   * Força reinicialização com dados limpos
   */
  resetToDefaults() {
    this.clearAllData();
    const defaultTransactions = this.getDefaultTransactions();
    this.saveTransactions(defaultTransactions);
    console.log('🔄 Dados reinicializados com valores padrão');
    return defaultTransactions;
  }

  /**
   * Exporta dados para backup
   * @returns {string} JSON string dos dados
   */
  exportData() {
    const transactions = this.loadTransactions();
    return JSON.stringify(transactions, null, 2);
  }

  /**
   * Importa dados de backup
   * @param {string} jsonData - Dados em formato JSON
   * @returns {boolean} Sucesso da operação
   */
  importData(jsonData) {
    try {
      const transactions = JSON.parse(jsonData);
      if (Array.isArray(transactions)) {
        this.saveTransactions(transactions);
        console.log('📥 Dados importados com sucesso');
        return true;
      }
    } catch (error) {
      console.error('Erro ao importar dados:', error);
    }
    return false;
  }
} 