const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexão com o MongoDB
mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Conectado ao MongoDB');
    app.listen(port, () => {
      console.log(`Servidor iniciado na porta ${port}`);
    });
  })
  .catch(error => {
    console.error('Erro ao conectar ao MongoDB:', error);
  });

// Definição do esquema do item
const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  lowQuantity: Number,
  category: String
});

// Modelo do item
const Item = mongoose.model('Item', itemSchema);

// Rota para obter todos os itens
app.get('/api/items', (req, res) => {
  Item.find()
    .then(items => {
      res.json(items);
    })
    .catch(error => {
      console.error('Erro ao obter itens:', error);
      res.status(500).json({ error: 'Erro ao obter itens' });
    });
});

// Rota para adicionar um novo item
app.post('/api/items', (req, res) => {
  const { name, quantity, category, lowQuantity } = req.body;

  const newItem = new Item({ name, quantity, category, lowQuantity });

  newItem.save()
    .then(item => {
      res.json(item);

      // Verificar se a quantidade está abaixo do limite
      if (item.quantity < item.lowQuantity) {
        // Adicionar o item à lista de itens com quantidade baixa
        lowQuantityItems.push(item);
      }
    })
    .catch(error => {
      console.error('Erro ao adicionar item:', error);
      res.status(500).json({ error: 'Erro ao adicionar item' });
    });
});

// Rota para atualizar um item
app.put('/api/items/:id', (req, res) => {
  const itemId = req.params.id;
  const { name, quantity, category, lowQuantity } = req.body;

  Item.findByIdAndUpdate(itemId, { name, quantity, category, lowQuantity })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(error => {
      console.error('Erro ao atualizar item:', error);
      res.status(500).json({ error: 'Erro ao atualizar item' });
    });
});

// Rota para obter um item específico
app.get('/api/items/:id', (req, res) => {
  const itemId = req.params.id;

  Item.findById(itemId)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        res.status(404).json({ error: 'Item não encontrado' });
      }
    })
    .catch(error => {
      console.error('Erro ao obter item para edição:', error);
      res.status(500).json({ error: 'Erro ao obter item para edição' });
    });
});

// Rota para excluir um item
app.delete('/api/items/:id', (req, res) => {
  const itemId = req.params.id;

  Item.findByIdAndRemove(itemId)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(error => {
      console.error('Erro ao excluir item:', error);
      res.status(500).json({ error: 'Erro ao excluir item' });
    });
});

// Rota para filtrar itens por categoria
app.get('/api/items/category/:category', (req, res) => {
  const category = req.params.category;

  Item.find({ category })
    .then(items => {
      res.json(items);
    })
    .catch(error => {
      console.error('Erro ao filtrar itens por categoria:', error);
      res.status(500).json({ error: 'Erro ao filtrar itens por categoria' });
    });
});

// Rota para filtrar itens por nome
app.get('/api/items/name/:name', (req, res) => {
  const name = req.params.name;

  Item.find({ name: { $regex: name, $options: 'i' } })
    .then(items => {
      res.json(items);
    })
    .catch(error => {
      console.error('Erro ao filtrar itens por nome:', error);
      res.status(500).json({ error: 'Erro ao filtrar itens por nome' });
    });
});

// Rota para filtrar itens por quantidade
app.get('/api/items/quantity/:quantity', (req, res) => {
  const quantity = parseInt(req.params.quantity);

  Item.find({ quantity })
    .then(items => {
      res.json(items);
    })
    .catch(error => {
      console.error('Erro ao filtrar itens por quantidade:', error);
      res.status(500).json({ error: 'Erro ao filtrar itens por quantidade' });
    });
});

// Variável para armazenar itens com quantidade baixa
const lowQuantityItems = [];

// Rota para obter itens com quantidade baixa
app.get('/api/items/low-quantity', (req, res) => {
  res.json(lowQuantityItems);
});

// Rota para atualizar a lista de itens com quantidade baixa
app.put('/api/items/low-quantity', (req, res) => {
  const updatedItems = req.body;

  lowQuantityItems.length = 0;
  lowQuantityItems.push(...updatedItems);

  res.sendStatus(200);
});

// Rota para remover um item da lista de itens com quantidade baixa
app.delete('/api/items/low-quantity/:id', (req, res) => {
  const itemId = req.params.id;

  const index = lowQuantityItems.findIndex(item => item._id.toString() === itemId);
  if (index !== -1) {
    lowQuantityItems.splice(index, 1);
    res.sendStatus(200);
  } else {
    res.status(404).json({ error: 'Item não encontrado na lista de itens com quantidade baixa' });
  }
});

// Rota para limpar a lista de itens com quantidade baixa
app.delete('/api/items/low-quantity', (req, res) => {
  lowQuantityItems.length = 0;
  res.sendStatus(200);
});

// Rota para marcar um item como atendido na lista de itens com quantidade baixa
app.put('/api/items/low-quantity/fulfill/:id', (req, res) => {
  const itemId = req.params.id;

  const item = lowQuantityItems.find(item => item._id.toString() === itemId);
  if (item) {
    item.fulfilled = true;
    res.sendStatus(200);
  } else {
    res.status(404).json({ error: 'Item não encontrado na lista de itens com quantidade baixa' });
  }
});

// Rota para desmarcar um item como atendido na lista de itens com quantidade baixa
app.put('/api/items/low-quantity/unfulfill/:id', (req, res) => {
  const itemId = req.params.id;

  const item = lowQuantityItems.find(item => item._id.toString() === itemId);
  if (item) {
    item.fulfilled = false;
    res.sendStatus(200);
  } else {
    res.status(404).json({ error: 'Item não encontrado na lista de itens com quantidade baixa' });
  }
});

// Rota para obter o total de itens com quantidade baixa
app.get('/api/items/low-quantity/total', (req, res) => {
  const total = lowQuantityItems.length;
  res.json({ total });
});

// Rota para obter a lista de itens com quantidade baixa que estão atendidos
app.get('/api/items/low-quantity/fulfilled', (req, res) => {
  const fulfilledItems = lowQuantityItems.filter(item => item.fulfilled);
  res.json(fulfilledItems);
});

// Rota para obter a lista de itens com quantidade baixa que não estão atendidos
app.get('/api/items/low-quantity/unfulfilled', (req, res) => {
  const unfulfilledItems = lowQuantityItems.filter(item => !item.fulfilled);
  res.json(unfulfilledItems);
});

// Rota para marcar todos os itens como atendidos na lista de itens com quantidade baixa
app.put('/api/items/low-quantity/fulfill-all', (req, res) => {
  lowQuantityItems.forEach(item => {
    item.fulfilled = true;
  });
  res.sendStatus(200);
});

// Rota para desmarcar todos os itens como atendidos na lista de itens com quantidade baixa
app.put('/api/items/low-quantity/unfulfill-all', (req, res) => {
  lowQuantityItems.forEach(item => {
    item.fulfilled = false;
  });
  res.sendStatus(200);
});

// Rota para obter os itens com quantidade baixa que pertencem a uma determinada categoria
app.get('/api/items/low-quantity/category/:category', (req, res) => {
  const category = req.params.category;

  const categoryItems = lowQuantityItems.filter(item => item.category === category);
  res.json(categoryItems);
});

// Rota para obter os itens com quantidade baixa que possuem um determinado nome
app.get('/api/items/low-quantity/name/:name', (req, res) => {
  const name = req.params.name;

  const nameItems = lowQuantityItems.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
  res.json(nameItems);
});

// Rota para obter os itens com quantidade baixa que possuem uma quantidade menor ou igual a um valor específico
app.get('/api/items/low-quantity/quantity/:quantity', (req, res) => {
  const quantity = parseInt(req.params.quantity);

  const quantityItems = lowQuantityItems.filter(item => item.quantity <= quantity);
  res.json(quantityItems);
});

// Rota para filtrar os itens com quantidade baixa com base em várias opções
app.get('/api/items/low-quantity/filter', (req, res) => {
  const { category, name, quantity } = req.query;

  let filteredItems = lowQuantityItems;

  if (category) {
    filteredItems = filteredItems.filter(item => item.category === category);
  }

  if (name) {
    const lowercaseName = name.toLowerCase();
    filteredItems = filteredItems.filter(item => item.name.toLowerCase().includes(lowercaseName));
  }

  if (quantity) {
    const numericQuantity = parseInt(quantity);
    filteredItems = filteredItems.filter(item => item.quantity <= numericQuantity);
  }

  res.json(filteredItems);
});

// Rota para obter a quantidade de itens com quantidade baixa que pertencem a uma determinada categoria
app.get('/api/items/low-quantity/category/:category/total', (req, res) => {
  const category = req.params.category;

  const categoryItems = lowQuantityItems.filter(item => item.category === category);
  const total = categoryItems.length;
  res.json({ total });
});

// Rota para obter a quantidade de itens com quantidade baixa que possuem um determinado nome
app.get('/api/items/low-quantity/name/:name/total', (req, res) => {
  const name = req.params.name;

  const nameItems = lowQuantityItems.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
  const total = nameItems.length;
  res.json({ total });
});

// Rota para obter a quantidade de itens com quantidade baixa que possuem uma quantidade menor ou igual a um valor específico
app.get('/api/items/low-quantity/quantity/:quantity/total', (req, res) => {
  const quantity = parseInt(req.params.quantity);

  const quantityItems = lowQuantityItems.filter(item => item.quantity <= quantity);
  const total = quantityItems.length;
  res.json({ total });
});

// Rota para obter a quantidade de itens atendidos na lista de itens com quantidade baixa
app.get('/api/items/low-quantity/fulfilled/total', (req, res) => {
  const fulfilledItems = lowQuantityItems.filter(item => item.fulfilled);
  const total = fulfilledItems.length;
  res.json({ total });
});

// Rota para obter a quantidade de itens não atendidos na lista de itens com quantidade baixa
app.get('/api/items/low-quantity/unfulfilled/total', (req, res) => {
  const unfulfilledItems = lowQuantityItems.filter(item => !item.fulfilled);
  const total = unfulfilledItems.length;
  res.json({ total });
});

// Rota para limpar todos os itens com quantidade baixa atendidos da lista
app.delete('/api/items/low-quantity/fulfilled', (req, res) => {
  const unfulfilledItems = lowQuantityItems.filter(item => !item.fulfilled);
  lowQuantityItems.length = 0;
  lowQuantityItems.push(...unfulfilledItems);
  res.sendStatus(200);
});

// Rota para limpar todos os itens com quantidade baixa não atendidos da lista
app.delete('/api/items/low-quantity/unfulfilled', (req, res) => {
  const fulfilledItems = lowQuantityItems.filter(item => item.fulfilled);
  lowQuantityItems.length = 0;
  lowQuantityItems.push(...fulfilledItems);
  res.sendStatus(200);
});

// Rota para limpar todos os itens da lista de itens com quantidade baixa
app.delete('/api/items/low-quantity/all', (req, res) => {
  lowQuantityItems.length = 0;
  res.sendStatus(200);
});

// Rota para marcar um item como atendido na lista de itens com quantidade baixa
app.put('/api/items/low-quantity/fulfill/:id', (req, res) => {
  const itemId = req.params.id;

  const item = lowQuantityItems.find(item => item._id.toString() === itemId);
  if (item) {
    item.fulfilled = true;
    res.sendStatus(200);
  } else {
    res.status(404).json({ error: 'Item não encontrado na lista de itens com quantidade baixa' });
  }
});

// Rota para desmarcar um item como atendido na lista de itens com quantidade baixa
app.put('/api/items/low-quantity/unfulfill/:id', (req, res) => {
  const itemId = req.params.id;

  const item = lowQuantityItems.find(item => item._id.toString() === itemId);
  if (item) {
    item.fulfilled = false;
    res.sendStatus(200);
  } else {
    res.status(404).json({ error: 'Item não encontrado na lista de itens com quantidade baixa' });
  }
});

// Rota para obter o total de itens com quantidade baixa
app.get('/api/items/low-quantity/total', (req, res) => {
  const total = lowQuantityItems.length;
  res.json({ total });
});

// Rota para obter a lista de itens com quantidade baixa que estão atendidos
app.get('/api/items/low-quantity/fulfilled', (req, res) => {
  const fulfilledItems = lowQuantityItems.filter(item => item.fulfilled);
  res.json(fulfilledItems);
});

// Rota para obter a lista de itens com quantidade baixa que não estão atendidos
app.get('/api/items/low-quantity/unfulfilled', (req, res) => {
  const unfulfilledItems = lowQuantityItems.filter(item => !item.fulfilled);
  res.json(unfulfilledItems);
});

// Rota para marcar todos os itens como atendidos na lista de itens com quantidade baixa
app.put('/api/items/low-quantity/fulfill-all', (req, res) => {
  lowQuantityItems.forEach(item => {
    item.fulfilled = true;
  });
  res.sendStatus(200);
});

// Rota para desmarcar todos os itens como atendidos na lista de itens com quantidade baixa
app.put('/api/items/low-quantity/unfulfill-all', (req, res) => {
  lowQuantityItems.forEach(item => {
    item.fulfilled = false;
  });
  res.sendStatus(200);
});

// Rota para obter os itens com quantidade baixa que pertencem a uma determinada categoria
app.get('/api/items/low-quantity/category/:category', (req, res) => {
  const category = req.params.category;

  const categoryItems = lowQuantityItems.filter(item => item.category === category);
  res.json(categoryItems);
});

// Rota para obter os itens com quantidade baixa que possuem um determinado nome
app.get('/api/items/low-quantity/name/:name', (req, res) => {
  const name = req.params.name;

  const nameItems = lowQuantityItems.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
  res.json(nameItems);
});

// Rota para obter os itens com quantidade baixa que possuem uma quantidade menor ou igual a um valor específico
app.get('/api/items/low-quantity/quantity/:quantity', (req, res) => {
  const quantity = parseInt(req.params.quantity);

  const quantityItems = lowQuantityItems.filter(item => item.quantity <= quantity);
  res.json(quantityItems);
});

// Rota para filtrar os itens com quantidade baixa com base em várias opções
app.get('/api/items/low-quantity/filter', (req, res) => {
  const { category, name, quantity } = req.query;

  let filteredItems = lowQuantityItems;

  if (category) {
    filteredItems = filteredItems.filter(item => item.category === category);
  }

  if (name) {
    const lowercaseName = name.toLowerCase();
    filteredItems = filteredItems.filter(item => item.name.toLowerCase().includes(lowercaseName));
  }

  if (quantity) {
    const numericQuantity = parseInt(quantity);
    filteredItems = filteredItems.filter(item => item.quantity <= numericQuantity);
  }

  res.json(filteredItems);
});

// Rota para obter a quantidade de itens com quantidade baixa que pertencem a uma determinada categoria
app.get('/api/items/low-quantity/category/:category/total', (req, res) => {
  const category = req.params.category;

  const categoryItems = lowQuantityItems.filter(item => item.category === category);
  const total = categoryItems.length;
  res.json({ total });
});

// Rota para obter a quantidade de itens com quantidade baixa que possuem um determinado nome
app.get('/api/items/low-quantity/name/:name/total', (req, res) => {
  const name = req.params.name;

  const nameItems = lowQuantityItems.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
  const total = nameItems.length;
  res.json({ total });
});

// Rota para obter a quantidade de itens com quantidade baixa que possuem uma quantidade menor ou igual a um valor específico
app.get('/api/items/low-quantity/quantity/:quantity/total', (req, res) => {
  const quantity = parseInt(req.params.quantity);

  const quantityItems = lowQuantityItems.filter(item => item.quantity <= quantity);
  const total = quantityItems.length;
  res.json({ total });
});

// Rota para obter a quantidade de itens atendidos na lista de itens com quantidade baixa
app.get('/api/items/low-quantity/fulfilled/total', (req, res) => {
  const fulfilledItems = lowQuantityItems.filter(item => item.fulfilled);
  const total = fulfilledItems.length;
  res.json({ total });
});

// Rota para obter a quantidade de itens não atendidos na lista de itens com quantidade baixa
app.get('/api/items/low-quantity/unfulfilled/total', (req, res) => {
  const unfulfilledItems = lowQuantityItems.filter(item => !item.fulfilled);
  const total = unfulfilledItems.length;
  res.json({ total });
});

// Rota para limpar todos os itens com quantidade baixa atendidos da lista
app.delete('/api/items/low-quantity/fulfilled', (req, res) => {
  const unfulfilledItems = lowQuantityItems.filter(item => !item.fulfilled);
  lowQuantityItems.length = 0;
  lowQuantityItems.push(...unfulfilledItems);
  res.sendStatus(200);
});

// Rota para limpar todos os itens com quantidade baixa não atendidos da lista
app.delete('/api/items/low-quantity/unfulfilled', (req, res) => {
  const fulfilledItems = lowQuantityItems.filter(item => item.fulfilled);
  lowQuantityItems.length = 0;
  lowQuantityItems.push(...fulfilledItems);
  res.sendStatus(200);
});

// Rota para limpar todos os itens da lista de itens com quantidade baixa
app.delete('/api/items/low-quantity/all', (req, res) => {
  lowQuantityItems.length = 0;
  res.sendStatus(200);
});
