# 💰 Finanças Pessoais - Sistema Moderno

[![Netlify Status](https://api.netlify.com/api/v1/badges/financaspessoaisv3/deploy-status)](https://app.netlify.com/sites/financaspessoaisv3/deploys)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![Webpack](https://img.shields.io/badge/Webpack-5.0+-8DD6F9?logo=webpack)](https://webpack.js.org/)
[![Deploy](https://img.shields.io/badge/Deploy-Netlify-00C7B7?logo=netlify)](https://financaspessoaisv3.netlify.app)

> Aplicação moderna de controle financeiro pessoal construída com **Webpack**, **Babel** e **ES6 Modules**

## 🚀 **Demo ao Vivo**

### 🌐 **Acesse a Aplicação:**

**👉 [https://financaspessoaisv3.netlify.app](https://financaspessoaisv3.netlify.app)**

### 📱 **Funcionalidades Online:**

- ✅ **CRUD Completo** - Adicionar, editar e excluir transações
- 💾 **Persistência** - Dados salvos no localStorage do navegador
- 🎨 **Interface Moderna** - Design responsivo e elegante
- ⚡ **Performance** - Carregamento rápido e otimizado
- 🔒 **Seguro** - HTTPS e headers de segurança configurados

## 🎯 **Funcionalidades**

- ✅ **CRUD Completo** - Criar, editar, excluir e listar transações
- 💾 **Persistência Local** - Dados salvos no localStorage
- 🌐 **Deploy Automático** - Integração com Netlify
- 📱 **Interface Responsiva** - Funciona em desktop e mobile
- ⚡ **Performance Otimizada** - Build otimizado com Webpack
- 🎨 **Design Moderno** - Interface limpa e intuitiva
- ⌨️ **Atalhos de Teclado** - Ctrl+N para nova transação, Esc para cancelar

## 🛠️ **Tecnologias Utilizadas**

- **Frontend:** JavaScript ES6+, CSS3, HTML5
- **Build Tool:** Webpack 5 + Babel
- **Bundling:** Module Federation, Code Splitting
- **Styling:** CSS3 com design moderno
- **Deploy:** Netlify com CI/CD automático
- **Persistência:** localStorage (sem necessidade de servidor)

## 📦 **Instalação e Uso**

### **Pré-requisitos**

- Node.js 18+
- npm ou yarn

### **Desenvolvimento Local**

```bash
# Clone o repositório
git clone https://github.com/77mdias/financas-pessoais-v3.git

# Instale as dependências
npm install

# Desenvolvimento com Webpack
npm run dev:webpack

# Build para produção
npm run build
```

### **Deploy**

O projeto está configurado para deploy automático no Netlify:

```bash
# Fazer alterações e commit
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# Deploy automático será executado!
```

## 🌐 **Deploy e Hospedagem**

### **Netlify (Atual)**

- 🚀 **URL:** [https://financaspessoaisv3.netlify.app](https://financaspessoaisv3.netlify.app)
- ⚡ **Deploy Automático:** A cada push na branch `main`
- 🔒 **HTTPS:** Certificado SSL gratuito
- 🌍 **CDN Global:** Carregamento rápido mundial

### **Configuração de Deploy**

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
```

## 📁 **Estrutura do Projeto**

```
├── 📁 public/              # Código fonte
│   ├── 📁 js/             # JavaScript principal
│   ├── 📁 css/            # Estilos CSS
│   └── 📄 index.html      # Template HTML
├── 📁 dist/               # Build de produção (gerado)
├── 📁 api/                # API Functions (opcional)
├── ⚙️ webpack.config.js   # Configuração Webpack
├── ⚙️ netlify.toml        # Configuração Netlify
└── 📄 package.json        # Dependências e scripts
```

## 🎮 **Scripts Disponíveis**

| Script                | Descrição                              |
| --------------------- | -------------------------------------- |
| `npm run build`       | Build para produção                    |
| `npm run dev:webpack` | Desenvolvimento com Webpack Dev Server |
| `npm run clean`       | Limpa pasta dist                       |

## 🎨 **Features da Interface**

- **Design Responsivo** - Adapta-se a qualquer tela
- **Saldo Destacado** - Visualização clara do saldo total
- **Cards Coloridos** - Receitas em verde, despesas em vermelho
- **Feedback Visual** - Animações e transições suaves
- **Validação de Formulários** - Validação em tempo real
- **Atalhos de Teclado** - Produtividade aprimorada

## 📱 **Compatibilidade**

- ✅ Chrome 90+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Browsers

## 🚀 **Performance**

- ⚡ **Lighthouse Score:** 95+ em todas as métricas
- 📦 **Bundle Size:** ~13.5 KiB (JS + CSS)
- 🎯 **First Paint:** < 1s
- 💾 **Offline Ready:** Funciona com localStorage

## 🤝 **Contribuindo**

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 **Autor**

Desenvolvido com ❤️ para aprendizado de JavaScript moderno e Webpack

---

⭐ **Se este projeto te ajudou, deixe uma estrela!**

🌐 **[Acesse a aplicação online](https://financaspessoaisv3.netlify.app)**
