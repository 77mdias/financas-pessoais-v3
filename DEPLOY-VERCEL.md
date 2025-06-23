# 🚀 Guia de Deploy no Vercel

Este guia explica como fazer o deploy da aplicação de finanças no Vercel.

## 📋 Pré-requisitos

1. **Conta no Vercel**: Criar conta em [vercel.com](https://vercel.com)
2. **GitHub**: Código deve estar em um repositório GitHub
3. **Node.js**: Versão 18+ instalada localmente

## 🔧 Configurações Realizadas

### 1. Dependências Movidas

Todas as dependências do webpack foram movidas para `dependencies` no `package.json` para que o Vercel possa instalá-las durante o build.

### 2. API Serverless Criada

- **Arquivo**: `api/transactions.js`
- **Funcionalidade**: Substitui o json-server com uma API serverless
- **Rotas**: GET, POST, PUT, DELETE para `/api/transactions`

### 3. TransactionService Atualizado

- **Auto-detecção**: Usa API local em desenvolvimento e serverless em produção
- **URLs**:
  - Desenvolvimento: `http://localhost:3001/transactions`
  - Produção: `/api/transactions`

### 4. Configuração Vercel

- **Arquivo**: `vercel.json`
- **Build**: Usa webpack para gerar build de produção
- **SPA**: Todas as rotas redirecionam para `index.html`

## 🚀 Passos para Deploy

### Método 1: Via GitHub (Recomendado)

1. **Push do código para GitHub**:

   ```bash
   git add .
   git commit -m "Preparado para deploy no Vercel"
   git push origin main
   ```

2. **Conectar ao Vercel**:

   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Conecte sua conta GitHub
   - Selecione o repositório

3. **Configurações no Vercel**:

   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Deploy**:
   - Clique em "Deploy"
   - Aguarde o build completar

### Método 2: Via Vercel CLI

1. **Instalar Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login**:

   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   # Na pasta do projeto
   vercel --prod
   ```

## 🔍 Verificações Pós-Deploy

### 1. Testar a Aplicação

- [ ] Página carrega corretamente
- [ ] Transações existentes aparecem
- [ ] Formulário funciona (adicionar transação)
- [ ] Edição de transações funciona
- [ ] Exclusão de transações funciona
- [ ] Saldo é calculado corretamente

### 2. Testar API Serverless

```bash
# Testar GET
curl https://seu-app.vercel.app/api/transactions

# Testar POST
curl -X POST https://seu-app.vercel.app/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","amount":100}'
```

## 🐛 Solução de Problemas

### Build Falha

**Erro**: Dependencies não encontradas
**Solução**: Verificar se todas as deps estão em `dependencies`, não `devDependencies`

```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### API não Funciona

**Erro**: 404 em /api/transactions
**Solução**: Verificar se o arquivo `api/transactions.js` está no repositório

### Webpack Errors

**Erro**: Module not found
**Solução**: Verificar imports e aliases no webpack.config.js

### CORS Issues

**Erro**: Blocked by CORS policy
**Solução**: A API serverless já inclui headers CORS

## 📱 Recursos Adicionais

### Custom Domain

1. No dashboard do Vercel
2. Project Settings > Domains
3. Adicionar domínio personalizado

### Environment Variables

1. Project Settings > Environment Variables
2. Adicionar variáveis necessárias

### Analytics

1. Project Settings > Analytics
2. Habilitar Web Analytics

## 🔄 Atualizações

Para atualizar a aplicação:

1. Fazer push para GitHub
2. Vercel fará deploy automático
3. Verificar na dashboard do Vercel

## 📞 Suporte

Se houver problemas:

1. Verificar logs no dashboard do Vercel
2. Consultar a [documentação oficial](https://vercel.com/docs)
3. Usar o comando `vercel logs` para debug

---

## 🎯 URLs Importantes

- **Dashboard**: https://vercel.com/dashboard
- **Documentação**: https://vercel.com/docs
- **Status**: https://vercel.com/status
- **Community**: https://github.com/vercel/vercel/discussions
