/**
 * Renderizador da aplicação - responsável por renderizar a estrutura HTML base
 */
export class AppRenderer {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Renderiza a estrutura base da aplicação
   * @param {HTMLElement} container - Container onde renderizar
   */
  async render(container) {
    container.innerHTML = this.getAppHTML();
  }

  /**
   * Retorna o HTML base da aplicação
   * @returns {string} HTML da aplicação
   */
  getAppHTML() {
    return `
      <div class="finance-app">
        <header class="app-header">
          <h1 class="app-title">💰 Finanças Pessoais</h1>
          <div class="app-version">v3.0</div>
        </header>

        <main class="app-main">
          <section class="balance-section">
            <div class="balance-card">
              <h2 class="balance-title">Saldo Total</h2>
              <div class="balance-amount" id="balance">R$ 0,00</div>
            </div>
          </section>

          <section class="form-section">
            <div class="form-card">
              <h2 class="form-title">Nova Transação</h2>
              <form id="transaction-form" class="transaction-form">
                <div class="form-group">
                  <label for="name" class="form-label">Nome</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    class="form-input" 
                    placeholder="Ex: Salário, Mercado..."
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="value" class="form-label">Valor</label>
                  <input 
                    type="number" 
                    id="value" 
                    name="value" 
                    class="form-input" 
                    placeholder="Ex: 1500 ou -350"
                    step="0.01"
                    required
                  />
                </div>
                
                <div class="form-actions">
                  <button type="submit" class="btn btn-primary" id="submit-btn">
                    <span class="btn-text">Adicionar</span>
                    <span class="btn-loading" style="display: none;">Carregando...</span>
                  </button>
                  <button type="button" class="btn btn-secondary" id="cancel-btn" style="display: none;">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </section>

          <section class="transactions-section">
            <div class="transactions-card">
              <div class="transactions-header">
                <h2 class="transactions-title">Transações</h2>
                <div class="transactions-count">
                  <span id="transactions-count">0</span> transações
                </div>
              </div>
              
              <div class="transactions-list" id="transactions-list">
                <div class="transactions-empty" id="transactions-empty">
                  <div class="empty-icon">📝</div>
                  <div class="empty-text">Nenhuma transação encontrada</div>
                  <div class="empty-subtext">Adicione sua primeira transação acima</div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <!-- Modais e overlays -->
        <div class="app-overlay" id="app-overlay" style="display: none;"></div>
        
        <!-- Loading overlay -->
        <div class="loading-overlay" id="loading-overlay" style="display: none;">
          <div class="loading-spinner"></div>
          <div class="loading-text">Carregando...</div>
        </div>

        <!-- Notifications -->
        <div class="notifications-container" id="notifications-container"></div>
      </div>
    `;
  }
} 