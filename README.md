# 💰 Finanças Pessoais - Sistema Moderno

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![Webpack](https://img.shields.io/badge/Webpack-5.0+-8DD6F9?logo=webpack)](https://webpack.js.org/)

> Aplicação moderna de controle financeiro pessoal construída com **Webpack**, **Babel** e **ES6 Modules**

## 🎯 **Funcionalidades**

- ✅ **CRUD Completo** - Criar, editar, excluir e listar transações
- 💾 **Persistência Local** - Dados salvos no localStorage
- 🌐 **API REST** - Integração com backend
- 📱 **Interface Responsiva** - Funciona em desktop e mobile
- ⚡ **Performance Otimizada** - Build otimizado com Webpack
- 🎨 **Design Moderno** - Interface limpa e intuitiva
- ⌨️ **Atalhos de Teclado** - Ctrl+N para nova transação, Esc para cancelar

## 🚀 **Demo ao Vivo**

## 🛠️ **Tecnologias Utilizadas**

- **Frontend:** JavaScript ES6+, CSS3, HTML5
- **Build Tool:** Webpack 5 + Babel
- **Bundling:** Module Federation, Code Splitting
- **Styling:** SCSS, PostCSS
- **Backend:** Node.js API
- **Deploy:** Configurável

## 📦 **Instalação e Uso**

### **Pré-requisitos**

- Node.js 16+
- npm ou yarn

### **Desenvolvimento Local**

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/financas-pessoais-v3.git

# Instale as dependências
npm install

# Desenvolvimento (Webpack + API)
npm run dev

# Apenas Webpack Dev Server
npm run dev:webpack

# Apenas API (json-server)
npm run dev:api
```

### **Build e Deploy**

```bash
# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📁 **Estrutura do Projeto**

```
├── 📁 src/                  # Código fonte
│   ├── 📁 app/             # Aplicação principal
│   ├── 📁 components/      # Componentes reutilizáveis
│   ├── 📁 config/          # Configurações
│   ├── 📁 managers/        # Gerenciadores de estado
│   ├── 📁 services/        # Serviços (API, Storage)
│   ├── 📁 styles/          # Estilos SCSS
│   ├── 📁 ui/              # Interface do usuário
│   └── 📁 utils/           # Utilitários
├── 📁 api/                 # API Functions
├── 📁 public/              # Arquivos estáticos (dev)
├── 📁 dist/                # Build de produção
├── ⚙️ webpack.config.js    # Configuração Webpack

└── 📄 package.json         # Dependências e scripts
```

## 🎮 **Scripts Disponíveis**

| Script                | Descrição                                       |
| --------------------- | ----------------------------------------------- |
| `npm run dev`         | Inicia desenvolvimento completo (Webpack + API) |
| `npm run dev:webpack` | Apenas Webpack Dev Server                       |
| `npm run dev:api`     | Apenas json-server (API local)                  |
| `npm run build`       | Build para produção                             |
| `npm run clean`       | Limpa pasta dist                                |
| `npm test`            | Executa testes (futuro)                         |

## 🌐 **API Endpoints**

| Método   | Endpoint                    | Descrição                 |
| -------- | --------------------------- | ------------------------- |
| `GET`    | `/api/transactions`         | Lista todas as transações |
| `POST`   | `/api/transactions`         | Cria nova transação       |
| `PUT`    | `/api/transactions?id={id}` | Atualiza transação        |
| `DELETE` | `/api/transactions?id={id}` | Exclui transação          |

## 🎨 **Features da Interface**

- **Design Responsivo** - Adapta-se a qualquer tela
- **Feedback Visual** - Animações e transições suaves
- **Validação de Formulários** - Validação em tempo real
- **Estados de Carregamento** - Indicadores visuais
- **Tratamento de Erros** - Mensagens amigáveis
- **Modo Escuro** - Suporte futuro

## 🔧 **Configuração Avançada**

### **Variáveis de Ambiente**

```bash
# .env.local (opcional)
NODE_ENV=development
API_URL=http://localhost:3001
```

### **Webpack Personalizado**

O projeto usa uma configuração Webpack otimizada com:

- **Code Splitting** - Divisão automática de código
- **Tree Shaking** - Remoção de código não utilizado
- **Minificação** - Compressão para produção
- **Source Maps** - Debug em desenvolvimento

## 📱 **Compatibilidade**

- ✅ Chrome 90+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Browsers

## 🤝 **Contribuindo**

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 **Autor**

Desenvolvido com ❤️ por **Seu Nome**

---

⭐ **Se este projeto te ajudou, deixe uma estrela!**
