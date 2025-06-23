import { Formatter } from '../utils/Formatter.js';

/**
 * Classe responsável por toda a manipulação da interface do usuário
 */
export class UIManager {
  constructor(config = {}) {
    this.config = config;
    this.callbacks = {};
    this.isEditing = false;
    this.editingTransactionId = null;

    // Cache para otimização
    this.transactionCache = new Map();
    this.lastUpdateTime = 0;

    // Debounce para atualizações
    this.updateBalanceDebounced = this.debounce(this.updateBalance.bind(this), 100);
    this.updateCountDebounced = this.debounce(this.updateTransactionsCount.bind(this), 100);
  }

  /**
   * Conecta o UIManager aos elementos do DOM
   * @param {HTMLElement} container - Container da aplicação
   */
  connect(container) {
    this.container = container;
    this.elements = {
      transactionForm: container.querySelector('#transaction-form'),
      nameInput: container.querySelector('#name'),
      amountInput: container.querySelector('#value'),
      submitBtn: container.querySelector('#submit-btn'),
      cancelBtn: container.querySelector('#cancel-btn'),
      transactionsList: container.querySelector('#transactions-list'),
      balanceAmount: container.querySelector('#balance'),
      transactionsCount: container.querySelector('#transactions-count'),
      transactionsEmpty: container.querySelector('#transactions-empty')
    };

    this.setupEventListeners();
  }

  /**
   * Configura os event listeners da interface
   */
  setupEventListeners() {
    if (!this.elements.transactionForm) return;

    // Event listener do formulário
    this.elements.transactionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    // Event listener do botão cancelar
    if (this.elements.cancelBtn) {
      this.elements.cancelBtn.addEventListener('click', () => {
        this.cancelEdit();
      });
    }

    // Event delegation para botões das transações
    if (this.elements.transactionsList) {
      this.elements.transactionsList.addEventListener('click', (e) => {
        this.handleTransactionClick(e);
      });
    }
  }

  /**
   * Define callback para criação de transação
   * @param {Function} callback - Função callback
   */
  onTransactionSubmit(callback) {
    this.callbacks.onSubmit = callback;
  }

  /**
   * Define callback para edição de transação
   * @param {Function} callback - Função callback
   */
  onTransactionEdit(callback) {
    this.callbacks.onEdit = callback;
  }

  /**
   * Define callback para exclusão de transação
   * @param {Function} callback - Função callback
   */
  onTransactionDelete(callback) {
    this.callbacks.onDelete = callback;
  }

  /**
   * Manipula o clique em botões das transações
   * @param {Event} e - Evento de clique
   */
  handleTransactionClick(e) {
    if (e.target.closest('.edit-btn')) {
      const id = e.target.closest('.edit-btn').dataset.id;
      this.callbacks.onEdit(id);
    } else if (e.target.closest('.delete-btn')) {
      const id = e.target.closest('.delete-btn').dataset.id;
      this.callbacks.onDelete(id);
    }
  }

  /**
   * Manipula o envio do formulário
   */
  handleFormSubmit() {
    const formData = this.getFormData();

    if (!this.validateFormData(formData)) {
      return;
    }

    if (this.callbacks.onSubmit) {
      this.callbacks.onSubmit(formData);
    }
  }

  /**
   * Atualiza a lista de transações
   * @param {Array} transactions - Lista de transações
   */
  updateTransactionsList(transactions) {
    this.renderTransactions(transactions);
    this.updateTransactionsCount(Array.isArray(transactions) ? transactions.length : 0);
  }

  /**
   * Atualiza o saldo
   * @param {number} balance - Saldo atual
   */
  updateBalance(balance) {
    if (this.elements.balanceAmount) {
      this.elements.balanceAmount.textContent = this.formatCurrency(balance);
      this.elements.balanceAmount.className = balance >= 0 ? 'positive' : 'negative';
    }
  }

  /**
   * Adiciona uma transação à lista (otimizado)
   * @param {Object} transaction - Transação a ser adicionada
   */
  addTransactionToList(transaction) {
    if (!this.elements.transactionsList) return;

    // Se a lista está vazia, mostra o primeiro item
    const emptyState = this.elements.transactionsList.querySelector('.empty-state');
    if (emptyState) {
      emptyState.remove();
    }

    // Cria o card da nova transação
    const newCard = this.createTransactionCard(transaction);

    // Adiciona no início da lista para mostrar as mais recentes primeiro
    this.elements.transactionsList.insertAdjacentHTML('afterbegin', newCard);

    // Anima a entrada do novo item
    const addedElement = this.elements.transactionsList.firstElementChild;
    if (addedElement) {
      addedElement.style.opacity = '0';
      addedElement.style.transform = 'translateY(-10px)';

      requestAnimationFrame(() => {
        addedElement.style.transition = 'all 0.3s ease';
        addedElement.style.opacity = '1';
        addedElement.style.transform = 'translateY(0)';
      });
    }

    console.log('✅ Transação adicionada à lista:', transaction);
  }

  /**
   * Atualiza uma transação na lista (otimizado)
   * @param {Object} transaction - Transação atualizada
   */
  updateTransactionInList(transaction) {
    if (!this.elements.transactionsList) return;

    const existingCard = this.elements.transactionsList.querySelector(`[data-id="${transaction.id}"]`);
    if (existingCard) {
      // Substitui o card existente
      const newCard = this.createTransactionCard(transaction);
      existingCard.outerHTML = newCard;

      // Anima a atualização
      const updatedElement = this.elements.transactionsList.querySelector(`[data-id="${transaction.id}"]`);
      if (updatedElement) {
        updatedElement.style.backgroundColor = '#e6fffa';
        setTimeout(() => {
          updatedElement.style.transition = 'background-color 0.5s ease';
          updatedElement.style.backgroundColor = '';
        }, 100);
      }
    }

    console.log('✅ Transação atualizada na lista:', transaction);
  }

  /**
   * Remove uma transação da lista (otimizado)
   * @param {string|number} id - ID da transação
   */
  removeTransactionFromList(id) {
    if (!this.elements.transactionsList) return;

    const cardToRemove = this.elements.transactionsList.querySelector(`[data-id="${id}"]`);
    if (cardToRemove) {
      // Anima a remoção
      cardToRemove.style.transition = 'all 0.3s ease';
      cardToRemove.style.opacity = '0';
      cardToRemove.style.transform = 'translateX(-100%)';

      setTimeout(() => {
        cardToRemove.remove();

        // Se não há mais transações, mostra estado vazio
        if (this.elements.transactionsList.children.length === 0) {
          this.showEmptyState();
        }
      }, 300);
    }

    console.log('✅ Transação removida da lista:', id);
  }

  /**
   * Limpa o formulário
   */
  clearForm() {
    if (this.elements.transactionForm) {
      this.elements.transactionForm.reset();
    }
  }

  /**
   * Mostra estado de loading
   * @param {boolean} show - Se deve mostrar o loading
   */
  showLoading(show) {
    console.log('Loading:', show);
  }

  /**
   * Mostra mensagem de sucesso
   * @param {string} message - Mensagem
   */
  showSuccess(message) {
    console.log('Sucesso:', message);
  }

  /**
   * Mostra mensagem de erro
   * @param {string} message - Mensagem
   */
  showError(message) {
    console.error('Erro:', message);
  }

  /**
   * Obtém dados do formulário
   * @returns {Object} Dados do formulário
   */
  getFormData() {
    const rawValue = this.elements.amountInput?.value?.trim() || '0';
    const parsedValue = parseFloat(rawValue);

    return {
      name: this.elements.nameInput?.value.trim() || '',
      value: isNaN(parsedValue) ? 0 : parsedValue
    };
  }

  /**
   * Formata valor monetário
   * @param {number} value - Valor a ser formatado
   * @returns {string} Valor formatado
   */
  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  /**
   * Atualiza contador de transações
   * @param {number} count - Número de transações
   */
  updateTransactionsCount(count) {
    if (this.elements.transactionsCount) {
      this.elements.transactionsCount.textContent = count;
    }
  }

  /**
   * Valida dados do formulário
   * @param {Object} data - Dados a serem validados
   * @returns {boolean} True se válido
   */
  validateFormData(data) {
    if (!data.name || data.name.length === 0) {
      this.showError('Por favor, preencha o nome da transação.');
      this.elements.nameInput?.focus();
      return false;
    }

    if (isNaN(data.value)) {
      this.showError('Por favor, preencha um valor numérico válido.');
      this.elements.amountInput?.focus();
      return false;
    }

    // Permite valor zero, mas avisa se for exatamente zero
    if (data.value === 0) {
      if (!confirm('Você tem certeza que deseja adicionar uma transação com valor zero?')) {
        this.elements.amountInput?.focus();
        return false;
      }
    }

    return true;
  }

  /**
   * Renderiza a lista de transações (otimizado)
   * @param {Array} transactions - Lista de transações
   */
  renderTransactions(transactions) {
    // Verifica se transactions é um array válido
    if (!Array.isArray(transactions) || transactions.length === 0) {
      this.showEmptyState();
      return;
    }

    // Para listas grandes (>50 itens), usa renderização por chunks
    if (transactions.length > 50) {
      this.renderTransactionsInChunks(transactions);
      return;
    }

    // Para listas pequenas, renderiza normalmente
    const transactionCards = transactions
      .map(transaction => this.createTransactionCard(transaction))
      .join('');

    this.elements.transactionsList.innerHTML = transactionCards;
  }

  /**
   * Renderiza transações em chunks para melhor performance
   * @param {Array} transactions - Lista de transações
   */
  renderTransactionsInChunks(transactions) {
    const CHUNK_SIZE = 20;
    let currentIndex = 0;

    // Limpa a lista
    this.elements.transactionsList.innerHTML = '';

    const renderChunk = () => {
      const chunk = transactions.slice(currentIndex, currentIndex + CHUNK_SIZE);

      if (chunk.length === 0) return;

      const chunkHTML = chunk
        .map(transaction => this.createTransactionCard(transaction))
        .join('');

      this.elements.transactionsList.insertAdjacentHTML('beforeend', chunkHTML);

      currentIndex += CHUNK_SIZE;

      // Se há mais transações, agenda o próximo chunk
      if (currentIndex < transactions.length) {
        requestAnimationFrame(renderChunk);
      }
    };

    // Inicia a renderização
    renderChunk();
  }

  /**
   * Cria um card de transação
   * @param {Object} transaction - Dados da transação
   * @returns {string} HTML do card
   */
  createTransactionCard(transaction) {
    const valueData = Formatter.formatTransactionValue(transaction.value);
    const sanitizedName = Formatter.sanitizeString(transaction.name);

    return `
      <div class="transaction-card ${valueData.typeClass}" data-id="${transaction.id}">
        <div class="transaction-header">
          <span class="transaction-name">${sanitizedName}</span>
          <span class="transaction-value ${valueData.typeClass}">
            ${valueData.displayValue}
          </span>
        </div>
        <div class="transaction-actions">
          <button class="edit-btn" data-id="${transaction.id}" data-action="edit">
            ✏️ Editar
          </button>
          <button class="delete-btn" data-id="${transaction.id}" data-action="delete">
            🗑️ Excluir
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Atualiza o saldo total na interface
   * @param {number|Array} balance - Saldo total ou lista de transações
   */
  updateBalance(balance) {
    let total;

    // Se for um array de transações, calcula o total
    if (Array.isArray(balance)) {
      total = balance.reduce((sum, transaction) => {
        return sum + transaction.value;
      }, 0);
    } else {
      // Se for um número, usa diretamente
      total = typeof balance === 'number' ? balance : 0;
    }

    const balanceData = Formatter.formatBalance(total);

    if (this.elements.balanceAmount) {
      this.elements.balanceAmount.textContent = balanceData.displayValue;

      if (balanceData.cssClass) {
        this.elements.balanceAmount.classList.add(balanceData.cssClass);
      } else {
        this.elements.balanceAmount.classList.remove('negative');
      }
    }
  }

  /**
   * Prepara a interface para edição
   * @param {Object} transaction - Dados da transação a ser editada
   */
  enterEditMode(transaction) {
    this.elements.nameInput.value = transaction.name;
    this.elements.amountInput.value = transaction.value;

    this.isEditing = true;
    this.editingTransactionId = transaction.id;

    this.elements.submitBtn.textContent = 'Atualizar Transação';
    this.elements.cancelBtn.style.display = 'inline-block';

    // Scroll para o formulário
    this.elements.transactionForm.scrollIntoView({
      behavior: 'smooth'
    });
  }

  /**
   * Cancela a edição e volta ao modo de criação
   */
  cancelEdit() {
    this.resetForm();
    this.callbacks.onCancelEdit?.();
  }

  /**
   * Reseta o formulário para o estado inicial
   */
  resetForm() {
    this.elements.transactionForm.reset();
    this.isEditing = false;
    this.editingTransactionId = null;
    this.elements.submitBtn.textContent = 'Adicionar Transação';
    this.elements.cancelBtn.style.display = 'none';
  }

  /**
   * Mostra estado de carregamento
   */
  showLoading() {
    this.elements.transactionsList.innerHTML = `
      <div class="loading">
        <p>⏳ Carregando transações...</p>
      </div>
    `;
  }

  /**
   * Mostra estado vazio
   */
  showEmptyState() {
    this.elements.transactionsList.innerHTML = `
      <div class="empty-state">
        <p>📝 Nenhuma transação encontrada</p>
        <p>Adicione sua primeira transação usando o formulário ao lado!</p>
      </div>
    `;
  }

  /**
   * Mostra mensagem de erro
   * @param {string} message - Mensagem de erro
   */
  showError(message) {
    this.elements.transactionsList.innerHTML = `
      <div class="empty-state">
        <p>❌ ${message}</p>
        <button onclick="location.reload()" style="margin-top: 10px;">
          🔄 Tentar Novamente
        </button>
      </div>
    `;
  }

  /**
   * Mostra alerta para o usuário
   * @param {string} message - Mensagem do alerta
   */
  showAlert(message) {
    alert(message);
  }

  /**
   * Mostra confirmação para o usuário
   * @param {string} message - Mensagem de confirmação
   * @returns {boolean} Resultado da confirmação
   */
  showConfirm(message) {
    return confirm(message);
  }

  /**
   * Mostra notificação de sucesso
   * @param {string} message - Mensagem de sucesso
   */
  showSuccess(message) {
    // Implementação simples com console, pode ser melhorada com toast
    console.log('✅ Sucesso:', message);
  }

  /**
   * Foca no primeiro campo do formulário
   */
  focusFirstField() {
    this.elements.nameInput.focus();
  }

  /**
   * Verifica se está no modo de edição
   * @returns {boolean} True se está editando
   */
  isInEditMode() {
    return this.isEditing;
  }

  /**
   * Obtém o ID da transação sendo editada
   * @returns {string|null} ID da transação ou null
   */
  getEditingTransactionId() {
    return this.editingTransactionId;
  }

  /**
   * Função debounce para otimizar atualizações
   * @param {Function} func - Função a ser executada
   * @param {number} wait - Tempo de espera em ms
   * @returns {Function} Função com debounce
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Atualiza contador de transações com cache
   * @param {number} count - Número de transações
   */
  updateTransactionsCountOptimized(count) {
    if (this.lastTransactionCount === count) return; // Skip se não mudou

    this.lastTransactionCount = count;
    this.updateCountDebounced(count);
  }

  /**
   * Atualiza saldo com otimização
   * @param {number} balance - Saldo atual
   */
  updateBalanceOptimized(balance) {
    if (this.lastBalance === balance) return; // Skip se não mudou

    this.lastBalance = balance;
    this.updateBalanceDebounced(balance);
  }

  /**
   * Limpa cache quando necessário
   */
  clearCache() {
    this.transactionCache.clear();
    this.lastUpdateTime = 0;
    this.lastTransactionCount = undefined;
    this.lastBalance = undefined;
  }
} 