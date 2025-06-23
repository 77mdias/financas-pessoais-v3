# 📖 GUIA PRÁTICO - Aplicação de Finanças Pessoais

Este guia vai te ajudar a usar a aplicação de finanças pessoais de forma eficiente e aproveitar todos os recursos disponíveis.

## 🚀 Primeiros Passos

### 1. Preparando o Ambiente

**Passo 1: Verificar se o Node.js está instalado**

```bash
node --version
npm --version
```

**Passo 2: Navegar até a pasta do projeto**

```bash
cd "12 exercicio sistema de requisicao"
```

**Passo 3: Instalar dependências (se necessário)**

```bash
npm install
```

**Passo 4: Iniciar o servidor backend**

```bash
npm run json-server
```

**Passo 5: Abrir a aplicação**

- Abra o arquivo `index.html` no navegador
- Ou use a extensão Live Server no VS Code

## 💡 Compreendendo a Interface

### Cabeçalho

- **Título**: "💰 Finanças Pessoais"
- **Saldo Total**: Mostra seu saldo atual
  - Verde: Saldo positivo
  - Vermelho: Saldo negativo

### Seção de Formulário (Esquerda)

- **Nome da Transação**: Descrição da entrada/saída
- **Valor**: Montante da transação
- **Botões**: Adicionar/Atualizar e Cancelar

### Seção de Transações (Direita)

- Lista todas as transações
- Cada transação tem botões de Editar e Excluir

## 📝 Como Usar - Passo a Passo

### ➕ Adicionando uma Nova Transação

**Para Receitas (Dinheiro que entra):**

1. No campo "Nome da Transação", digite: `Salário`
2. No campo "Valor", digite: `5000`
3. Clique em "Adicionar Transação"

**Para Despesas (Dinheiro que sai):**

1. No campo "Nome da Transação", digite: `Supermercado`
2. No campo "Valor", digite: `-350`
3. Clique em "Adicionar Transação"

**Dicas importantes:**

- Use valores positivos para receitas
- Use valores negativos para despesas
- O saldo é calculado automaticamente

### ✏️ Editando uma Transação

1. Clique no botão "✏️ Editar" na transação desejada
2. Os dados aparecerão no formulário
3. Modifique os campos necessários
4. Clique em "Atualizar Transação"
5. Ou clique em "Cancelar Edição" para desistir

### 🗑️ Excluindo uma Transação

1. Clique no botão "🗑️ Excluir" na transação desejada
2. Confirme a exclusão no popup
3. A transação será removida e o saldo atualizado

## 💰 Exemplos Práticos

### Exemplo 1: Configuração Inicial de Orçamento Mensal

**Receitas:**

- Salário: R$ 4.500,00
- Freelance: R$ 800,00
- Rendimentos: R$ 120,00

**Despesas Fixas:**

- Aluguel: -R$ 1.200,00
- Energia: -R$ 180,00
- Internet: -R$ 99,00
- Seguro: -R$ 250,00

**Despesas Variáveis:**

- Supermercado: -R$ 400,00
- Combustível: -R$ 300,00
- Lazer: -R$ 200,00

### Exemplo 2: Controle Diário

**Segunda-feira:**

- Café da manhã: -R$ 15,00
- Almoço: -R$ 25,00
- Transporte: -R$ 8,00

**Terça-feira:**

- Venda produto: R$ 150,00
- Farmácia: -R$ 35,00
- Uber: -R$ 18,00

## 🎯 Dicas de Organização

### 📊 Categorização Sugerida

**Receitas:**

- Salário
- Freelance
- Vendas
- Investimentos
- Outros rendimentos

**Despesas Fixas:**

- Aluguel/Financiamento
- Contas (água, luz, telefone)
- Seguros
- Mensalidades
- Empréstimos

**Despesas Variáveis:**

- Alimentação
- Transporte
- Lazer
- Roupas
- Saúde
- Educação

### 💡 Boas Práticas

1. **Seja Específico**: Use nomes descritivos

   - ✅ "Almoço - Restaurante Central"
   - ❌ "Comida"

2. **Registre Imediatamente**: Anote as transações assim que ocorrem

3. **Categorize Consistentemente**: Use sempre os mesmos padrões

4. **Revise Regularmente**: Analise seu saldo e transações periodicamente

## 🔍 Interpretando os Dados

### Cores e Significados

**Verde (Receitas):**

- Valores positivos
- Dinheiro que entra
- Aumenta o saldo

**Vermelho (Despesas):**

- Valores negativos
- Dinheiro que sai
- Diminui o saldo

### Saldo Total

**Saldo Positivo (Verde):**

- Você tem mais receitas que despesas
- Situação financeira favorável

**Saldo Negativo (Vermelho):**

- Você tem mais despesas que receitas
- Atenção necessária aos gastos

## 🛠️ Solução de Problemas

### Problema: "Erro ao carregar transações"

**Solução:**

1. Verifique se o json-server está rodando
2. Confirme se a porta 3001 está livre
3. Reinicie o servidor: `npm run json-server`

### Problema: Transação não aparece

**Solução:**

1. Verifique se todos os campos foram preenchidos
2. Confirme se o valor é um número válido
3. Recarregue a página

### Problema: Não consegue editar

**Solução:**

1. Clique em "Cancelar Edição" e tente novamente
2. Recarregue a página se necessário

## 📱 Usando no Celular

A aplicação é totalmente responsiva:

1. **Layout Adaptativo**: Se ajusta automaticamente
2. **Botões Grandes**: Fáceis de tocar
3. **Formulário Otimizado**: Teclado numérico para valores
4. **Scroll Suave**: Navegação fluida

## 🎓 Exercícios Práticos

### Exercício 1: Orçamento Básico

1. Adicione seu salário mensal
2. Adicione suas 5 principais despesas
3. Observe o saldo resultante

### Exercício 2: Controle Semanal

1. Registre todas as transações de uma semana
2. Analise onde você mais gasta
3. Identifique oportunidades de economia

### Exercício 3: Planejamento

1. Crie um orçamento projetado para o próximo mês
2. Compare com o real durante o mês
3. Ajuste conforme necessário

## 🔄 Workflow Recomendado

### Diário

- [ ] Registrar todas as transações do dia
- [ ] Verificar o saldo atual

### Semanal

- [ ] Revisar todas as transações da semana
- [ ] Identificar padrões de gasto
- [ ] Ajustar comportamentos se necessário

### Mensal

- [ ] Analisar o saldo do mês
- [ ] Comparar com meses anteriores
- [ ] Planejar o próximo mês

## 📈 Próximos Passos

Depois de dominar o básico, você pode:

1. **Exportar Dados**: Copiar informações do navegador
2. **Fazer Backup**: Salvar o arquivo db.json
3. **Personalizar**: Modificar cores e estilos no CSS
4. **Expandir**: Adicionar novas funcionalidades

---

## 🆘 Suporte

Se precisar de ajuda:

1. Consulte este guia
2. Verifique o README.md
3. Analise o código nos arquivos do projeto
4. Teste em um navegador diferente

**Lembre-se:** A disciplina no registro das transações é fundamental para o sucesso do controle financeiro! 💪

---

_Última atualização: Dezembro 2024_
