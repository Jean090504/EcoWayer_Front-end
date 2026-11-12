import { useState } from 'react'
import logoIcon from '../assets/icons/imagens/logo-login.png'
import banner from '../assets/icons/imagens/banner-login.png'
import emailIcon from '../assets/icons/ui/email.png'
import cadeadoIcon from '../assets/icons/ui/cadeado.png'
import InputLogin from '../components/ui/inputLogin.jsx'

export default function Login({ aoLogar }){
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(false)

    const enviarLogin = async (event) => {
        event.preventDefault()
        setErro('')

        if (!email.trim() || !senha) {
            setErro('Preencha seu e-mail e sua senha para entrar.')
            return
        }

        setCarregando(true)

        try {
            await aoLogar({ email, senha })
        } catch (error) {
            const mensagem = error.message || ''
            const mensagemAmigavel = mensagem === 'E-mail ou senha inválidos.'
                ? 'E-mail ou senha incorretos. Confira seus dados e tente novamente.'
                : mensagem.includes('conectar à API')
                    ? 'Não conseguimos conectar ao sistema agora. Tente novamente em instantes.'
                    : 'Não conseguimos entrar na sua conta. Confira seus dados e tente novamente.'
            setErro(mensagemAmigavel)
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className = "flex flex-row w-full min-h-screen overflow-hidden">

            <div className = "flex flex-col items-center justify-center gap-8 w-[45%] ">
                <img src = {logoIcon} alt = "" className = 
                    "w-[15.625rem] h-[15.625rem] -mt-[5.25rem]" />
                
                <form onSubmit = {enviarLogin} className = "flex flex-col items-center justify-center">
                    <div className = "flex flex-col w-[clamp(400px,25vw,450px)]">
                        <h1 className = 
                        "font-black text-[#724BC2] text-4xl mb-7 underline decoration-[#65BA69] decoration-[3px] underline-offset-[6px]">Login</h1>

                        <InputLogin 
                            label = "Email"
                            icone = {emailIcon}
                            placeholder = "admin@root.com"
                            tipo = "email"
                            value = {email}
                            onChange = {(event) => setEmail(event.target.value)}
                        />

                        <InputLogin 
                            label = "Senha"
                            icone = {cadeadoIcon}
                            placeholder = "Digite sua senha"
                            tipo = "password"
                            value = {senha}
                            onChange = {(event) => setSenha(event.target.value)}
                        />
                    </div>

                    {erro && (
                        <div role = "alert" className = "mb-4 flex w-[clamp(400px,25vw,450px)] items-center gap-2 rounded-lg border border-red-500 bg-red-500 px-3 py-2 text-[13px] font-semibold leading-5 text-white shadow-sm">
                            <span aria-hidden = "true" className = "flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold text-white">!</span>
                            <p>{erro}</p>
                        </div>
                    )}

                    <button
                        type = "submit"
                        disabled = {carregando}
                        className = "bg-[#65BA69] text-white text-[clamp(16px,1.125vw,18px)] w-[clamp(400px,25vw,450px)] min-h-[clamp(45px,3.125rem,50px)] rounded-[0.5rem] cursor-pointer">
                        {carregando ? 'ENTRANDO...' : 'ENTRAR'}
                    </button>
                </form>
            </div>

            {/* imagem */}
            <div className = "w-[55%] min-w-0 h-screen overflow-hidden">
                <img src = {banner} alt = "" className = "object-cover w-full h-full min-object-[center_-1.5vw]" />
            </div>
        </div>
    )
}
