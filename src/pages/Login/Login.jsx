import Styles from "./login.module.css"
import { useState, useEffect } from "react";



export default function login() {

    const [mensagemLogin, setMensagemLogin] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");

    let container = document.querySelector("#erro")
    let mensagem = (<p style='color: white;'>Login ou senha incorretos!</p>)

    const loginForm = async (e) => {

        const usuario = document.getElementById("email").value;
        const senha = document.getElementById("password").value;

        const usuarioAdmin = "admin@kontroli.com";
        const senhaAdmin = "123456";

        const usuarioVendedor = "vendedor@kontroli.com";
        const senhaVendedor = "vendedor";

        if (usuario === usuarioAdmin && senha === senhaAdmin || usuario === usuarioVendedor && senha === senhaVendedor) {
            alert("Login realizado com sucesso!");
            window.location.href = "/Admin"
        } else {
            alert("Login ou senha incorretos!");
        }
    }

    return (
        <>
            <main className={Styles.mainContent}>
                <div className={Styles.loginContainer}>
                    <div className={Styles.loginCard}>
                        <h1 className={Styles.loginTitle}>LOGIN</h1>

                        <div className={Styles.successMessage} id="successMessage">
                            Login realizado com sucesso! Redirecionando...
                        </div>

                        <div className={Styles.formGroup}>
                            <label className={Styles.formLabel} >Email ou Usuário</label>
                            <input type="text" id="email" name="email" className={Styles.formInput}
                                placeholder="Digite seu email ou usuário" required />
                            <div className={Styles.errorMessage} id="emailError">Este campo é obrigatório</div>
                        </div>

                        <div className={Styles.formGroup}>
                            <label className={Styles.formLabel}>Senha</label>
                            <div className={Styles.passwordContainer}>
                                <input
                                    type={showPassword ? "text" : "password"}   // alterna entre password/texto
                                    id="password"
                                    name="password"
                                    className={Styles.formInput}
                                    placeholder="Digite sua senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                <button
                                    type="button"
                                    className={Styles.passwordToggle}
                                    onClick={() => setShowPassword(!showPassword)} // faz o botão alternar
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 
              7-1.274 4.057-5.064 7-9.542 7-4.477 
              0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className={Styles.errorMessage} id="passwordError">Este campo é obrigatório</div>
                        </div>

                        <div className={Styles.forgotPassword}>
                            <a href="#" id="forgotPasswordLink">Esqueci minha senha</a>
                        </div>

                        <button className={Styles.loginButton} id="loginButton" onClick={loginForm}>
                            Entrar
                        </button>
                        <div id="erro">


                        </div>

                        <div className={Styles.divider}>
                            <span>ou</span>
                        </div>

                        <div className={Styles.registerLink}>
                            Não tem uma conta? <a href="#" id="registerLink">Criar conta</a>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}