// API para transações - Node.js

// Dados iniciais que serão usados como fallback
const initialTransactions = [
  { id: 1, name: "Salário", value: 5000 },
  { id: 2, name: "Mercado", value: -350 },
  { id: 3, name: "Freelance", value: 1200 },
  { id: 4, name: "Salário", value: 2694 },
  { id: 5, name: "Salário", value: 2549 }
];

export default function handler(req, res) {
  // Configuração CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Resposta para preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { method, query, body } = req;

    console.log(`🔍 API Request: ${method} ${req.url}`);

    switch (method) {
      case 'GET':
        // Retorna as transações iniciais
        console.log('📊 Retornando transações iniciais');
        res.status(200).json(initialTransactions);
        break;

      case 'POST':
        try {
          console.log('📝 Criando transação:', body);

          // Valida os dados
          if (!body.name || body.value === undefined) {
            res.status(400).json({
              error: 'Nome e valor são obrigatórios',
              details: 'Por favor, preencha todos os campos'
            });
            return;
          }

          // Cria nova transação
          const newTransaction = {
            id: Date.now(),
            name: String(body.name).trim(),
            value: parseFloat(body.value)
          };

          console.log('✅ Transação criada:', newTransaction);
          res.status(201).json(newTransaction);
        } catch (error) {
          console.error('❌ Erro ao processar POST:', error);
          res.status(400).json({
            error: 'Dados inválidos',
            details: 'Verifique o formato dos dados enviados'
          });
        }
        break;

      case 'PUT':
        try {
          const id = query.id || body.id;
          console.log('✏️ Atualizando transação:', id, body);

          // Valida os dados
          if (!body.name || body.value === undefined || !id) {
            res.status(400).json({
              error: 'ID, nome e valor são obrigatórios',
              details: 'Por favor, preencha todos os campos'
            });
            return;
          }

          // Atualiza transação
          const updatedTransaction = {
            id: parseInt(id),
            name: String(body.name).trim(),
            value: parseFloat(body.value)
          };

          console.log('✅ Transação atualizada:', updatedTransaction);
          res.status(200).json(updatedTransaction);
        } catch (error) {
          console.error('❌ Erro ao processar PUT:', error);
          res.status(400).json({
            error: 'Dados inválidos',
            details: 'Verifique o formato dos dados enviados'
          });
        }
        break;

      case 'DELETE':
        const deleteId = query.id;
        console.log('🗑️ Excluindo transação:', deleteId);

        if (!deleteId) {
          res.status(400).json({
            error: 'ID é obrigatório para exclusão',
            details: 'Informe o ID da transação a ser excluída'
          });
          return;
        }

        const deletedTransaction = {
          id: parseInt(deleteId),
          deleted: true,
          message: 'Transação excluída com sucesso'
        };

        console.log('✅ Transação excluída:', deletedTransaction);
        res.status(200).json(deletedTransaction);
        break;

      default:
        console.log('❌ Método não permitido:', method);
        res.status(405).json({
          error: `Método ${method} não permitido`,
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        });
    }
  } catch (error) {
    console.error('❌ Erro geral na API:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      details: 'Tente novamente em alguns instantes',
      timestamp: new Date().toISOString()
    });
  }
} 