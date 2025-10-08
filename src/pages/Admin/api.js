let url = "https://689e79853fed484cf87738b7.mockapi.io/Produtos"

async function produtos() {
    let response = await fetch(url)
    let data = await response.json()


    // TOTAL DE PRODUTOS CADASTRADOS
    let totalEstoque = document.querySelector("#totalProducts")
    let totalProd = data.length
    let htmlTotalEstoque = `${totalProd}`
    totalEstoque.innerHTML += htmlTotalEstoque



    //  QUANTIDADE DE PRODUTOS EM ESTOQUE
    let valores = []
    data.map(item => {
        let valor = item.quantity
        valores.push(Number(valor))

    })

    const soma = valores.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);

    let totalItens = document.querySelector("#totalItems")
    let htmlTotalProdutos = `<p>${soma}</p>`
    totalItens.innerHTML = htmlTotalProdutos




    // TOTAL DE PRODUTOS COM ESTOQUE BAIXO
    let lowStockHtml = document.querySelector("#lowStockCount")
    let filtrados = data.filter(item => item.quantity < item.minStock)
    let estoqueBaixo = filtrados.length
    let htmlEstoqueBaixo = `<p>${estoqueBaixo}</p>`
    lowStockHtml.innerHTML = htmlEstoqueBaixo


    // VALOR TOTAL EM $
    let valoresDinheiro = []
    data.map(item => {
        let valorDinheiro = item.price
        valoresDinheiro.push(Number(valorDinheiro))

    })

    const somaDinheiro = valoresDinheiro.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);

    const valortTotal = somaDinheiro;
    const valorFormatado = valortTotal.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    })

    let totalDinheiro = document.querySelector("#totalValue")
    let htmlTotalDinheiro = `<p>${valorFormatado}</p>`
    totalDinheiro.innerHTML = htmlTotalDinheiro




    // APARECER OS PRODUTOS DA TELA COMO TABELA
    for (let i = 0; i < data.length; i++) {
        let cadaProd = data[i]
        let container = document.querySelector("#productsTableBody")

        let alerta = `
        <img width="20" height="20" src="https://img.icons8.com/ios-filled/20/FA5252/error--v1.png" alt="error--v1"/>`

        let status = ''
        let quantidade = cadaProd.quantity
        let minStock = cadaProd.minStock



        let test = Number(cadaProd.price);
        const valorFormatado = test.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        })

        quantidade < minStock ? status = alerta : status = `<p style="font-weight: bold; color: green;">Em estoque</p>`

        let html = `
            <tr>
                <td>
                <p id="produto___${cadaProd.id}">${cadaProd.name}</p>
                    <p class="descricao">${cadaProd.description}</p>
                </td>
                <td>${cadaProd.code}</td>
                <td>${cadaProd.category}</td>
                <td>${cadaProd.quantity}</td>
                <td>${cadaProd.minStock}</td>
                <td id="precoProduto">${valorFormatado}</td>
                <td>${status}</td>
                <td>
                    <button onclick="openEditModal('${cadaProd.id}')">Editar</button>
                    <button onclick="deletaProduto('${cadaProd.id}')">Excluir</button>
                </td>
                
            </tr>`
        container.innerHTML += html
    }
}
produtos()


async function adicionaProduto() {

    let name = document.querySelector("#productName").value
    let code = document.querySelector("#productCode").value
    let category = document.querySelector("#productCategory").value
    let quantity = document.querySelector("#productQuantity").value
    let minStock = document.querySelector("#productMinStock").value
    let price = document.querySelector("#productPrice").value
    let description = document.querySelector("#productDescription").value


    let novoProd = {
        'name': name,
        'code': code,
        'category': category,
        'quantity': quantity,
        'minStock': minStock,
        'price': price,
        'description': description
    }
    let response = await fetch(url, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoProd)
    })
    window.location.reload()

}



//deletar
async function deletaProduto(id) {
    let response = await fetch(`${url}/${id}`, {
        method: "DELETE"
    })
    window.location.reload()
}




function openModal() {
    document.querySelector("#productModal").style.display = "flex"
}


function fecharModal() {
    document.querySelector("#productModal").style.display = "none"

}


function openEditModal(id) {
    document.querySelector("#productEditModal").style.display = "flex"
    getId(id)
}


function fecharEditModal() {
    document.querySelector("#productEditModal").style.display = "none"

}



//PUT
async function getId(id) {
    document.querySelector("#getId").value = id

    let nomeAnterior = document.querySelector('#produto___' + id).innerText
    document.querySelector("#productNameEdit").value = nomeAnterior

    let codeAnterior = document.querySelector('#produto___' + id).innerText
    document.querySelector("#productCodeEdit").value = codeAnterior

    let categoryAnterior = document.querySelector('#produto___' + id).innerText
    document.querySelector("#productCategoryEdit").value = categoryAnterior

    let quantityAnterior = document.querySelector('#produto___' + id).innerText
    document.querySelector("#productQuantityEdit").value = quantityAnterior

    let minStockAnterior = document.querySelector('#produto___' + id).innerText
    document.querySelector("#productMinStockEdit").value = minStockAnterior

    let priceAnterior = document.querySelector('#produto___' + id).innerText
    document.querySelector("#productPriceEdit").value = priceAnterior

    let descriptionAnterior = document.querySelector('#produto___' + id).innerText
    document.querySelector("#productDescriptionEdit").value = descriptionAnterior
}

async function updateProduct() {
    let id = document.querySelector("#getId").value

    let name = document.querySelector("#productNameEdit").value
    let code = document.querySelector("#productCodeEdit").value
    let category = document.querySelector("#productCategoryEdit").value
    let quantity = document.querySelector("#productQuantityEdit").value
    let minStock = document.querySelector("#productMinStockEdit").value
    let price = document.querySelector("#productPriceEdit").value
    let description = document.querySelector("#productDescriptionEdit").value

    let novoProd = {
        'name': name,
        'code': code,
        'category': category,
        'quantity': quantity,
        'minStock': minStock,
        'price': price,
        'description': description
    }

    let response = await fetch(`${url}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProd)
    })
    window.location.reload()

}



// SEARCH BAR
async function search(){
inputPesquisa.addEventListener("input", (evento) => {
    const textoBusca = evento.target.value.toLowerCase();

    listaItens.forEach((item) => {
        const textoItem = item.textContent.toLowerCase(); // Texto do item da lista

        if (textoItem.includes(textoBusca)) { // Verifica se o item inclui o texto da busca
            item.style.display = "list-item"; // Mostra o item
        } else {
            item.style.display = "none"; // Esconde o item
        }
    });
})

}