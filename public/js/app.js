// Versão simplificada sem imports externos para uso direto no navegador
// import { TransactionManager } from '../../src/managers/TransactionManager.js';

/**
 * Aplicação principal de Finanças Pessoais
 * Versão standalone sem dependências externas
 */
class FinanceApp {
  constructor() {
    this.transactions = [];
    this.isInitialized = false;
    this.apiBaseUrl = 'http://localhost:3001/transactions';
  }

  /**
   * Inicializa a aplicação
   */
  async init() {
    try {
      console.log('🚀 Iniciando aplicação de Finanças Pessoais...');

      // Verifica se o DOM está carregado
      if (document.readyState === 'loading') {
        await this.waitForDOMReady();
      }

      // Configura eventos
      this.setupEventListeners();

      // Carrega transações
      await this.loadTransactions();

      // Configura tratamento de erros globais
      this.setupGlobalErrorHandling();

      // Configura funcionalidades extras
      this.setupExtraFeatures();

      this.isInitialized = true;
      console.log('✅ Aplicação inicializada com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao inicializar aplicação:', error);
      this.showInitializationError(error);
    }
  }

  /**
   * Configura os event listeners
   */
  setupEventListeners() {
    const form = document.getElementById('transaction-form');
    const cancelBtn = document.getElementById('cancel-btn');

    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.cancelEdit());
    }
  }

  /**
   * Carrega transações da API
   */
  async loadTransactions() {
    try {
      const response = await fetch(this.apiBaseUrl);
      if (!response.ok) throw new Error('Erro ao carregar transações');

      this.transactions = await response.json();
      this.renderTransactions();
      this.updateBalance();

      console.log(`📊 ${this.transactions.length} transações carregadas`);
    } catch (error) {
      console.error('❌ Erro ao carregar transações:', error);
      this.showError('Erro ao carregar transações. Verifique se o json-server está rodando na porta 3001.');
    }
  }

  /**
   * Manipula o envio do formulário
   */
  async handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = document.getElementById('name').value;
    const value = parseFloat(document.getElementById('value').value);

    if (!name || isNaN(value)) {
      this.showAlert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const transactionData = { name, value };

    const editingId = event.target.dataset.editingId;
    if (editingId) {
      await this.updateTransaction(editingId, transactionData);
    } else {
      await this.createTransaction(transactionData);
    }
  }

  /**
   * Cria uma nova transação
   */
  async createTransaction(transactionData) {
    try {
      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      });

      if (!response.ok) throw new Error('Erro ao criar transação');

      const newTransaction = await response.json();
      this.transactions.push(newTransaction);

      this.renderTransactions();
      this.updateBalance();
      this.resetForm();
      this.showSuccess('Transação criada com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao criar transação:', error);
      this.showAlert('Erro ao criar transação. Tente novamente.');
    }
  }

  /**
   * Atualiza uma transação
   */
  async updateTransaction(id, transactionData) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      });

      if (!response.ok) throw new Error('Erro ao atualizar transação');

      const updatedTransaction = await response.json();
      const index = this.transactions.findIndex(t => t.id == id);
      if (index !== -1) {
        this.transactions[index] = updatedTransaction;
      }

      this.renderTransactions();
      this.updateBalance();
      this.resetForm();
      this.showSuccess('Transação atualizada com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao atualizar transação:', error);
      this.showAlert('Erro ao atualizar transação. Tente novamente.');
    }
  }

  /**
   * Exclui uma transação
   */
  async deleteTransaction(id) {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) return;

    try {
      const response = await fetch(`${this.apiBaseUrl}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erro ao excluir transação');

      this.transactions = this.transactions.filter(t => t.id != id);
      this.renderTransactions();
      this.updateBalance();
      this.showSuccess('Transação excluída com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao excluir transação:', error);
      this.showAlert('Erro ao excluir transação. Tente novamente.');
    }
  }

  /**
   * Inicia a edição de uma transação
   */
  editTransaction(id) {
    const transaction = this.transactions.find(t => t.id == id);
    if (!transaction) return;

    document.getElementById('name').value = transaction.name;
    document.getElementById('value').value = transaction.value;

    const form = document.getElementById('transaction-form');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    form.dataset.editingId = id;
    submitBtn.textContent = 'Atualizar Transação';
    cancelBtn.style.display = 'inline-block';
  }

  /**
   * Cancela a edição
   */
  cancelEdit() {
    this.resetForm();
  }

  /**
   * Reseta o formulário
   */
  resetForm() {
    const form = document.getElementById('transaction-form');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    form.reset();
    delete form.dataset.editingId;
    submitBtn.textContent = 'Adicionar Transação';
    cancelBtn.style.display = 'none';
  }

  /**
   * Renderiza as transações na tela
   */
  renderTransactions() {
    const container = document.getElementById('transactions-list');
    if (!container) return;

    if (this.transactions.length === 0) {
      container.innerHTML = '<p>Nenhuma transação cadastrada.</p>';
      return;
    }

    container.innerHTML = this.transactions.map(transaction => `
      <div class="transaction-item ${transaction.value >= 0 ? 'income' : 'expense'}">
        <div class="transaction-info">
          <strong>${transaction.name}</strong>
          <span class="transaction-value">
            R$ ${transaction.value.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <div class="transaction-actions">
          <button onclick="app.editTransaction(${transaction.id})" class="edit-btn">✏️</button>
          <button onclick="app.deleteTransaction(${transaction.id})" class="delete-btn">🗑️</button>
        </div>
      </div>
    `).join('');
  }

  /**
   * Atualiza o saldo total
   */
  updateBalance() {
    const balance = this.transactions.reduce((total, t) => total + (t.value || 0), 0);
    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
      balanceElement.textContent = balance.toFixed(2).replace('.', ',');
      balanceElement.className = balance >= 0 ? 'positive' : 'negative';
    }
  }

  /**
   * Mostra mensagem de sucesso
   */
  showSuccess(message) {
    // Implementação simples - você pode melhorar isso
    alert('✅ ' + message);
  }

  /**
   * Mostra mensagem de erro
   */
  showAlert(message) {
    alert('⚠️ ' + message);
  }

  /**
   * Mostra erro geral
   */
  showError(message) {
    console.error(message);
    alert('❌ ' + message);
  }

  /**
   * Calcula estatísticas das transações
   */
  calculateStatistics() {
    const income = this.transactions.filter(t => t.value > 0);
    const expenses = this.transactions.filter(t => t.value < 0);
    const totalIncome = income.reduce((sum, t) => sum + t.value, 0);
    const totalExpenses = Math.abs(expenses.reduce((sum, t) => sum + t.value, 0));

    return {
      totalTransactions: this.transactions.length,
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      incomeCount: income.length,
      expenseCount: expenses.length
    };
  }

  /**
   * Exporta transações para JSON
   */
  exportTransactions() {
    const dataStr = JSON.stringify(this.transactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `transacoes_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  /**
   * Aguarda o DOM estar completamente carregado
   */
  waitForDOMReady() {
    return new Promise((resolve) => {
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        resolve();
      } else {
        document.addEventListener('DOMContentLoaded', resolve);
      }
    });
  }

  /**
   * Configura tratamento de erros globais
   */
  setupGlobalErrorHandling() {
    window.addEventListener('error', (event) => {
      console.error('❌ Erro global capturado:', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('❌ Promise rejeitada não tratada:', event.reason);
    });
  }

  /**
   * Configura funcionalidades extras da aplicação
   */
  setupExtraFeatures() {
    // Adiciona atalhos de teclado
    this.setupKeyboardShortcuts();

    // Adiciona informações de debug no console
    this.setupDebugInfo();

    // Configura visibilidade da página
    this.setupPageVisibility();
  }

  /**
   * Configura atalhos de teclado
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + N = Nova transação (foca no campo nome)
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        const nameInput = document.getElementById('name');
        if (nameInput) {
          nameInput.focus();
        }
      }

      // Escape = Cancelar edição
      if (event.key === 'Escape') {
        const form = document.getElementById('transaction-form');
        if (form && form.dataset.editingId) {
          this.cancelEdit();
        }
      }
    });
  }

  /**
   * Configura informações de debug
   */
  setupDebugInfo() {
    // Adiciona métodos de debug ao objeto window
    window.financeApp = {
      getTransactions: () => this.transactions,
      getStatistics: () => this.calculateStatistics(),
      exportData: () => this.exportTransactions(),
      refresh: () => this.loadTransactions(),
      version: '2.0.0',
      architecture: 'Modular'
    };

    console.log('🔧 Ferramentas de debug disponíveis em window.financeApp');
  }

  /**
   * Configura comportamento quando a página fica visível/invisível
   */
  setupPageVisibility() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.isInitialized) {
        // Recarrega dados quando a página volta a ficar visível
        console.log('👁️ Página ficou visível, recarregando dados...');
        this.loadTransactions();
      }
    });
  }

  /**
   * Mostra erro de inicialização
   */
  showInitializationError(error) {
    const container = document.querySelector('.container');
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 50px; background: white; border-radius: 10px; margin: 20px;">
          <h2 style="color: #e53e3e; margin-bottom: 20px;">❌ Erro de Inicialização</h2>
          <p style="margin-bottom: 20px;">Não foi possível inicializar a aplicação.</p>
          <p style="margin-bottom: 20px; color: #666;">Erro: ${error.message}</p>
          <button onclick="location.reload()" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
            🔄 Recarregar Página
          </button>
        </div>
      `;
    }
  }

  /**
   * Obtém informações sobre o estado da aplicação
   */
  getAppInfo() {
    return {
      initialized: this.isInitialized,
      version: '2.0.0',
      architecture: 'Modular',
      modules: [
        'TransactionManager',
        'TransactionService',
        'UIManager',
        'Formatter'
      ],
      features: [
        'CRUD completo',
        'Validação de dados',
        'Interface responsiva',
        'Tratamento de erros',
        'Atalhos de teclado',
        'Debug tools'
      ]
    };
  }
}

// Inicializa a aplicação
const app = new FinanceApp();
app.init();

// Exporta para uso global se necessário
window.app = app;

// Log de inicialização
console.log(`
╔══════════════════════════════════════╗
║     💰 FINANÇAS PESSOAIS V2.0       ║
║                                      ║
║  🏗️  Arquitetura Modular             ║
║  📦 Módulos ES6                      ║
║  🎨 Interface Moderna                ║
║  🔧 Ferramentas de Debug             ║
║                                      ║
║  Desenvolvido com ❤️ em JavaScript   ║
╚══════════════════════════════════════╝
`); 