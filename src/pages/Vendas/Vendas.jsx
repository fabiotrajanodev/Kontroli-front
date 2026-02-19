import { useEffect, useState } from "react";
import axios from "axios";
import Styles from "./Vendas.module.css";

import Navbar from "../components/Navbar/Navbar";


export default function Vendas() {
    const [produtos, setProdutos] = useState([]);
    const [seller, setSeller] = useState([]);
    const [busca, setBusca] = useState("");
    const [carrinho, setCarrinho] = useState([]);

    const [sell, setSell] = useState([]);

    // code, price, quantity, seller, date
    const get = async () => {
        let endpoint = "http://127.0.0.1:3000/products/get";
        let resp = await axios.get(endpoint);
        setProdutos(resp.data);

        let endpointSeller = "http://127.0.0.1:3000/users/get";
        let respSeller = await axios.get(endpointSeller);
        setSeller(respSeller.data);

        console.log(respSeller.data);

    };

    const search = (e) => {
        setBusca(e.target.value.toLowerCase());
    };



    const addCarrinho = (produto) => {
        const existe = carrinho.find((item) => item.id === produto.id);

        if (existe) {
            setCarrinho(
                carrinho.map((item) =>
                    item.id === produto.id
                        ? { ...item, quantidade: item.quantidade + 1 }
                        : item
                )
            );
            setSell(existe)
        } else {
            setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
        }


    };

    //remove somente um produto
    const removeCarrinho = (id) => {
        setCarrinho(
            carrinho.reduce((acc, item) => {
                // Se for o item a ser removido/reduzido
                if (item.id === id) {
                    // Se a quantidade for maior que 1, diminui 1 e mantém no carrinho
                    if (item.quantidade > 1) {
                        acc.push({ ...item, quantidade: item.quantidade - 1 });
                    }
                    // Se a quantidade for 1, o item NÃO é adicionado ao 'acc', removendo-o.
                } else {
                    // Se não for o item alvo, mantém no carrinho
                    acc.push(item);
                }
                return acc;
            }, [])
        );
    };

    const limparCarrinho = () => {
        setCarrinho([]);
    };

    const produtosFiltrados = produtos.filter((item) =>
        item.name.toLowerCase().includes(busca) ||
        String(item.code).includes(busca)
    );


    useEffect(() => {
        get();
    }, []);

    // ✅ Cálculo do total do carrinho
    const valorTotal = carrinho.reduce(
        (total, item) => total + item.price * item.quantidade,
        0
    );

    const postVenda = async () => {
        let endpoint = "http://127.0.0.1:3000/report/post";

        if (carrinho.length === 0) {
            alert("O carrinho está vazio. Adicione produtos para finalizar a venda.");
            return;
        }

        let vendedor = document.getElementById("searchSeller").value;

        for (let i = 0; i < carrinho.length; i++) {
            let venda = carrinho[i];

            let novaVenda = {
                product_name: venda.name,
                price: venda.price,
                quantity: venda.quantidade,
                seller: vendedor,
                date: new Date().toISOString().slice(0, 10)
            };

            let editQuantity = venda.quantity - venda.quantidade

            let endpointPut = `http://127.0.0.1:3000/products/put/${venda.id}`;

            let updateProduct = {
                name: venda.name,
                code: venda.code,
                quantity: editQuantity,
                min_stock: venda.min_stock,
                price: venda.price,
                description: venda.description,
                category_id: venda.category_id
            };

            let resp = await axios.post(endpoint, novaVenda);
            let respPut = await axios.put(endpointPut, updateProduct);


        }
        window.location.reload();


    }



    return (
        <>
            <Navbar />

            <main>
                <div className={Styles.mainContainer}>

                    {/* BUSCA */}
                    <div className={Styles.card}>
                        <div className={Styles.cardHeader}>
                            <h2>Buscar Produtos</h2>
                        </div>

                        <div className={Styles.cardBody}>
                            <input
                                type="text"
                                placeholder="Digite o nome ou código do produto..."
                                onKeyUp={search}
                            />


                            <ul className={Styles.listaProdutos}>
                                {busca.length > 0 && produtosFiltrados.map((item) => (
                                    <li key={item.id} className={Styles.itemProduto}>
                                        <span>
                                            {item.name} - R$ {item.price}
                                        </span>

                                        <button
                                            className={Styles.btnAdd}
                                            onClick={() => addCarrinho(item)}
                                        >
                                            Adicionar Produto
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <select name="" id="searchSeller">
                                <option value="">Selecione o Vendedor</option>
                                {seller.map(item => {
                                    return (
                                        <option key={item.id} value={`${item.name} ${item.last_name}`}>
                                            {item.name} {item.last_name}
                                        </option>
                                    );
                                })}
                            </select>

                        </div>
                    </div>

                    {/* CARRINHO */}
                    <div className={`${Styles.card} ${Styles.cart}`}>
                        <div className={Styles.cardHeader}>
                            <h2>Carrinho de Compras</h2>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={Styles.icon}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13a1 1 0 100 2h10a1 1 0 100-2M9 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"
                                />
                            </svg>
                            <button
                                className={Styles.btnClear}
                                onClick={limparCarrinho}
                            >
                                Limpar
                            </button>
                        </div>

                        <div className={Styles.cardBody} id="cart-items">
                            {carrinho.length === 0 ? (
                                <p>O carrinho está vazio...</p>
                            ) : (
                                carrinho.map((item) => (
                                    <div key={item.id} className={Styles.itemCarrinho}>
                                        <span className={Styles.itemDetalhes}>
                                            {item.name} - R$ {item.price} — {item.quantidade}x
                                        </span>

                                        <button className={Styles.btnRemove} onClick={() => removeCarrinho(item.id)} >
                                            &times;
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* ✅ TOTAL ACIMA DO BOTÃO */}
                        <div className={Styles.cartFooter}>
                            <div className={Styles.total}>
                                Total: R$ {valorTotal.toFixed(2)}
                            </div>
                            <button
                                onClick={postVenda} // CORREÇÃO: Passa a referência da função
                                className={Styles.btnFinish}
                                disabled={carrinho.length === 0} // Desabilita se o carrinho estiver vazio
                            >
                                Finalizar Venda
                            </button>
                        </div>
                    </div>

                </div>
            </main>
        </>
    );
}


