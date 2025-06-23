# 🚀 Guia de Deploy - Finanças Pessoais

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no GitHub (já configurada ✅)
- Repositório já está no GitHub ✅

## 🎯 Opção 1: Deploy no Netlify (RECOMENDADO)

### ✅ Vantagens do Netlify:

- 🆓 **Gratuito** para projetos pessoais
- 🔄 **Deploy automático** a cada push no GitHub
- 🌐 **HTTPS gratuito** e CDN global
- ⚡ **Build automático** com Webpack
- 📱 **Otimizado** para aplicações modernas

### 🔧 Passos para Deploy:

1. **Acesse o Netlify:**

   ```
   https://netlify.com
   ```

2. **Conecte o GitHub:**

   - Clique em "New site from Git"
   - Escolha "GitHub"
   - Selecione o repositório: `financas-pessoais-v3`

3. **Configuração de Build:**

   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Deploy Automático:**
   - Netlify detectará automaticamente o `netlify.toml`
   - Build será executado automaticamente
   - Site estará online em poucos minutos!

### 🌐 Resultado:

Sua aplicação estará disponível em:

```
https://seu-site-name.netlify.app
```

---

## 🎯 Opção 2: GitHub Pages

### 🔧 Configuração:

1. **Ative o GitHub Pages:**

   - Vá para Settings do repositório
   - Seção "Pages"
   - Source: "Deploy from a branch"
   - Branch: `main` / Folder: `/ (root)`

2. **Crie um workflow de build:**
   ```yaml
   # .github/workflows/deploy.yml
   name: Build and Deploy
   on:
     push:
       branches: [main]
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: "18"
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

---

## 🎯 Opção 3: Surge.sh (Deploy Rápido)

### 🔧 Comandos:

```bash
# Instalar Surge globalmente
npm install -g surge

# Fazer build
npm run build

# Deploy
cd dist
surge --domain financas-pessoais-v3.surge.sh
```

---

## 🛠️ Comandos Úteis

### Build Local:

```bash
npm run build          # Build de produção
npm run dev:webpack    # Desenvolvimento local
```

### Verificar Build:

```bash
# Servir arquivos da pasta dist localmente
cd dist
python -m http.server 8080
# Acesse: http://localhost:8080
```

---

## 📊 Funcionalidades da Aplicação

✅ **CRUD Completo:**

- Adicionar transações (receitas/despesas)
- Editar transações existentes
- Excluir transações
- Visualizar saldo em tempo real

✅ **Persistência:**

- Dados salvos no localStorage
- Não precisa de servidor/banco de dados
- Funciona 100% no frontend

✅ **Interface Moderna:**

- Design responsivo
- Gradientes e animações
- Atalhos de teclado
- Feedback visual

---

## 🔧 Troubleshooting

### Problema: Build falha

**Solução:**

```bash
rm -rf node_modules
npm install
npm run build
```

### Problema: Site não carrega

**Verificar:**

- Arquivos estão na pasta `dist`
- `index.html` existe
- Console do navegador para erros

---

## 🎉 Próximos Passos

Após o deploy:

1. ✅ Testar todas as funcionalidades
2. ✅ Compartilhar o link
3. ✅ Configurar domínio personalizado (opcional)
4. ✅ Monitorar performance

**🚀 Sua aplicação estará online e funcionando perfeitamente!**
