let idEditando = null;

// Função para obter os produtos do localStorage
function getProdutos() {
    return JSON.parse(localStorage.getItem('produtos')) || [];
}

// Função para salvar os produtos no localStorage
function salvarProdutos(produtos) {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Função para renderizar a tabela de produtos
function renderizarTabela() {
    const produtos = getProdutos();
    const tabela = document.getElementById('tabelaProdutos').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';

    produtos.forEach(produto => {
        const row = tabela.insertRow();
        row.insertCell(0).textContent = produto.id;
        row.insertCell(1).textContent = produto.nome;
        row.insertCell(2).textContent = produto.quantidade;
        row.insertCell(3).textContent = produto.descricao;

        const acoesCell = row.insertCell(4);
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.classList.add('edit-btn');
        btnEditar.onclick = () => editarProduto(produto.id);
        acoesCell.appendChild(btnEditar);

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.classList.add('delete-btn');
        btnExcluir.onclick = () => confirmarExclusao(produto.id);
        acoesCell.appendChild(btnExcluir);
    });
}

// Função para adicionar ou editar um produto
function adicionarOuEditarProduto() {
    const nome = document.getElementById('nome').value;
    const quantidade = document.getElementById('quantidade').value;
    const descricao = document.getElementById('descricao').value;

    if (!nome || !quantidade || !descricao) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const produtos = getProdutos();

    if (idEditando !== null) {
        const produto = produtos.find(p => p.id === idEditando);
        produto.nome = nome;
        produto.quantidade = parseInt(quantidade);
        produto.descricao = descricao;
        idEditando = null;
        document.getElementById('adicionarBtn').textContent = 'Adicionar Produto';
    } else {
        const id = produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 1;
        produtos.push({ id, nome, quantidade: parseInt(quantidade), descricao });
    }

    salvarProdutos(produtos);
    renderizarTabela();
    limparCampos();
}

// Função para editar um produto
function editarProduto(id) {
    const produto = getProdutos().find(p => p.id === id);
    document.getElementById('nome').value = produto.nome;
    document.getElementById('quantidade').value = produto.quantidade;
    document.getElementById('descricao').value = produto.descricao;
    document.getElementById('adicionarBtn').textContent = 'Salvar Alterações';
    idEditando = id;
}

// Função para confirmar exclusão de um produto
function confirmarExclusao(id) {
    const senha = prompt("Digite a senha para excluir o produto:");
    if (senha === "Administração123") {
        excluirProduto(id);
    } else {
        alert("Senha incorreta. A exclusão foi cancelada.");
    }
}

// Função para excluir um produto
function excluirProduto(id) {
    const produtos = getProdutos().filter(produto => produto.id !== id);
    salvarProdutos(produtos);
    renderizarTabela();
}

// Função para limpar os campos do formulário
function limparCampos() {
    document.getElementById('nome').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('descricao').value = '';
    idEditando = null;
}

// Inicializa a tabela ao carregar a página
renderizarTabela();
