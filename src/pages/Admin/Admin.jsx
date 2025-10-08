import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faBell,
  faBox,
  faShoppingCart,
  faExclamationTriangle,
  faDollarSign,
  faBoxOpen,
  faPlus,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";

import Styles from "./admin.module.css";
import { useState, useEffect } from "react";
import axios from "axios";


export default function Admin() {

  const [produtos, setProdutos] = useState([]);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const [idProduto, setIdProduto] = useState("");


  const [nomeAnterior, setNomeAnterior] = useState("");
  const [codeAnterior, setCodeAnterior] = useState("");
  const [categoryAnterior, setCategoryAnterior] = useState("");
  const [quantityAnterior, setQuantityAnterior] = useState("");
  const [minStockAnterior, setMinStockAnterior] = useState("");
  const [priceAnterior, setPriceAnterior] = useState("");
  const [descriptionAnterior, setDescriptionAnterior] = useState("");



  function openModal() {
    document.querySelector("#productModal").style.display = "flex"
  }

  function fecharModal() {
    document.querySelector("#productModal").style.display = "none"
  }

  function openEditModal(e) {
    document.querySelector("#productEditModal").style.display = "flex"
    let idCompleto = e.currentTarget.id
    let id = idCompleto.split("___")[1]
    setIdProduto(id)

    let nomeAnterior = document.querySelector('#nomeProduto___' + id).innerText
    setNomeAnterior(nomeAnterior)

    let codeAnterior = document.querySelector('#codigoProduto___' + id).innerText
    setCodeAnterior(codeAnterior)

    let categoryAnterior = document.querySelector('#categoriaProduto___' + id).innerText
    setCategoryAnterior(categoryAnterior)

    let quantityAnterior = document.querySelector('#quantidadeProduto___' + id).innerText
    setQuantityAnterior(quantityAnterior)

    let minStockAnterior = document.querySelector('#minStockProduto___' + id).innerText
    setMinStockAnterior(minStockAnterior)

    let priceAnterior = document.querySelector('#priceProduto___' + id).innerText
    let price = priceAnterior.split("R$")[1].trim().replaceAll(",", ".");
    setPriceAnterior(price)

    let descriptionAnterior = document.querySelector('#descriptionProduto___' + id).innerText
    setDescriptionAnterior(descriptionAnterior)
  }

  const stateName = (e) => {
    setNomeAnterior(e.target.value)
  }

  const stateCode = (e) => {
    setCodeAnterior(e.target.value)
  }

  const stateCategory = (e) => {
    setCategoryAnterior(e.target.value)
  }

  const stateQuantity = (e) => {
    setQuantityAnterior(e.target.value)
  }

  const stateMinStock = (e) => {
    setMinStockAnterior(e.target.value)
  }

  const statePrice = (e) => {
    setPriceAnterior(e.target.value)
  }
  const stateDescription = (e) => {
    setDescriptionAnterior(e.target.value)
  }

  function fecharEditModal() {
    document.querySelector("#productEditModal").style.display = "none"
  }

  // requisições HTTP
  const get = async () => {
    let endpoint = "http://127.0.0.1:3000/products/get";
    let resp = await axios.get(endpoint);
    let data = await resp.data
    setProdutos(data)

    let valores = []
    data.map(item => {
      let valor = item.quantity
      valores.push(Number(valor))

    })

    const soma = valores.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
    setTotalProdutos(soma)


    let filtrados = data.filter(item => item.quantity < item.min_stock)
    let estoqueBaixo = filtrados.length
    setLowStock(estoqueBaixo)


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
    setValorTotal(valorFormatado)
  }

  //POST
  const post = async () => {
    let endpoint = "http://127.0.0.1:3000/products/post";

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
      'min_stock': minStock,
      'price': price,
      'description': description
    }

    let resp = await axios.post(endpoint, novoProd);

    window.location.reload()
  }

  //DELETE
  const del = async (e) => {
    let idCompleto = e.currentTarget.id
    let id = idCompleto.split("___")[1]
    let endpoint = `http://127.0.0.1:3000/products/delete/${id}`;
    let resp = await axios.delete(endpoint);

    get()
  }

  //PUT
  const put = async (e) => {
    let idCompleto = e.currentTarget.id
    let id = idCompleto.split("___")[1]
    let endpoint = `http://127.0.0.1:3000/products/put/${id}`;

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
      'min_stock': minStock,
      'price': price,
      'description': description
    }

    let resp = await axios.put(endpoint, novoProd);

    window.location.reload()
  }

  useEffect(() => {
    get()
  }, [])






  return (
    <>
      <header className={Styles.header}>
        <div className={Styles.container}>
          <div className={Styles.headerContent}>
            <div className={Styles.logo}>
              <a href="/">
                <img src="/img/logo_caixa.png" alt="" width="60px" />
              </a>
              <span className={Styles.logoText}>Kontroli</span>
            </div>
            <div className={Styles.headerActions}>

              <div className={Styles.separator}></div>
              <a href="/"> <button className={`${Styles.btn} ${Styles.btnGhost}`}>
                Logout
                <svg
                  className={Styles.icon}
                  fill="none"
                  stroke="white"
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"
                  />
                </svg>
              </button>
              </a>
            </div>
          </div>
        </div>
      </header>



      <div className={Styles.app}>
        <main className={Styles.container}>
          {/* ALERTA */}
          <div id="lowStockAlert" className={Styles.alert}>
            <div className={Styles.alertHeader}>
              <FontAwesomeIcon icon={faBell} />
              <span className={Styles.alertTitle}>Alerta de Estoque</span>
            </div>
            <div className={Styles.alertContent} id="alertContent"></div>
            <div className={Styles.alertBadges} id="alertBadges"></div>
          </div>

          {/* STATS */}
          <div className={Styles.statsGrid}>
            <div className={Styles.statCard}>
              <div className={Styles.statCardContent}>
                <div className={Styles.statInfo}>
                  <h3>Total de Produtos</h3>
                  <p className={Styles.value}>{produtos.length}</p>
                </div>
                <div className={`${Styles.statIcon} ${Styles.statIconBlue}`}>
                  <FontAwesomeIcon icon={faBox} />
                </div>
              </div>
            </div>

            <div className={Styles.statCard}>
              <div className={Styles.statCardContent}>
                <div className={Styles.statInfo}>
                  <h3>Itens em Estoque</h3>
                  <p className={Styles.value}>{totalProdutos}</p>
                </div>
                <div className={`${Styles.statIcon} ${Styles.statIconGreen}`}>
                  <FontAwesomeIcon icon={faShoppingCart} />
                </div>
              </div>
            </div>

            <div className={Styles.statCard}>
              <div className={Styles.statCardContent}>
                <div className={Styles.statInfo}>
                  <h3>Estoque Baixo</h3>
                  <p className={Styles.value} id="lowStockCount">
                    { lowStock}
                  </p>
                </div>
                <div className={`${Styles.statIcon} ${Styles.statIconRed}`}>
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                </div>
              </div>
            </div>

            <div className={Styles.statCard}>
              <div className={Styles.statCardContent}>
                <div className={Styles.statInfo}>
                  <h3>Valor Total</h3>
                  <p className={Styles.value} id="totalValue">{valorTotal}</p>
                </div>
                <div className={`${Styles.statIcon} ${Styles.statIconPurple}`}>
                  <FontAwesomeIcon icon={faDollarSign} />
                </div>
              </div>
            </div>
          </div>

          {/* CONTROLS */}
          <div className={Styles.controls}>
            <div className={Styles.searchContainer}>
              <FontAwesomeIcon
                // icon={faSearch}
                className={Styles.searchIcon}
              />
              <input
                type="text"
                id="searchInput"
                className={Styles.searchInput}
                placeholder="Buscar por nome ou código..."
              />
            </div>

            <div className={Styles.selectContainer}>
              <select id="categoryFilter" className={Styles.select}>
                <option value="all">Todas categorias</option>
              </select>
            </div>

            <button className={`${Styles.btn} ${Styles.btnSecondary}`}>
              <FontAwesomeIcon icon={faChartBar} />
              Relatórios
            </button>

            <button
              id="addProductBtn" className={`${Styles.btn} ${Styles.btnPrimary}`} onClick={openModal}>
              <FontAwesomeIcon icon={faPlus} />
              Adicionar Produto
            </button>
          </div>

          {/* TABLE */}
          <div id={Styles.productsContainer}>
            <div className={Styles.tableContainer}>
              <table className={Styles.table}>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Código</th>
                    <th>Categoria</th>
                    <th>Quantidade</th>
                    <th>Est. Mín.</th>
                    <th id="precoProduto">Preço</th>
                    <th>Status</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody id="productsTableBody">



                  {produtos.map(item => {

                    let alerta = (
                      <img width="20" height="20" src="https://img.icons8.com/ios-filled/20/FA5252/error--v1.png" alt="error--v1" />)

                    let status = ''
                    let quantidade = item.quantity
                    let minStock = item.min_stock



                    let test = Number(item.price);
                    const valorFormatado = test.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2,
                    })

                    quantidade < minStock ? status = alerta : status = (<p className={Styles.estoque}>Em estoque</p>)


                    return (
                      <tr className={Styles.tableRow}>
                        <td>
                          <p id={`nomeProduto___${item.id}`}>{item.name}</p>
                          <p className={Styles.descricao} id={`descriptionProduto___${item.id}`}>{item.description}</p>
                        </td>
                        <td id={`codigoProduto___${item.id}`}>{item.code}</td>
                        <td id={`categoriaProduto___${item.id}`}>{item.category}</td>
                        <td id={`quantidadeProduto___${item.id}`}>{item.quantity}</td>
                        <td id={`minStockProduto___${item.id}`}>{item.min_stock}</td>
                        <td id={`priceProduto___${item.id}`}>{valorFormatado}</td>
                        <td>{status}</td>
                        
                        <td className={Styles.editDeleteBtn}>
                          <button type="button" className={`${Styles.btn} ${Styles.btnSm}`} onClick={openEditModal} id={`editProduct___${item.id}`}>Editar</button>
                          <button type="button" className={`${Styles.btn} ${Styles.btnDanger} ${Styles.btnSm}`} id={`deleteProduct___${item.id}`} onClick={del}>Excluir</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>

              </table>
            </div>
          </div>

          {/* EMPTY STATE */}
          <div id="emptyState" className={Styles.emptyState}>
            <div className={Styles.emptyStateIcon}>
              <FontAwesomeIcon icon={faBoxOpen} />
            </div>
            <h3 className={Styles.emptyStateTitle}>Nenhum produto encontrado</h3>
            <p className={Styles.emptyStateDescription}>
              Comece adicionando produtos ao seu estoque
            </p>
          </div>
        </main>

        {/* MODAL - ADICIONAR PRODUTO */}
        <div id="productModal" className={Styles.modalOverlay}>
          <div className={Styles.modal}>
            <div className={Styles.modalHeader}>
              <h2 className={Styles.modalTitle} id="modalTitle">
                Adicionar Novo Produto
              </h2>
            </div>

            <div id="productForm">
              <div className={Styles.modalContent}>
                <div className={Styles.formRow}>
                  <div className={Styles.formGroup}>
                    <label htmlFor="productName" className={Styles.formLabel}>
                      Nome do Produto *
                    </label>
                    <input
                      type="text"
                      id="productName"
                      className={Styles.formInput}
                      placeholder="Ex: Notebook Dell"
                      required
                    />
                  </div>

                  <div className={Styles.formGroup}>
                    <label htmlFor="productCode" className={Styles.formLabel}>
                      Código *
                    </label>
                    <input
                      type="text"
                      id="productCode"
                      className={Styles.formInput}
                      placeholder="Ex: NB001"
                      required
                    />
                  </div>
                </div>

                <div className={Styles.formGroup}>
                  <label
                    htmlFor="productCategory"
                    className={Styles.formLabel}
                  >
                    Categoria *
                  </label>
                  <select
                    id="productCategory"
                    className={Styles.formSelect}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Eletrônicos">Eletrônicos</option>
                    <option value="Periféricos">Periféricos</option>
                    <option value="Móveis">Móveis</option>
                    <option value="Roupas">Roupas</option>
                    <option value="Livros">Livros</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Alcoólicos">Alcoólicos</option>
                  </select>
                </div>

                <div className={Styles.formRow3}>
                  <div className={Styles.formGroup}>
                    <label
                      htmlFor="productQuantity"
                      className={Styles.formLabel}
                    >
                      Quantidade *
                    </label>
                    <input
                      type="number"
                      id="productQuantity"
                      className={Styles.formInput}
                      min="0"
                      required
                    />
                  </div>

                  <div className={Styles.formGroup}>
                    <label
                      htmlFor="productMinStock"
                      className={Styles.formLabel}
                    >
                      Estoque Mínimo *
                    </label>
                    <input
                      type="number"
                      id="productMinStock"
                      className={Styles.formInput}
                      min="0"
                      required
                    />
                  </div>


                  <div className={Styles.formGroup}>
                    <label
                      htmlFor="productPrice"
                      className={Styles.formLabel}
                    >
                      Preço (R$) *
                    </label>
                    <input
                      type="number"
                      id="productPrice"
                      className={Styles.formInput}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className={Styles.formGroup}>
                  <label
                    htmlFor="productDescription"
                    className={Styles.formLabel}
                  >
                    Descrição
                  </label>
                  <textarea
                    id="productDescription"
                    className={Styles.formTextarea}
                    placeholder="Descrição opcional do produto..."
                  ></textarea>
                </div>
              </div>

              <div className={Styles.modalFooter}>
                <button
                  type="button"
                  id="cancelBtn"
                  className={`${Styles.btn} ${Styles.btnSecondary}`}
                  onClick={fecharModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="saveBtn"
                  className={`${Styles.btn} ${Styles.btnPrimary}`}
                  onClick={post}
                >
                  Adicionar Produto
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL - EDITAR PRODUTO */}
        <div id="productEditModal" className={Styles.modalOverlay}>
          <div className={Styles.editModal}>
            <div className={Styles.modalHeader}>
              <h2 className={Styles.modalTitle} id="modalTitle">
                Editar Produto
              </h2>
            </div>
            <div id="productForm">
              <div className={Styles.modalContent}>
                <div className={Styles.formRow}>
                  <div className={Styles.formGroup}>
                    <label htmlFor="productName" className={Styles.formLabel}>
                      Nome do Produto *
                    </label>
                    <input
                      type="text"
                      id="productNameEdit"
                      value={nomeAnterior}
                      onChange={stateName}
                      className={Styles.formInput}
                      placeholder="Ex: Notebook Dell"
                      required
                    />
                  </div>

                  <div className={Styles.formGroup}>
                    <label htmlFor="productCode" className={Styles.formLabel}>
                      Código *
                    </label>
                    <input
                      type="text"
                      id="productCodeEdit"
                      value={codeAnterior}
                      onChange={stateCode}
                      className={Styles.formInput}
                      placeholder="Ex: NB001"
                      required
                    />
                  </div>
                </div>

                <div className={Styles.formGroup}>
                  <label
                    htmlFor="productCategory"
                    className={Styles.formLabel}
                  >
                    Categoria *
                  </label>
                  <select
                    id="productCategoryEdit"
                    value={categoryAnterior}
                    onChange={stateCategory}
                    className={Styles.formSelect}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Eletrônicos">Eletrônicos</option>
                    <option value="Periféricos">Periféricos</option>
                    <option value="Móveis">Móveis</option>
                    <option value="Roupas">Roupas</option>
                    <option value="Livros">Livros</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Alcoólicos">Alcoólicos</option>
                  </select>
                </div>

                <div className={Styles.formRow3}>
                  <div className={Styles.formGroup}>
                    <label
                      htmlFor="productQuantity"
                      className={Styles.formLabel}
                    >
                      Quantidade *
                    </label>
                    <input
                      type="number"
                      id="productQuantityEdit"
                      value={quantityAnterior}
                      onChange={stateQuantity}
                      className={Styles.formInput}
                      min="0"
                      required
                    />
                  </div>

                  <div className={Styles.formGroup}>
                    <label
                      htmlFor="productMinStock"
                      className={Styles.formLabel}
                    >
                      Estoque Mínimo *
                    </label>
                    <input
                      type="number"
                      id="productMinStockEdit"
                      value={minStockAnterior}
                      onChange={stateMinStock}
                      className={Styles.formInput}
                      min="0"
                      required
                    />
                  </div>


                  <div className={Styles.formGroup}>
                    <label
                      htmlFor="productPrice"
                      className={Styles.formLabel}
                    >
                      Preço (R$) *
                    </label>
                    <input
                      type="number"
                      id="productPriceEdit"
                      value={priceAnterior}
                      onChange={statePrice}
                      className={Styles.formInput}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className={Styles.formGroup}>
                  <label
                    htmlFor="productDescription"
                    className={Styles.formLabel}
                  >
                    Descrição
                  </label>
                  <textarea
                    id="productDescriptionEdit"
                    value={descriptionAnterior}
                    onChange={stateDescription}
                    className={Styles.formTextarea}
                    placeholder="Descrição opcional do produto..."
                  ></textarea>
                </div>
              </div>

              <div className={Styles.modalFooter}>
                <button
                  type="button"
                  id="cancelBtn"
                  className={`${Styles.btn} ${Styles.btnSecondary}`}
                  onClick={fecharEditModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id={`saveBtn___${idProduto}`}
                  className={`${Styles.btn} ${Styles.btnPrimary}`}
                  onClick={put}
                >
                  Editar Produto
                </button>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}
