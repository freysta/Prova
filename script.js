document.addEventListener('DOMContentLoaded', () => {
    const itemForm = document.getElementById('item-form');
    const itemIdInput = document.getElementById('item-id');
    const itemNameInput = document.getElementById('item-name');
    const saveButton = document.getElementById('btn-save');
    const cancelButton = document.getElementById('btn-cancel');
    const itemList = document.getElementById('item-list');

    const apiUrl = 'http://localhost:3000/items';

    const fetchItems = () => {
        fetch(apiUrl)
            .then(response => response.json())
            .then(items => {
                itemList.innerHTML = '';
                items.forEach(addItemToDom);
            })
            .catch(error => console.error('Erro ao carregar itens:', error));
    };

    const addItemToDom = (item) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span class="item-name">${item.name}</span>
            <div class="item-actions">
                <button class="btn-edit">Editar</button>
                <button class="btn-delete">Excluir</button>
            </div>
        `;

        listItem.querySelector('.btn-edit').addEventListener('click', () => setupEditForm(item));
        listItem.querySelector('.btn-delete').addEventListener('click', () => deleteItem(item.id));

        itemList.appendChild(listItem);
    };

    const createItem = (name) => {
        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        })
        .then(response => response.json())
        .then(item => {
            addItemToDom(item);
            itemForm.reset();
        })
        .catch(error => console.error('Erro ao criar item:', error));
    };

    const setupEditForm = (item) => {
        itemIdInput.value = item.id;
        itemNameInput.value = item.name;
        saveButton.textContent = 'Atualizar Item';
        cancelButton.classList.remove('hidden');
    };

    const updateItem = (id, name) => {
        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        })
        .then(() => {
            resetForm();
            fetchItems();
        })
        .catch(error => console.error('Erro ao atualizar item:', error));
    };

    const deleteItem = (id) => {
        if (confirm('Tem certeza que deseja excluir este item?')) {
            fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
                .then(() => fetchItems())
                .catch(error => console.error('Erro ao excluir item:', error));
        }
    };

    const resetForm = () => {
        itemIdInput.value = '';
        itemForm.reset();
        saveButton.textContent = 'Adicionar Item';
        cancelButton.classList.add('hidden');
    };

    itemForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = itemIdInput.value;
        const name = itemNameInput.value;

        if (id) {
            updateItem(id, name);
        } else {
            createItem(name);
        }
    });

    cancelButton.addEventListener('click', resetForm);

    fetchItems();
});
