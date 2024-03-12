document.getElementById('dropArea').addEventListener('dragover', function(event) {
    event.preventDefault();
    this.classList.add('hover');
});

document.getElementById('dropArea').addEventListener('dragleave', function(event) {
    this.classList.remove('hover');
});

document.getElementById('dropArea').addEventListener('drop', function(event) {
    event.preventDefault();
    this.classList.remove('hover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        processFile(file);
    }
});

document.getElementById('fileInput').addEventListener('change', function() {
    processFile(this.files[0]);
});

function processFile(file) {
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');

    if (!file) {
        displayMessage(resultDiv, 'Por favor, selecione um arquivo.', 'error');
        return;
    }

    if (!file.name.endsWith('.txt')) {
        displayMessage(resultDiv, 'Por favor, selecione um arquivo .txt.', 'error');
        return;
    }

    loadingDiv.classList.remove('hidden');

    const reader = new FileReader();
    reader.onload = function(event) {
        const content = event.target.result;

        // Processamento do conteúdo do arquivo em JavaScript
        const tabelas = content.split('UAU! Software de Automação e Gestão Empresarial');

        let totalValorParcial = 0;
        let totalValorParcela = 0;
        let totalMenorValor = 0;

        tabelas.forEach(tabela => {
            const linhas = tabela.trim().split('\n');
            linhas.forEach(linha => {
                if (linha.startsWith('P.') || linha.startsWith('S.')) {
                    const colunas = linha.trim().split(/\s+/);
                    const valorParcial = parseFloat(colunas[2].replace(',', '.'));
                    const valorParcela = parseFloat(colunas[4].replace(',', '.'));
                    totalValorParcial += valorParcial;
                    totalValorParcela += valorParcela;
                    totalMenorValor += Math.min(valorParcial, valorParcela);
                }
            });
        });

        loadingDiv.classList.add('hidden');
        displayResults(resultDiv, totalValorParcial, totalValorParcela, totalMenorValor);
    };

    reader.readAsText(file);
}

function displayMessage(element, message, type) {
    element.innerHTML = `<p class="${type}">${message}</p>`;
}

function displayResults(element, totalValorParcial, totalValorParcela, totalMenorValor) {
    element.innerHTML = `
        <p style="text-align: left;"><strong>Total Valor Parc.:</strong> R$ ${formatCurrency(totalValorParcial)}</p>
        <p style="text-align: left;"><strong>Total Vlr da Parcela:</strong> R$ ${formatCurrency(totalValorParcela)}</p>
        <p style="text-align: left;"><strong>Total Valor Quitação:</strong> R$ ${formatCurrency(totalMenorValor)}</p>
    `;
}

function formatCurrency(value) {
    return value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}