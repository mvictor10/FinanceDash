// Variáveis de controle das instâncias
let myChartCat = null;
let myChartEvo = null;

// 1. Função que limpa e reconstrói os gráficos
function updateCharts() {
    console.log("Atualizando gráficos...");

    // Recupera dados atualizados do LocalStorage
    const rawData = localStorage.getItem('transactions');
    if (!rawData) {
        console.error("Nenhum dado encontrado no LocalStorage!");
        return;
    }
    const transactions = JSON.parse(rawData);

    // Captura os valores dos filtros
    const selectedCat = document.getElementById('filterCategory').value;
    const selectedType = document.getElementById('chartTypeSelector').value;

    // Filtra os dados conforme a categoria
    const filteredData = selectedCat === 'all' 
        ? transactions 
        : transactions.filter(t => t.category === selectedCat);

    // Chama as funções de renderização passando os novos parâmetros
    renderPie(filteredData, selectedType);
    renderLine(filteredData);
}

function renderPie(data, type) {
    const ctx = document.getElementById('chartCategorias').getContext('2d');

    // Agrupa os dados para o gráfico de pizza/barra
    const grouped = data.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + parseFloat(t.value);
        return acc;
    }, {});

    // DEPURAÇÃO: Destrói o gráfico anterior para liberar o Canvas
    if (myChartCat) {
        myChartCat.destroy();
    }

    // Cria a nova instância com o TIPO escolhido no select
    myChartCat = new Chart(ctx, {
        type: type, // Aqui o tipo muda dinamicamente (pie, bar, etc)
        data: {
            labels: Object.keys(grouped),
            datasets: [{
                data: Object.values(grouped),
                backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false // Faz o gráfico respeitar o tamanho da DIV pai
        }
    });
}

function renderLine(data) {
    const ctx = document.getElementById('chartEvolucao').getContext('2d');
    const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    const grouped = sorted.reduce((acc, t) => {
        acc[t.date] = (acc[t.date] || 0) + parseFloat(t.value);
        return acc;
    }, {});

    if (myChartEvo) {
        myChartEvo.destroy();
    }

    myChartEvo = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(grouped).map(d => d.split('-').reverse().join('/')),
            datasets: [{
                label: 'Gastos',
                data: Object.values(grouped),
                borderColor: '#3498db',
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Inicializa o filtro de categorias ao abrir a página
function init() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const select = document.getElementById('filterCategory');
    
    // Pega categorias únicas para o filtro
    const categories = [...new Set(transactions.map(t => t.category))];
    categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.text = cat;
        select.appendChild(opt);
    });

    updateCharts();
}

// Garante que o código só rode após o HTML carregar
window.onload = init;