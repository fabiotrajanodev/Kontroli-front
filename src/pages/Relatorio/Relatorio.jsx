import React, { useState, useMemo, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Styles from "./Relatorio.module.css"
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";




export default function Report() {
    const [valorTotal, setvalorTotal] = useState(0);
    const [report, setReport] = useState([]);
    const [totalVendas, setTotalVendas] = useState(0);
    const [filtrados, setFiltrados] = useState(0);
    const [faturamentoDia, setFaturamentoDia] = useState(0);
    // ADIÇÃO DO CÓDIGO 1: Cópia original dos dados e estado de filtro de vendedor
    const [reportOriginal, setReportOriginal] = useState([]);
    const [vendedorFiltro, setVendedorFiltro] = useState([]);


    const [filtro, setFiltro] = useState("7");
    const [produtoFiltro, setProdutoFiltro] = useState("");


    // requisições HTTP
    const get = async (diasFiltro = "7") => {
        let endpoint = "https://kontroli-back.onrender.com/report/get";
        let resp = await axios.get(endpoint);
        let data = await resp.data

        setReportOriginal(data); // ADIÇÃO DO CÓDIGO 1: Guardar cópia intacta

        console.log(data)
        // Calcular data limite baseado no filtro
        let hoje = new Date();
        let dataLimite = new Date(hoje);
        dataLimite.setDate(dataLimite.getDate() - parseInt(diasFiltro));
        // ***************************************
        // Filtrar dados por período
        let dadosFiltrados = data.filter(item => {
            // Ajuste para garantir que a comparação seja feita com o dia inteiro (meia-noite)
            let itemDate = new Date(item.date.slice(0, 10));
            itemDate.setHours(0, 0, 0, 0); // Ajusta para meia-noite
            dataLimite.setHours(0, 0, 0, 0); // Ajusta para meia-noite

            return itemDate >= dataLimite;
        });

        setReport(dadosFiltrados)

        let valores = []
        dadosFiltrados.map(item => {
            let quantidade = item.quantity
            let valor = item.price

            let total = quantidade * valor
            valores.push(Number(total))


        })

        const soma = valores.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
        setTotalVendas(soma)

        // ADIÇÃO DO CÓDIGO 1: O cálculo do valor total com toLocaleString no final do get original

        let valoresDias = []
        dadosFiltrados.map(item => {
            let dateValue = item.date
            valoresDias.push(dateValue.slice(0, 10))
        })


        let date = new Date()

        let dia = date.getDate()
        let mes = date.getMonth() + 1
        let ano = date.getFullYear()

        let diaAtual = `${ano}-${mes < 10 ? '0' + mes : mes}-${dia < 10 ? '0' + dia : dia}`
        let valoresDoDia = valoresDias.filter(item => item === diaAtual)
        // O Código 1 pega apenas o primeiro item, mas o filtro posterior usa 'valoresDoDia'
        // Se 'valoresDoDia' for um array, 'valoresDoDia[0]' é a data, caso exista.
        valoresDoDia = valoresDoDia[0]

        let filtrados = valoresDias.filter(item => item == valoresDoDia)

        let dadosAtualizados = dadosFiltrados.map(item => {
            return {
                date: item.date.slice(0, 10),
                product: item.product,
                seller: item.seller,
                price: item.price,
                quantity: item.quantity
            }
        })

        let filtrarDados = dadosAtualizados.filter(item => item.date == valoresDoDia)

        let faturamentoDoDia = []
        filtrarDados.map(item => {
            let quantidade = item.quantity
            let valor = item.price

            let total = quantidade * valor
            faturamentoDoDia.push(Number(total))


        })

        const somaFaturamentoDia = faturamentoDoDia.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);


        setFaturamentoDia(somaFaturamentoDia)

        console.log(somaFaturamentoDia)

        setFiltrados(filtrados)

        // A remoção do valorFormatado daqui é para usar o useEffect para calcular o total
        // para que a exibição do Faturamento Total se adapte ao filtro de período
    }


    // ADIÇÃO DO CÓDIGO 1: Requisição para pegar vendedores
    const getSeller = async () => {
        const endpoint = "https://kontroli-back.onrender.com/users/get";
        const resp = await axios.get(endpoint);
        setVendedorFiltro(resp.data)
    }

    // ADIÇÃO DO CÓDIGO 1: Lógica de filtro por vendedor
    const searchSeller = (e) => {
        const vendedor = e.target.value;

        if (vendedor === "selecionarVendedor") {
            // Re-aplica o filtro de período, mantendo o produto se houver
            const dadosFiltradosPorPeriodo = reportOriginal.filter(item => {
                let hoje = new Date();
                let dataLimite = new Date(hoje);
                dataLimite.setDate(dataLimite.getDate() - parseInt(filtro));
                dataLimite.setHours(0, 0, 0, 0);
                let itemDate = new Date(item.date.slice(0, 10));
                itemDate.setHours(0, 0, 0, 0);
                return itemDate >= dataLimite;
            });

            setReport(dadosFiltradosPorPeriodo.filter(item =>
                item.product_name.toLowerCase().includes(produtoFiltro.toLowerCase())
            ));
            return;
        }

        // Filtra primeiro pelo período e depois pelo vendedor
        const dadosFiltradosPorPeriodo = reportOriginal.filter(item => {
            let hoje = new Date();
            let dataLimite = new Date(hoje);
            dataLimite.setDate(dataLimite.getDate() - parseInt(filtro));
            dataLimite.setHours(0, 0, 0, 0);
            let itemDate = new Date(item.date.slice(0, 10));
            itemDate.setHours(0, 0, 0, 0);
            return itemDate >= dataLimite;
        });

        const filtrados = dadosFiltradosPorPeriodo.filter(
            item => item.seller === vendedor &&
                item.product_name.toLowerCase().includes(produtoFiltro.toLowerCase())
        );

        setReport(filtrados);
    };


    useEffect(() => {
        get()
        getSeller()
    }, [])

    useEffect(() => {
        get(filtro);
    }, [filtro]);

    useEffect(() => {
        if (report.length > 0) {
            const total = report.reduce((soma, item) => {
                return soma + item.price * item.quantity;
            }, 0);
            setvalorTotal(total);
        } else {
            setvalorTotal(0);
        }
    }, [report]);


    const searchProduct = (e) => {
        let inputValue = e.target.value;
        setProdutoFiltro(inputValue);

        // A filtragem de produtos será aplicada no .map da tabela para usar o report já filtrado por período/vendedor.
        // Se você quiser que o filtro de produto também recalcule o total, é melhor fazer o filtro aqui e atualizar o 'report'.

        // Re-aplica filtro de vendedor e produto sobre o report original filtrado por período
        const dadosFiltradosPorPeriodo = reportOriginal.filter(item => {
            let hoje = new Date();
            let dataLimite = new Date(hoje);
            dataLimite.setDate(dataLimite.getDate() - parseInt(filtro));
            dataLimite.setHours(0, 0, 0, 0);
            let itemDate = new Date(item.date.slice(0, 10));
            itemDate.setHours(0, 0, 0, 0);
            return itemDate >= dataLimite;
        });

        // Pega o vendedor selecionado, se houver
        const vendedorSelecionado = document.getElementById('vendedorFilter').value;

        let filtradosFinais = dadosFiltradosPorPeriodo.filter(item => {
            const matchesProduct = item.product_name.toLowerCase().includes(inputValue.toLowerCase());
            const matchesSeller = vendedorSelecionado === "selecionarVendedor" || item.seller === vendedorSelecionado;
            return matchesProduct && matchesSeller;
        });

        setReport(filtradosFinais);
    }


    return (
        <>
            <Navbar/>




            <main className={Styles.main}>

                <div className={Styles.cardsGrid}>
                    <div className={Styles.card}>
                        <div className={Styles.cardInner}>
                            <div>
                                <p className={Styles.cardLabel}>Vendas do Dia</p>
                                <p className={Styles.cardValue}>{filtrados.length}</p>
                            </div>
                            <div className={Styles.cardIconBlue}>🛒</div>
                        </div>
                    </div>

                    <div className={Styles.card}>
                        <div className={Styles.cardInner}>
                            <div>
                                <p className={Styles.cardLabel}>Faturamento do Dia</p>
                                <p className={Styles.cardValue}>
                                    R$ {faturamentoDia.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className={Styles.cardIconGreen}>💲</div>
                        </div>
                    </div>

                    <div className={Styles.card}>
                        <div className={Styles.cardInner}>
                            <div>
                                <p className={Styles.cardLabel}>Total de Vendas</p>
                                <p className={Styles.cardValue}>{report.length}</p>
                            </div>
                            <div className={Styles.cardIconOrange}>📦</div>
                        </div>
                    </div>

                    <div className={Styles.card}>
                        <div className={Styles.cardInner}>
                            <div>
                                <p className={Styles.cardLabel}>Faturamento Total</p>
                                <p className={Styles.cardValue}>
                                    {valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </p>
                            </div>
                            <div className={Styles.cardIconPurple}>📈</div>
                        </div>
                    </div>
                </div>

                <div className={Styles.filterBox}>
                    <div className={Styles.filtersGrid}>
                        <div>
                            <label className={Styles.label}>Período:</label>
                            <select className={Styles.select} onChange={(e) => setFiltro(e.target.value)}>
                                <option value="7">Últimos 7 dias</option>
                                <option value="15">Últimos 15 dias</option>
                                <option value="30">Últimos 30 dias</option>
                            </select>
                        </div>

                        <div>
                            <label className={Styles.label}>Vendedor:</label>
                            {/* ADIÇÃO DO CÓDIGO 1: Dropdown de vendedor */}
                            <select id="vendedorFilter" className={Styles.select} onChange={searchSeller}>
                                <option value="selecionarVendedor">Selecionar Vendedor</option>
                                {
                                    vendedorFiltro.map(item => {
                                        return <option key={item.id} value={`${item.name} ${item.last_name}`}>{item.name} {item.last_name}</option>
                                    })
                                }
                            </select>
                        </div>

                        <div>
                            <label className={Styles.label}>Produto:</label>
                            <input
                                className={Styles.input}
                                placeholder="Buscar produto..."
                                value={produtoFiltro}
                                onChange={searchProduct} // Ajuste para usar a nova função
                            />
                        </div>
                    </div>
                    {/*                     <div className={Styles.exportButtons}>
                        <button onClick={exportarExcel} className={Styles.btnExcel}>
                            ⤓ Exportar Excel
                        </button>
                        <button onClick={exportarPDF} className={Styles.btnPDF}>
                            📝 Exportar PDF
                        </button>
                    </div> */}
                </div>

                <div className={Styles.tableBox}>
                    <table className={Styles.table}>
                        <thead>
                            <tr className={Styles.tableHeadRow}>
                                <th className={Styles.thLeft}>Data</th>
                                <th className={Styles.thLeft}>Produto</th>
                                <th className={Styles.thLeft}>Vendedor</th>
                                <th className={` ${Styles.thRight} ${Styles.quantity}`}>Quantidade</th>
                                <th className={Styles.thRight}>Valor</th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* Removida a lógica de filtro inline que existia no Código 2,
                            pois a lógica foi movida para searchProduct e searchSeller, atualizando o state 'report' */}
                            {report.map(item => {
                                let price = Number(item.price)

                                let data = item.date
                                return (<tr key={item.id}>
                                    <td className={Styles.tdGray}>{data.slice(0, 10)}</td>
                                    <td className={Styles.td}>{item.product_name}</td>
                                    <td className={Styles.tdGray}>{item.seller}</td>
                                    {/* ADIÇÃO DO CÓDIGO 1: Coluna Quantidade */}
                                    <td className={` ${Styles.tdGray} ${Styles.gray} `}>{item.quantity}</td>
                                    <td className={Styles.tdRight}> {price.toLocaleString("pt-br", { style: "currency", currency: "BRL" })}
                                    </td>
                                </tr>)
                            })}
                            <tr className={Styles.tableFootRow}>
                                {/* <td colSpan={4} className={`${Styles.tdRight} ${Styles.rigth}`}> Colspan alterado para 4 devido à coluna Quantidade */}
                                <td colSpan={4} className={Styles.rigth}> {/* Colspan alterado para 4 devido à coluna Quantidade */}
                                    <strong>Total:</strong>
                                </td>
                                <td className={Styles.tdRight}>
                                    <strong>
                                        {valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </strong>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    )
};