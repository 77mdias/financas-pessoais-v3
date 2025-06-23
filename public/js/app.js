// Importa o CSS para o Webpack processar
import '../css/styles.css';

/**
 * Aplicação de Finanças Pessoais - Versão Standalone
 * Funciona 100% no navegador usando apenas localStorage
 * Não precisa de json-server ou API externa
 */
class FinanceApp {
  constructor() {
    this.transactions = [];
    this.isInitialized = false;
    this.storageKey = 'financeApp_transactions';
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

      // Carrega dados do localStorage
      this.loadTransactions();

      // Configura eventos
      this.setupEventListeners();

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
   * Carrega transações do localStorage
   */
  loadTransactions() {
    try {
      const savedTransactions = localStorage.getItem(this.storageKey);

      if (savedTransactions) {
        this.transactions = JSON.parse(savedTransactions);
      } else {
        // Dados iniciais se não houver nada salvo
        this.transactions = [
          { id: 1, name: "Salário", value: 5000 },
          { id: 2, name: "Mercado", value: -350 },
          { id: 3, name: "Freelance", value: 1200 }
        ];
        this.saveTransactions();
      }

      this.renderTransactions();
      this.updateBalance();
      console.log(`📊 ${this.transactions.length} transações carregadas do localStorage`);

    } catch (error) {
      console.error('❌ Erro ao carregar transações:', error);
      this.transactions = [];
      this.renderTransactions();
      this.updateBalance();
    }
  }

  /**
   * Salva transações no localStorage
   */
  saveTransactions() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.transactions));
      console.log('💾 Transações salvas no localStorage');
    } catch (error) {
      console.error('❌ Erro ao salvar transações:', error);
      this.showError('Erro ao salvar dados. Verifique se o localStorage está disponível.');
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
   * Manipula o envio do formulário
   */
  handleSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const value = parseFloat(document.getElementById('value').value);

    if (!name || isNaN(value)) {
      this.showAlert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const transactionData = { name, value };
    const editingId = event.target.dataset.editingId;

    if (editingId) {
      this.updateTransaction(parseInt(editingId), transactionData);
    } else {
      this.createTransaction(transactionData);
    }
  }

  /**
   * Cria uma nova transação
   */
  createTransaction(transactionData) {
    try {
      const newTransaction = {
        id: Date.now(), // ID único baseado no timestamp
        name: transactionData.name,
        value: transactionData.value
      };

      this.transactions.push(newTransaction);
      this.saveTransactions();
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
  updateTransaction(id, transactionData) {
    try {
      const index = this.transactions.findIndex(t => t.id === id);

      if (index === -1) {
        this.showAlert('Transação não encontrada.');
        return;
      }

      this.transactions[index] = {
        ...this.transactions[index],
        name: transactionData.name,
        value: transactionData.value
      };

      this.saveTransactions();
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
  deleteTransaction(id) {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) return;

    try {
      const initialLength = this.transactions.length;
      this.transactions = this.transactions.filter(t => t.id !== parseInt(id));

      if (this.transactions.length === initialLength) {
        this.showAlert('Transação não encontrada.');
        return;
      }

      this.saveTransactions();
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
    const transaction = this.transactions.find(t => t.id === parseInt(id));
    if (!transaction) {
      this.showAlert('Transação não encontrada.');
      return;
    }

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

    if (form) form.reset();
    if (form) form.removeAttribute('data-editing-id');
    if (submitBtn) submitBtn.textContent = 'Adicionar Transação';
    if (cancelBtn) cancelBtn.style.display = 'none';
  }

  /**
   * Renderiza as transações na tela
   */
  renderTransactions() {
    const transactionsList = document.getElementById('transactions-list');
    if (!transactionsList) return;

    if (this.transactions.length === 0) {
      transactionsList.innerHTML = '<p>Nenhuma transação encontrada. Adicione uma nova transação!</p>';
      return;
    }

    transactionsList.innerHTML = this.transactions.map(transaction => `
      <div class="transaction-item ${transaction.value >= 0 ? 'income' : 'expense'}">
        <div class="transaction-info">
          <span class="transaction-name">${transaction.name}</span>
          <span class="transaction-value">R$ ${transaction.value.toFixed(2)}</span>
        </div>
        <div class="transaction-actions">
          <button onclick="app.editTransaction(${transaction.id})" class="edit-btn">✏️ Editar</button>
          <button onclick="app.deleteTransaction(${transaction.id})" class="delete-btn">🗑️ Excluir</button>
        </div>
      </div>
    `).join('');
  }

  /**
   * Atualiza o saldo total
   */
  updateBalance() {
    const balance = this.transactions.reduce((sum, transaction) => sum + transaction.value, 0);
    const balanceElement = document.getElementById('balance');

    if (balanceElement) {
      balanceElement.textContent = balance.toFixed(2);
      balanceElement.className = balance >= 0 ? 'positive' : 'negative';
    }
  }

  /**
   * Limpa todos os dados
   */
  clearAllData() {
    if (!confirm('⚠️ Isso irá apagar TODAS as transações. Tem certeza?')) return;

    this.transactions = [];
    this.saveTransactions();
    this.renderTransactions();
    this.updateBalance();
    this.showSuccess('Todos os dados foram apagados!');
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
    this.showSuccess('Dados exportados com sucesso!');
  }

  /**
   * Importa transações de arquivo JSON
   */
  importTransactions(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (Array.isArray(importedData)) {
          this.transactions = importedData;
          this.saveTransactions();
          this.renderTransactions();
          this.updateBalance();
          this.showSuccess('Dados importados com sucesso!');
        } else {
          this.showAlert('Formato de arquivo inválido.');
        }
      } catch (error) {
        this.showAlert('Erro ao importar arquivo. Verifique o formato.');
      }
    };
    reader.readAsText(file);
  }

  /**
   * Mostra mensagem de sucesso
   */
  showSuccess(message) {
    console.log('✅ ' + message);
    alert('✅ ' + message);
  }

  /**
   * Mostra mensagem de alerta
   */
  showAlert(message) {
    console.warn('⚠️ ' + message);
    alert('⚠️ ' + message);
  }

  /**
   * Mostra mensagem de erro
   */
  showError(message) {
    console.error('❌ ' + message);
    alert('❌ ' + message);
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
   * Configura funcionalidades extras da aplicação
   */
  setupExtraFeatures() {
    // Adiciona atalhos de teclado
    this.setupKeyboardShortcuts();

    // Adiciona informações de debug no console
    this.setupDebugInfo();

    // Configura tratamento de erros globais
    this.setupGlobalErrorHandling();
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
      clearAll: () => this.clearAllData(),
      exportData: () => this.exportTransactions(),
      refresh: () => this.loadTransactions(),
      version: '3.0.0',
      mode: 'Standalone - localStorage only'
    };

    console.log('🔧 Ferramentas de debug disponíveis em window.financeApp');
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
      version: '3.0.0',
      mode: 'Standalone',
      storage: 'localStorage',
      transactionsCount: this.transactions.length,
      features: [
        'CRUD completo',
        'localStorage persistente',
        'Interface responsiva',
        'Atalhos de teclado',
        'Exportar/Importar dados',
        'Sem dependência de servidor'
      ]
    };
  }
}

// Inicializa a aplicação
const app = new FinanceApp();
app.init();

// Exporta para uso global
window.app = app;

// Log de inicialização
console.log(`
╔══════════════════════════════════════╗
║     💰 FINANÇAS PESSOAIS V3.0       ║
║                                      ║
║  🏗️  Modo Standalone                 ║
║  💾 localStorage Only                ║
║  🎨 Interface Responsiva             ║
║  🔧 Sem Dependência de Servidor      ║
║                                      ║
║  Desenvolvido com ❤️ em JavaScript   ║
╚══════════════════════════════════════╝
`); 