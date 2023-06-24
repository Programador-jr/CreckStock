const loadingOverlay = document.getElementById('loading-overlay');
const saveButton = document.getElementById('button');
const editButton = document.getElementById('edit-button');

function showLoading() {
  loadingOverlay.style.display = 'flex';
}

function hideLoading() {
  loadingOverlay.style.display = 'none';
}

saveButton.addEventListener('click', function() {
  showLoading();

  // Simular um atraso de 2 segundos para fins de demonstração
  setTimeout(function() {
    hideLoading();
    alert('Item salvo com sucesso!');
  }, 2000);
});

editButton.addEventListener('click', function() {
  showLoading();

  // Simular um atraso de 2 segundos para fins de demonstração
  setTimeout(function() {
    hideLoading();
    alert('Modo de edição ativado!');
  }, 2000);
});


// Função para exibir a tela de carregamento
function showLoading() {
  document.getElementById('loading-overlay').style.display = 'flex';
}

// Função para ocultar a tela de carregamento
function hideLoading() {
  document.getElementById('loading-overlay').style.display = 'none';
}

// Função para obter todos os itens do servidor
function getItems() {
  showLoading();
  return fetch('/api/items')
    .then(response => response.json())
    .then(items => {
      const stockBody = document.getElementById('stock-body');
      stockBody.innerHTML = '';

      items.forEach(item => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        const quantityCell = document.createElement('td');
        quantityCell.textContent = item.quantity;
        row.appendChild(quantityCell);

        const categoryCell = document.createElement('td');
        categoryCell.textContent = item.category;
        row.appendChild(categoryCell);

        const actionCell = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.addEventListener('click', () => showEditPopup(item._id));
        actionCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener('click', () => showDeletePopup(item._id));
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        stockBody.appendChild(row);

        // Verificar se a quantidade do item está abaixo da quantidade necessária
        if (item.quantity <= item.lowQuantity) {
          row.classList.add('low-quantity'); // Adicionar classe de destaque para itens com quantidade baixa
        }
      });

      return items; // Retornar os itens para uso posterior
    })
    .catch(error => {
      console.error('Erro ao obter itens:', error);
    })
    .finally(() => {
      hideLoading(); // Oculta a tela de carregamento quando a resposta é recebida
    });
}

document.addEventListener('DOMContentLoaded', () => {
  getItems()
    .then(items => {
      const lowQuantityItems = items.filter(item => {
        if (
          (item.name === 'Ovos' && item.quantity <= 5) ||
          (item.name === 'Calabresa' && item.quantity <= 4) ||
          (item.name === 'Nutella' && item.quantity <= 1) ||
          (item.name === 'Chocolate' && item.quantity <= 3) ||
          (item.name === 'Chocolate Branco' && item.quantity <= 1) ||
          (item.name === 'Mussarela' && item.quantity <= 4) ||
          (item.name === 'Mussarela Bufula' && item.quantity <= 0) ||
          (item.name === 'Queijo Brie' && item.quantity <= 1) ||
          (item.name === 'Banana' && item.quantity <= 4) ||
          (item.name === 'Morango' && item.quantity <= 3) ||
          (item.name === 'Catupiry' && item.quantity <= 3) ||
          (item.name === 'Milho Verde' && item.quantity <= 2) ||
          (item.name === 'Cream Cheese' && item.quantity <= 0) ||
          (item.name === 'Goiabada' && item.quantity <= 0) ||
          (item.name === 'KitKat' && item.quantity <= 0) ||
          (item.name === 'Doce de Leite' && item.quantity <= 0) ||
          (item.name === 'Shoyu' && item.quantity <= 0) ||
          (item.name === 'Molho de Pimenta' && item.quantity <= 0) ||
          (item.name === 'Molho de Pimenta Mexicana' && item.quantity <= 0) ||
          (item.name === 'Tomate' && item.quantity <= 6) ||
          (item.name === 'Cebola' && item.quantity <= 4) ||
          (item.name === 'Manteiga' && item.quantity <= 1) ||
          (item.name === 'Abobrinha' && item.quantity <= 0) ||
          (item.name === 'Pimentão Verde' && item.quantity <= 0) ||
          (item.name === 'Pimentão Vermelho' && item.quantity <= 1) ||
          (item.name === 'Pimentão Amarelo' && item.quantity <= 1) ||
          (item.name === 'Manjericão' && item.quantity <= 0) ||
          (item.name === 'Geleia Pimenta' && item.quantity <= 0) ||
          (item.name === 'Geleia Damasco' && item.quantity <= 0) ||
          (item.name === 'Geleia Frutas Vermelhas' && item.quantity <= 0) ||
          (item.name === 'Lemon Pepper' && item.quantity <= 0) ||
          (item.name === 'Brócolis' && item.quantity <= 0) ||
          (item.name === 'Papael Toalha' && item.quantity <= 0) ||
          (item.name === 'Filé' && item.quantity <= 1) ||
          (item.name === 'Parmesão' && item.quantity <= 0) ||
          (item.name === 'Toscana' && item.quantity <= 0) ||
          (item.name === 'Esponja de lavar louça' && item.quantity <= 0) ||
          (item.name === 'Bombril' && item.quantity <= 0) ||
          (item.name === 'Sabão em Barra' && item.quantity <= 0) ||
          (item.name === 'Peperoni' && item.quantity <= 0) ||
          (item.name === 'Champignion' && item.quantity <= 0) ||
          (item.name === 'Fósforo' && item.quantity <= 0) ||
          (item.name === 'Palmito' && item.quantity <= 0) ||
          (item.name === 'Tomate Seco' && item.quantity <= 0) ||
          (item.name === 'Alho Frito' && item.quantity <= 0) ||
          (item.name === 'Camarão' && item.quantity <= 0) ||
          (item.name === 'Caldo de Galinha' && item.quantity <= 0) ||
          (item.name === 'Azeite' && item.quantity <= 0) ||
          (item.name === 'Massa de Tomate' && item.quantity <= 0) ||
          (item.name === 'Carne Louca' && item.quantity <= 0) ||
          (item.name === 'Frango' && item.quantity <= 4) ||
          (item.name === 'Presunto Parma' && item.quantity <= 3) ||
          (item.name === 'Atum' && item.quantity <= 0) ||
					(item.name === 'Peito de Peru' && item.quantity <= 0) ||
					(item.name === 'Bacon' && item.quantity <= 1) ||
					(item.name === 'Azeitona Preta' && item.quantity <= 0) ||
					(item.name === 'Álcool' && item.quantity <= 0) ||
					(item.name === 'Detergente' && item.quantity <= 0)
        ) {
          return true;
        }
        return false;
      });

      if (lowQuantityItems.length > 0) {
        showLowQuantityAlert(lowQuantityItems);
      }
    });
});

// Função para exibir o alerta de quantidade baixa
function showLowQuantityAlert(items) {
	const lowQuantityAlert = document.getElementById('low-quantity-alert');
	const lowQuantityList = document.getElementById('low-quantity-list');
	const copyButton = document.getElementById('copy-button');

	lowQuantityList.innerHTML = '';

	items.forEach(item => {
		const listItem = document.createElement('li');
		listItem.textContent = `${item.name} (Quantidade: ${item.quantity})`;
		lowQuantityList.appendChild(listItem);
	});
	copyButton.addEventListener('click', () => {
		const itemNames = items.map(item => item.name).join('\n');
		navigator.clipboard.writeText(itemNames)
			.then(() => {
				alert('Itens copiados com sucesso!');
			})
			.catch(error => {
				console.error('Erro ao copiar itens:', error);
			});
	});

	lowQuantityAlert.style.display = 'block';
	document.getElementById('overlay').style.display = 'block';
}

// Função para ocultar o alerta de quantidade baixa
function hideLowQuantityAlert() {
	const lowQuantityAlert = document.getElementById('low-quantity-alert');
	lowQuantityAlert.style.display = 'none';
	document.getElementById('overlay').style.display = 'none';
}


// Função para adicionar um novo item ao servidor
function addItem() {
	const name = document.getElementById('add-name').value;
	const quantity = document.getElementById('add-quantity').value;
	const category = document.getElementById('add-category').value;

	const newItem = { name, quantity, category };

	fetch('/api/items', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(newItem)
	})
		.then(response => response.json())
		.then(item => {
			console.log('Novo item adicionado:', item);
			hideAddPopup();
			getItems();
		})
		.catch(error => {
			console.error('Erro ao adicionar item:', error);
		});
}

// Função para editar um item no servidor
function editItem(itemId) {
	const name = document.getElementById('edit-name').value;
	const quantity = document.getElementById('edit-quantity').value;
	const category = document.getElementById('edit-category').value;

	const updatedItem = { name, quantity, category };

	fetch(`/api/items/${itemId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(updatedItem)
	})
		.then(() => {
			console.log('Item atualizado');
			hideEditPopup();
			getItems();
		})
		.catch(error => {
			console.error('Erro ao atualizar item:', error);
		});
}

// Função para excluir um item do servidor
function deleteItem(itemId) {
	fetch(`/api/items/${itemId}`, {
		method: 'DELETE'
	})
		.then(() => {
			console.log('Item excluído');
			hideDeletePopup();
			getItems();
		})
		.catch(error => {
			console.error('Erro ao excluir item:', error);
		});
}

// Função para filtrar os itens com base no nome e categoria selecionada
function filterItems() {
	const filterName = document.getElementById('filter-name').value;
	const filterCategory = document.getElementById('filter-category').value;

	fetch('/api/items')
		.then(response => response.json())
		.then(items => {
			const filteredItems = items.filter(item => {
				const nameMatch = item.name.toLowerCase().includes(filterName.toLowerCase());
				const categoryMatch = filterCategory === '' || item.category === filterCategory;
				return nameMatch && categoryMatch;
			});

			// Ordenar os itens pela quantidade do menor para o maior
			filteredItems.sort((a, b) => a.quantity - b.quantity);

			const stockBody = document.getElementById('stock-body');
			stockBody.innerHTML = '';

			filteredItems.forEach(item => {
				const row = document.createElement('tr');

				const nameCell = document.createElement('td');
				nameCell.textContent = item.name;
				row.appendChild(nameCell);

				const quantityCell = document.createElement('td');
				quantityCell.textContent = item.quantity;
				row.appendChild(quantityCell);

				const categoryCell = document.createElement('td');
				categoryCell.textContent = item.category;
				row.appendChild(categoryCell);

				const actionCell = document.createElement('td');
				const editButton = document.createElement('button');
				editButton.innerHTML = '<i class="fas fa-edit"></i>';
				editButton.addEventListener('click', () => showEditPopup(item._id));
				actionCell.appendChild(editButton);

				const deleteButton = document.createElement('button');
				deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
				deleteButton.addEventListener('click', () => showDeletePopup(item._id));
				actionCell.appendChild(deleteButton);

				row.appendChild(actionCell);

				stockBody.appendChild(row);
			});
		})
		.catch(error => {
			console.error('Erro ao obter itens:', error);
		});
}

// Funções para exibir/ocultar os popups
function showAddPopup() {
	document.getElementById('add-popup').style.display = 'block';
	document.getElementById('overlay').style.display = 'block';
}

function hideAddPopup() {
	document.getElementById('add-popup').style.display = 'none';
	document.getElementById('overlay').style.display = 'none';
	document.getElementById('add-form').reset();
}

function showEditPopup(itemId) {
	fetch(`/api/items/${itemId}`)
		.then(response => response.json())
		.then(item => {
			document.getElementById('edit-name').value = item.name;
			document.getElementById('edit-quantity').value = item.quantity;
			document.getElementById('edit-category').value = item.category;
			document.getElementById('edit-item-id').value = itemId; // Adicione essa linha para armazenar o ID do item no campo hidden
		})
		.catch(error => {
			console.error('Erro ao obter item para edição:', error);
		});

	document.getElementById('edit-popup').style.display = 'block';
	document.getElementById('overlay').style.display = 'block';
}


function hideEditPopup() {
	document.getElementById('edit-popup').style.display = 'none';
	document.getElementById('overlay').style.display = 'none';
	document.getElementById('edit-form').reset();
}

function showDeletePopup(itemId) {
	const confirmation = confirm('Tem certeza que deseja excluir este item?');

	if (confirmation) {
		deleteItem(itemId);
	}
}

function hideDeletePopup() {
	document.getElementById('delete-popup').style.display = 'none';
	document.getElementById('overlay').style.display = 'none';
}

// Chamar a função getItems() para obter os itens ao carregar a página
document.addEventListener('DOMContentLoaded', getItems);

// Obter referências aos elementos do HTML
const addForm = document.getElementById('add-form');
const editForm = document.getElementById('edit-form');
const filterForm = document.getElementById('filter-form');

// Adicionar listeners de evento aos formulários
addForm.addEventListener('submit', event => {
	event.preventDefault();
	addItem();
});

editForm.addEventListener('submit', event => {
	event.preventDefault();
	const itemId = document.getElementById('edit-item-id').value;
	editItem(itemId);
});

filterForm.addEventListener('submit', event => {
	event.preventDefault();
	filterItems();
});
