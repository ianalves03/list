const form = document.getElementById("adicionarProduto");
const lista = document.getElementById("listaCompras");
const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
const reseta = document.getElementById("reset");

function getProducts() {
    return JSON.parse(localStorage.getItem("produtos")) || [];
}

function setProducts(produtos) {
    localStorage.setItem("produtos", JSON.stringify(produtos));
}

reseta.addEventListener('click', () => {
    localStorage.clear();
    window.location.reload();
})

produtos.forEach( (elemento) => {
    criaElemento(elemento);
});

form.addEventListener("submit", (evento) => {
    evento.preventDefault()
    
    let produto = evento.target.elements['produto'];
    let quantidade = evento.target.elements['quantidade'];
    
    let existe = produtos.find(elemento => elemento.produto === produto.value);
    
    let produtoAtual = {
        "produto": produto.value,
        "quantidade": quantidade.value
    }

    if (existe) {
        produtoAtual.id = existe.id;

        atualizaElemento(produtoAtual);

        produtos[produtos.findIndex(elemento => elemento.id === existe.id)] = produtoAtual;
    } else {
        produtoAtual.id = produtos[produtos.length -1] ? (produtos[produtos.length-1]).id + 1 : 0;
        criaElemento(produtoAtual);
        produtos.push(produtoAtual);
    }

    localStorage.setItem("produtos", JSON.stringify(produtos));
    
    produto.value = "";
    quantidade.value = "";
})

function criaElemento(item) {
    let numeroProduto = document.createElement('tr');
    numeroProduto.classList.add("item");
    if (item.checked){
        numeroProduto.classList.add("check");

    }

    let novoProduto = document.createElement('td');
    
    novoProduto.innerHTML = item.produto;
    novoProduto.dataset.id = item.id;

    let quantidadeProduto = document.createElement('td');
    
    quantidadeProduto.innerHTML = item.quantidade;
    quantidadeProduto.dataset.id = item.id + '-quantidade';

    numeroProduto.appendChild(novoProduto);

    numeroProduto.appendChild(quantidadeProduto);

    numeroProduto.appendChild(checkBox(item));

    numeroProduto.appendChild(botaoDeleta(item.id));
    
    lista.appendChild(numeroProduto);
}

//*função para atualizar elementos caso eles existão
function atualizaElemento(item) {
    document.querySelector('[data-id="' + item.id + '-quantidade"]').innerHTML = item.quantidade;
}

function botaoDeleta(id) {
    const creatTd = document.createElement("td");
    const elementoBotao = document.createElement("button");
    elementoBotao.innerText = "X"

    elementoBotao.addEventListener("click", function(){
        deletaElemento(this.parentNode, id)
    })

    creatTd.appendChild(elementoBotao);

    return creatTd
}

function deletaElemento(tag, id) {
    tag.parentNode.remove()

    produtos.splice(produtos.findIndex(elemento => elemento.id === id), 1);
    localStorage.setItem("produtos", JSON.stringify(produtos));
}

function checkBox(item) {
    const creatTd = document.createElement("td");
    const elementoCheckBox = document.createElement("input");
    if (item.checked){
        elementoCheckBox.checked = true;
    }
    elementoCheckBox.type = "checkbox";

    elementoCheckBox.addEventListener("click", function(){
        checked(this.parentNode, item)
    })

    creatTd.appendChild(elementoCheckBox);

    return creatTd
}

function checked(tag, item) {
    const classParent = tag.parentNode.classList;
    const checked = classParent.contains("check");
    item.checked = !checked;
    console.log(item);
    checked ? classParent.remove("check") : classParent.add("check");
    const products = getProducts().map((product) => {
        if (product.id === item.id) {
            product.checked = item.checked;
        } 
        return product
    });
    setProducts(products)
    console.log(classParent)
}