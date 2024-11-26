// Variável global para armazenar o ID do produto a ser excluído
let produtoExclusaoId = null;

// Função para obter produtos do localStorage
function getProdutos() {
    return JSON.parse(localStorage.getItem('produtos')) || [];
}

// Função para salvar produtos no localStorage
function salvarProdutos(produtos) {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Função para adicionar ou editar produto
function adicionarProduto() {
    const nome = document.getElementById('nome').value;
    const quantidade = document.getElementById('quantidade').value;
    const descricao = document.getElementById('descricao').value;

    if (!nome || !quantidade || !descricao) {
        alert('Todos os campos devem ser preenchidos.');
        return;
    }

    const produtos = getProdutos();
    const produtoExistente = produtos.find(produto => produto.id === nome);

    if (produtoExistente) {
        produtoExistente.quantidade = quantidade;
        produtoExistente.descricao = descricao;
    } else {
        produtos.push({ id: Date.now(), nome, quantidade, descricao });
    }

    salvarProdutos(produtos);
    renderizarTabela();
    document.getElementById('nome').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('descricao').value = '';
}

// Função para excluir produto
function excluirProduto(id) {
    produtoExclusaoId = id; // Armazena o ID para exclusão
    const modal = new bootstrap.Modal(document.getElementById('confirmarExclusaoModal'));
    modal.show(); // Abre o modal de confirmação
}

// Evento do botão de confirmar exclusão
document.getElementById('confirmarExclusaoBtn').addEventListener('click', () => {
    const senha = document.getElementById('senha').value;
    const senhaErro = document.getElementById('senhaErro');

    if (senha === 'Administração123') {
        senhaErro.style.display = 'none';
        const produtos = getProdutos().filter(produto => produto.id !== produtoExclusaoId);
        salvarProdutos(produtos);
        renderizarTabela();

        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmarExclusaoModal'));
        modal.hide();
    } else {
        senhaErro.style.display = 'block';
    }
});

// Função para renderizar a tabela
function renderizarTabela() {
    const produtos = getProdutos();
    const tbody = document.getElementById('tabelaProdutos').querySelector('tbody');
    tbody.innerHTML = '';

    produtos.forEach(produto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.nome}</td>
            <td>${produto.quantidade}</td>
            <td>${produto.descricao}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarProduto('${produto.id}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="excluirProduto('${produto.id}')">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Inicializa a tabela ao carregar a página
document.addEventListener('DOMContentLoaded', renderizarTabela);
