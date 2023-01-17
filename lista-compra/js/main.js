const form = document.getElementById("addProduct");
const list = document.getElementById("buyList");
const products = JSON.parse(localStorage.getItem("products")) || [];
const reset = document.getElementById("reset");

function getProducts() {
    return products;
}

function setProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

reset.addEventListener('click', () => {
    if (confirm("Tem certeza que deseja resetar essa lista?")){
    localStorage.clear();
    window.location.reload();
    }
})


products.forEach( (element) => {
    createNewElement(element);
});

form.addEventListener("submit", (event) => {
    event.preventDefault()
    
    let product = event.target.elements['product'];
    let quantity = event.target.elements['quantity'];
    
    let exist = products.find(element => element.product === product.value);
    
    let currentProduct = {
        "product": product.value,
        "quantity": quantity.value
    }

    if (exist) {
        currentProduct.id = exist.id;

        reloadElement(currentProduct);

        products[products.findIndex(element => element.id === exist.id)] = currentProduct;
    } else {
        currentProduct.id = products[products.length -1] ? (products[products.length-1]).id + 1 : 0;
        createNewElement(currentProduct);
        products.push(currentProduct);
    }

    setProducts(products);
    
    product.value = "";
    quantity.value = "";
})

function createNewElement(item) {
    let productTr = document.createElement('tr');
    productTr.classList.add("item");
    if (item.checked){
        productTr.classList.add("check");

    }

    let nameProduct = document.createElement('td');
    
    nameProduct.innerHTML = item.product;
    nameProduct.dataset.id = item.id;

    let quantityProduct = document.createElement('td');
    
    quantityProduct.innerHTML = item.quantity;
    quantityProduct.dataset.id = item.id + '-quantity';

    productTr.appendChild(checkBox(item));
    productTr.appendChild(nameProduct);
    productTr.appendChild(quantityProduct);
    productTr.appendChild(deletButton(item.id));
    
    list.appendChild(productTr);
}

function reloadElement(item) {
    document.querySelector('[data-id="' + item.id + '-quantity"]').innerHTML = item.quantity;
}

function deletButton(id) {
    const creatTd = document.createElement("td");
    const elementButton = document.createElement("button");
    elementButton.innerText = "X"

    elementButton.addEventListener("click", function(){
        elementDelet(this.parentNode, id)
    })

    creatTd.appendChild(elementButton);

    return creatTd
}

function elementDelet(tag, id) {
    tag.parentNode.remove()

    products.splice(products.findIndex(element => element.id === id), 1);
    setProducts(products);
}

function checkBox(item) {
    const creatTd = document.createElement("td");
    const elementCheckBox = document.createElement("input");
    if (item.checked){
        elementCheckBox.checked = true;
    }
    elementCheckBox.type = "checkbox";

    elementCheckBox.addEventListener("click", function(){
        checked(this.parentNode, item)
    })

    creatTd.appendChild(elementCheckBox);

    return creatTd
}

function checked(tag, item) {
    const classParent = tag.parentNode.classList;
    const checked = classParent.contains("check");
    item.checked = !checked;
    checked ? classParent.remove("check") : classParent.add("check");
    const products = getProducts().map((product) => {
        if (product.id === item.id) {
            product.checked = item.checked;
        } 
        return product
    });
    setProducts(products)
}