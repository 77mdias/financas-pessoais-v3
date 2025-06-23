// =============================================================================
// FINANCE APP - Classe Principal da Aplicação
// =============================================================================

import { TransactionService } from '../services/TransactionService.js';
import { TransactionManager } from '../managers/TransactionManager.js';
import { UIManager } from '../ui/UIManager.js';
import { Formatter } from '../utils/Formatter.js';
import { AppRenderer } from './AppRenderer.js';

/**
 * Classe principal da aplicação de finanças pessoais
 * Coordena todos os módulos e gerencia o ciclo de vida da aplicação
 */
export class FinanceApp {
  /**
   * @param {AppConfig} config - Configuração da aplicação
   */
  constructor(config) {
    this.config = config;
    this.isInitialized = false;
    this.services = {};
    this.managers = {};
    this.ui = null;
    this.renderer = null;

    console.log('📦 FinanceApp instanciada');
  }

  /**
   * Inicializa a aplicação
   */
  async init() {
    if (this.isInitialized) {
      console.warn('⚠️ Aplicação já foi inicializada');
      return;
    }

    try {
      console.log('🚀 Inicializando FinanceApp...');

      // 1. Inicializa serviços
      await this._initializeServices();

      // 2. Inicializa gerenciadores
      await this._initializeManagers();

      // 3. Inicializa UI
      await this._initializeUI();

      // 4. Renderiza a aplicação
      await this._renderApp();

      // 5. Carrega dados iniciais
      await this._loadInitialData();

      // 6. Configura event listeners globais
      this._setupGlobalEventListeners();

      this.isInitialized = true;
      console.log('✅ FinanceApp inicializada com sucesso');

    } catch (error) {
      console.error('❌ Erro ao inicializar FinanceApp:', error);
      throw error;
    }
  }

  /**
   * Inicializa os serviços
   * @private
   */
  async _initializeServices() {
    console.log('🔧 Inicializando serviços...');

    // Transaction Service
    this.services.transaction = new TransactionService();

    console.log('✅ Serviços inicializados');
  }

  /**
   * Inicializa os gerenciadores
   * @private
   */
  async _initializeManagers() {
    console.log('🏗️ Inicializando gerenciadores...');

    // Transaction Manager
    this.managers.transaction = new TransactionManager(
      this.services.transaction,
      this.config.transaction
    );

    console.log('✅ Gerenciadores inicializados');
  }

  /**
   * Inicializa a interface do usuário
   * @private
   */
  async _initializeUI() {
    console.log('🎨 Inicializando interface...');

    this.ui = new UIManager(this.config.ui);
    this.renderer = new AppRenderer(this.config.renderer);

    console.log('✅ Interface inicializada');
  }

  /**
   * Renderiza a aplicação no DOM
   * @private
   */
  async _renderApp() {
    console.log('🖼️ Renderizando aplicação...');

    const appContainer = document.getElementById('app');
    if (!appContainer) {
      throw new Error('Container #app não encontrado');
    }

    // Renderiza a estrutura base da aplicação
    await this.renderer.render(appContainer);

    // Conecta o UI Manager aos elementos renderizados
    this.ui.connect(appContainer);

    console.log('✅ Aplicação renderizada');
  }

  /**
   * Carrega dados iniciais
   * @private
   */
  async _loadInitialData() {
    console.log('📊 Carregando dados iniciais...');

    try {
      // Carrega transações
      const transactions = await this.managers.transaction.loadAll();

      // Atualiza a interface com os dados
      this.ui.updateTransactionsList(transactions);
      this.ui.updateBalance(this.managers.transaction.getBalance());

      console.log(`✅ ${transactions.length} transações carregadas`);

    } catch (error) {
      console.error('❌ Erro ao carregar dados iniciais:', error);
      this.ui.showError('Erro ao carregar dados iniciais. Tente recarregar a página.');
    }
  }

  /**
   * Configura event listeners globais
   * @private
   */
  _setupGlobalEventListeners() {
    console.log('🔗 Configurando event listeners...');

    // Form de nova transação (otimizado)
    this.ui.onTransactionSubmit(async (transactionData) => {
      try {
        this.ui.showLoading(true);

        const newTransaction = await this.managers.transaction.create(transactionData);

        // Atualizações otimizadas - não recarrega toda a lista
        this.ui.addTransactionToList(newTransaction);
        this.ui.updateBalanceOptimized(this.managers.transaction.getBalance());
        this.ui.updateTransactionsCountOptimized(this.managers.transaction.transactions.length);
        this.ui.clearForm();
        this.ui.showSuccess('Transação criada com sucesso!');

      } catch (error) {
        console.error('❌ Erro ao criar transação:', error);
        this.ui.showError('Erro ao criar transação. Tente novamente.');
      } finally {
        this.ui.showLoading(false);
      }
    });

    // Edição de transação (otimizado)
    this.ui.onTransactionEdit(async (id, transactionData) => {
      try {
        this.ui.showLoading(true);

        const updatedTransaction = await this.managers.transaction.update(id, transactionData);

        // Atualizações otimizadas
        this.ui.updateTransactionInList(updatedTransaction);
        this.ui.updateBalanceOptimized(this.managers.transaction.getBalance());
        this.ui.showSuccess('Transação atualizada com sucesso!');

      } catch (error) {
        console.error('❌ Erro ao editar transação:', error);
        this.ui.showError('Erro ao editar transação. Tente novamente.');
      } finally {
        this.ui.showLoading(false);
      }
    });

    // Exclusão de transação (otimizado)
    this.ui.onTransactionDelete(async (id) => {
      try {
        if (!confirm('Tem certeza que deseja excluir esta transação?')) {
          return;
        }

        this.ui.showLoading(true);

        await this.managers.transaction.delete(id);

        // Atualizações otimizadas
        this.ui.removeTransactionFromList(id);
        this.ui.updateBalanceOptimized(this.managers.transaction.getBalance());
        this.ui.updateTransactionsCountOptimized(this.managers.transaction.transactions.length);
        this.ui.showSuccess('Transação excluída com sucesso!');

      } catch (error) {
        console.error('❌ Erro ao excluir transação:', error);
        this.ui.showError('Erro ao excluir transação. Tente novamente.');
      } finally {
        this.ui.showLoading(false);
      }
    });

    // Atalhos de teclado
    document.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + N = Nova transação
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        this.ui.focusNewTransactionForm();
      }

      // Escape = Cancelar/Fechar
      if (event.key === 'Escape') {
        this.ui.cancelCurrentAction();
      }
    });

    // Detecção de visibilidade da página
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isInitialized) {
        console.log('👁️ Página ficou visível, recarregando dados...');
        this._loadInitialData();
      }
    });

    console.log('✅ Event listeners configurados');
  }

  /**
   * Recarrega todos os dados
   */
  async reload() {
    console.log('🔄 Recarregando aplicação...');

    try {
      this.ui.showLoading(true);
      await this._loadInitialData();
      console.log('✅ Dados recarregados');
    } catch (error) {
      console.error('❌ Erro ao recarregar dados:', error);
      this.ui.showError('Erro ao recarregar dados.');
    } finally {
      this.ui.showLoading(false);
    }
  }

  /**
   * Reseta a aplicação
   */
  async reset() {
    console.log('🗑️ Resetando aplicação...');

    if (!confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      this.ui.showLoading(true);

      await this.managers.transaction.deleteAll();

      this.ui.clearTransactionsList();
      this.ui.updateBalance(0);
      this.ui.clearForm();
      this.ui.showSuccess('Aplicação resetada com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao resetar aplicação:', error);
      this.ui.showError('Erro ao resetar aplicação.');
    } finally {
      this.ui.showLoading(false);
    }
  }

  /**
   * Exporta dados para JSON
   */
  async exportData() {
    try {
      const transactions = this.managers.transaction.getAll();
      const exportData = {
        transactions,
        exportedAt: new Date().toISOString(),
        version: '3.0',
        app: 'Finanças Pessoais'
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financas-${Formatter.formatDate(new Date(), 'YYYY-MM-DD')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.ui.showSuccess('Dados exportados com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao exportar dados:', error);
      this.ui.showError('Erro ao exportar dados.');
    }
  }

  /**
   * Obtém estatísticas da aplicação
   */
  getStats() {
    const transactions = this.managers.transaction.getAll();
    const balance = this.managers.transaction.getBalance();

    const stats = {
      totalTransactions: transactions.length,
      balance: balance,
      positiveTransactions: transactions.filter(t => t.valor > 0).length,
      negativeTransactions: transactions.filter(t => t.valor < 0).length,
      averageValue: transactions.length > 0
        ? transactions.reduce((sum, t) => sum + t.valor, 0) / transactions.length
        : 0
    };

    console.table(stats);
    return stats;
  }

  /**
   * Destrói a aplicação e limpa recursos
   */
  destroy() {
    console.log('💥 Destruindo FinanceApp...');

    // Remove event listeners
    document.removeEventListener('keydown', this._globalKeyHandler);
    document.removeEventListener('visibilitychange', this._visibilityHandler);

    // Destrói componentes
    if (this.ui) {
      this.ui.destroy();
    }

    if (this.renderer) {
      this.renderer.destroy();
    }

    // Limpa referências
    this.services = {};
    this.managers = {};
    this.ui = null;
    this.renderer = null;
    this.isInitialized = false;

    console.log('✅ FinanceApp destruída');
  }
} 