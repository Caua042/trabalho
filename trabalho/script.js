let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
let produtoExclusaoId = null; // ID do produto a ser excluído
let editandoProduto = false; // Variável para saber se estamos editando um produto

// Função para renderizar a tabela
function renderizarTabela() {
    const tabela = document.getElementById('produtosTabela');
    tabela.innerHTML = ''; // Limpa a tabela antes de renderizar

    produtos.forEach(produto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.nome}</td>
            <td>${produto.quantidade}</td>
            <td>${produto.descricao}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="abrirModalEditar(${produto.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="excluirProduto(${produto.id})">Excluir</button>
            </td>
        `;
        tabela.appendChild(tr);
    });
}

function exibirAlerta(mensagem) {
    const alertContainer = document.getElementById('alertContainer');
    const alertMessage = document.getElementById('alertMessage');

    alertMessage.textContent = mensagem; // Atualiza a mensagem do alerta
    alertContainer.style.display = 'block'; // Torna o alerta visível

    // Oculta o alerta automaticamente após 3 segundos
    setTimeout(() => {
        alertContainer.style.display = 'none';
    }, 3000);
}

// Função para adicionar um novo produto
function adicionarProduto() {
    const nome = document.getElementById('nomeProduto').value;
    const quantidade = Number(document.getElementById('quantidadeProduto').value); // Convertendo para número
    const descricao = document.getElementById('descricaoProduto').value;

    if (quantidade < 0) {
        exibirAlerta("A quantidade não pode ser negativa.");
        return; // Sai da função sem salvar
    }

    const novoProduto = {
        id: obterNovoId(),
        nome: nome,
        quantidade: quantidade,
        descricao: descricao
    };

    produtos.push(novoProduto);
    salvarProdutos();
    renderizarTabela();
    limparCampos();
}

// Função para editar um produto existente
function editarProduto(id) {
    const nome = document.getElementById('nomeProduto').value;
    const quantidade = Number(document.getElementById('quantidadeProduto').value); // Convertendo para número
    const descricao = document.getElementById('descricaoProduto').value;

    if (quantidade < 0) {
        exibirAlerta("A quantidade não pode ser negativa.");
        return; // Sai da função sem salvar
    }

    const produtoEditado = produtos.find(produto => produto.id === id);
    if (produtoEditado) {
        produtoEditado.nome = nome;
        produtoEditado.quantidade = quantidade;
        produtoEditado.descricao = descricao;
        salvarProdutos();
        renderizarTabela();
        limparCampos();
    }
}


// Função para obter um novo ID crescente
function obterNovoId() {
    if (produtos.length === 0) {
        return 1; // Se não houver produtos, o ID será 1
    }
    const ultimoProduto = produtos[produtos.length - 1];
    return ultimoProduto.id + 1; // O próximo ID será o último + 1
}

// Função para salvar os produtos no localStorage
function salvarProdutos() {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Função para excluir um produto
function excluirProduto(id) {
    produtoExclusaoId = id; // Armazena o ID para exclusão
    const modal = new bootstrap.Modal(document.getElementById('confirmarExclusaoModal'));
    modal.show(); // Abre o modal de confirmação
}

// Função para confirmar exclusão com senha
document.getElementById('confirmarExcluirBtn').addEventListener('click', () => {
    const senha = document.getElementById('senhaExclusao').value;
    if (senha === "123") {
        produtos = produtos.filter(produto => produto.id !== produtoExclusaoId);
        salvarProdutos();
        renderizarTabela();
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmarExclusaoModal'));
        modal.hide();
    } else {
        // Não exibe mensagem para senha incorreta
        document.getElementById('senhaExclusao').value = ''; // Opcional: limpa o campo de senha
    }
});

// Função para abrir o modal de edição
function abrirModalEditar(id) {
    editandoProduto = true; // Indica que estamos editando um produto
    const produto = produtos.find(p => p.id === id);
    if (produto) {
        document.getElementById('nomeProduto').value = produto.nome;
        document.getElementById('quantidadeProduto').value = produto.quantidade;
        document.getElementById('descricaoProduto').value = produto.descricao;
        document.getElementById('produtoId').value = produto.id;
        document.getElementById('modalTitle').textContent = 'Editar Produto';
        const modal = new bootstrap.Modal(document.getElementById('adicionarEditarProdutoModal'));
        modal.show();
    }
}

// Função para abrir o modal de adicionar produto
function abrirModalAdicionar() {
    editandoProduto = false; // Indica que estamos adicionando um produto
    limparCampos();
    document.getElementById('modalTitle').textContent = 'Adicionar Produto';
    const modal = new bootstrap.Modal(document.getElementById('adicionarEditarProdutoModal'));
    modal.show();
}

// Função para limpar os campos do formulário
function limparCampos() {
    document.getElementById('nomeProduto').value = '';
    document.getElementById('quantidadeProduto').value = '';
    document.getElementById('descricaoProduto').value = '';
    document.getElementById('produtoId').value = '';
}

// Evento para salvar o produto (adicionar ou editar)
document.getElementById('salvarProdutoBtn').addEventListener('click', () => {
    const idProduto = document.getElementById('produtoId').value;
    if (editandoProduto) {
        editarProduto(Number(idProduto));
    } else {
        adicionarProduto();
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById('adicionarEditarProdutoModal'));
    modal.hide();
});
// Inicialização
renderizarTabela();