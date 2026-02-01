// 1. Inicialização da Máscara (Preservada)
const elementValue = document.getElementById('value');
const moneyMask = IMask(elementValue, {
    mask: 'R$ num',
    blocks: { num: { mask: Number, thousandsSeparator: '.', padFractionalZeros: true, radix: ',', mapToRadix: ['.'] } }
});

// 2. Banco de Dados (DAO)
const DB = {
    getTransactions: () => JSON.parse(localStorage.getItem('transactions')) || [],
    setTransactions: (data) => localStorage.setItem('transactions', JSON.stringify(data))
};

const elements = {
    tableBody: document.getElementById('table-body'),
    totalDisplay: document.getElementById('total-amount'),
    modal: document.getElementById('modal-form'),
    form: document.getElementById('transaction-form')
};

// 3. Funções de Renderização e Filtro Espontâneo
window.render = function() {
    const transactions = DB.getTransactions();
    
    // Captura valores dos filtros
    const fName = document.getElementById('filter-name').value.toLowerCase();
    const fCat = document.getElementById('filter-category').value;
    const fMonth = document.getElementById('filter-month').value;
    const fYear = document.getElementById('filter-year').value;

    elements.tableBody.innerHTML = '';
    let total = 0;

    // Filtra e Renderiza
    transactions.forEach((t, index) => {
        const [year, month] = t.date.split('-'); // ISO: YYYY-MM-DD
        
        const matchName = t.name.toLowerCase().includes(fName);
        const matchCat = fCat === 'all' || t.category === fCat;
        const matchMonth = fMonth === 'all' || month === fMonth;
        const matchYear = fYear === "" || year === fYear;

        if (matchName && matchCat && matchMonth && matchYear) {
            total += parseFloat(t.value);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Nome">${t.name}</td>
                <td data-label="Categoria">${t.category}</td>
                <td data-label="Valor">${new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'}).format(t.value)}</td>
                <td data-label="Data">${t.date.split('-').reverse().join('/')}</td>
                <td data-label="Editar"><button class="btn-edit" onclick="editTransaction(${index})"><i class="fas fa-edit"></i></button></td>
                <td data-label="Deletar"><button class="btn-delete" onclick="deleteTransaction(${index})"><i class="fas fa-trash"></i></button></td>
            `;
            elements.tableBody.appendChild(row);
        }
    });

    elements.totalDisplay.innerText = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'}).format(total);
};

// 4. CRUD e Funções Globais (Viculadas ao window para evitar ReferenceError)
window.saveTransaction = (e) => {
    e.preventDefault();
    const transactions = DB.getTransactions();
    const id = document.getElementById('edit-id').value;
    
    const data = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        value: parseFloat(moneyMask.unmaskedValue),
        date: document.getElementById('date').value
    };

    if (id !== "") transactions[id] = data;
    else transactions.push(data);

    DB.setTransactions(transactions);
    closeModal();
    window.render();
};

window.deleteTransaction = (index) => {
    if (confirm("Excluir este registro?")) {
        const t = DB.getTransactions();
        t.splice(index, 1);
        DB.setTransactions(t);
        window.render();
    }
};

window.editTransaction = (index) => {
    const t = DB.getTransactions()[index];
    document.getElementById('edit-id').value = index;
    document.getElementById('name').value = t.name;
    document.getElementById('category').value = t.category;
    moneyMask.value = t.value.toString().replace('.', ',');
    document.getElementById('date').value = t.date;
    document.getElementById('modal-title').innerText = "Editar Gasto";
    elements.modal.style.display = 'flex';
};

window.clearFilters = () => {
    document.getElementById('filter-name').value = '';
    document.getElementById('filter-category').value = 'all';
    document.getElementById('filter-month').value = 'all';
    document.getElementById('filter-year').value = '';
    window.render();
};

// 5. Auxiliares e Eventos
function closeModal() {
    elements.modal.style.display = 'none';
    elements.form.reset();
}

document.getElementById('btn-cadastrar').onclick = () => {
    document.getElementById('edit-id').value = "";
    elements.modal.style.display = 'flex';
};

document.getElementById('close-modal').onclick = closeModal;
elements.form.onsubmit = window.saveTransaction;

// Inicializa a tabela
window.render();