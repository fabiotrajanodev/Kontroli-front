import Styles from "./navbar.module.css"
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
export default function Navbar() {
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



                            <a href="/admin"> <button className={`${Styles.btn} ${Styles.btnGhost}`}>
                                Admin
                                <svg xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-no-axes-combined-icon lucide-chart-no-axes-combined">
                                <path d="M12 16v5" />
                                <path d="M16 14v7" />
                                <path d="M20 10v11" />
                                <path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" />
                                <path d="M4 18v3" />
                                <path d="M8 14v7" /></svg>
                            </button>
                            </a>


                            <a href="/relatorio"> <button className={`${Styles.btn} ${Styles.btnGhost}`}>
                                Relatórios
                                <FontAwesomeIcon icon={faChartBar} />
                            </button>
                            </a>



                            <a href="/vendas"> <button className={`${Styles.btn} ${Styles.btnGhost}`}>
                                Vendas
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={Styles.icon}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    width="16"
                                    height="16"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13a1 1 0 100 2h10a1 1 0 100-2M9 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"
                                    />
                                </svg>
                            </button>
                            </a>
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
        </>
)}
