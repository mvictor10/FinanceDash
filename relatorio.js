const { jsPDF } = window.jspdf;

const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Função para formatar moeda no PDF
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// Exibe um resumo na tela antes de gerar
function showPreview() {
    const preview = document.getElementById('preview-info');
    if (transactions.length === 0) {
        preview.innerHTML = "<p style='color: red;'>Nenhum dado disponível para exportar.</p>";
        document.getElementById('btn-gerar').disabled = true;
        return;
    }
    preview.innerHTML = `<p>Total de registros: <strong>${transactions.length}</strong></p>`;
}

function gerarPDF() {
    const doc = new jsPDF();
    
    // Título do Documento
    doc.setFontSize(18);
    doc.text("Relatório de Gastos Financeiros", 14, 20);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);

    // Preparação dos dados para a tabela do AutoTable
    const colunas = ["Nome", "Categoria", "Valor", "Data"];
    const linhas = [];
    let totalGeral = 0;

    transactions.forEach(t => {
        totalGeral += parseFloat(t.value);
        linhas.push([
            t.name,
            t.category,
            formatCurrency(t.value),
            t.date.split('-').reverse().join('/')
        ]);
    });

    // Gerando a tabela
    doc.autoTable({
        startY: 35,
        head: [colunas],
        body: linhas,
        theme: 'striped',
        headStyles: { fillColor: [44, 62, 80] }, // Cor var(--primary)
        foot: [["", "TOTAL GERAL", formatCurrency(totalGeral), ""]],
        footStyles: { fillColor: [231, 76, 60], fontStyle: 'bold' }
    });

    // Nome do arquivo com timestamp para evitar sobreposição
    const fileName = `Relatorio_Financeiro_${Date.now()}.pdf`;
    doc.save(fileName);
}

document.getElementById('btn-gerar').onclick = gerarPDF;
showPreview();