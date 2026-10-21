import logoIcon from '../assets/icons/imagens/logo-login.png'
import banner from '../assets/icons/imagens/banner-login.png'
import emailIcon from '../assets/icons/ui/email.png'
import cadeadoIcon from '../assets/icons/ui/cadeado.png'
import verSenha from '../assets/icons/ui/olho.png'
import InputLogin from '../components/ui/inputLogin.jsx'

export default function Login({ aoLogar }){ 
    return (
        // pai
        <div className = "flex flex-row w-full min-h-screen overflow-hidden">

        {/* filho */}
        <div className = "flex flex-col items-center justify-center gap-8 w-[45%] min-w-0 2xl:-mt-17.5">

            <img src = {logoIcon} alt = "" className = 
                "w-[12.5rem] h-[12.5rem] -mt-[5.25rem] 2xl:w-[15.625rem] 2xl:h-[15.625rem] 2xl:mt-0" />

            {/* subfilho */}
            <div className = "w-full max-w-[21.875rem] 2xl:max-w-[25rem] flex flex-col">
            <h1 className = 
            "font-black text-[#724BC2] text-3xl mb-7 underline decoration-[#65BA69] decoration-[3px] underline-offset-[6px] 2xl:text-4xl">Login</h1>

            <InputLogin 
                label = "Email"
                icone = {emailIcon}
                placeholder = "usuarioX@gmail.com"
                tipo = "email"
            />

            <InputLogin 
                label = "Senha"
                icone = {cadeadoIcon}
                placeholder = "********"
                tipo = "password"
                iconeDireita = {verSenha}
            />

            </div>

            <button 
                onClick = {aoLogar}
                className = "bg-[#65BA69] text-white text-lg w-full max-w-[21.875rem] min-h-[3.125rem] rounded-[0.5rem] cursor-pointer 2xl:max-w-[25rem]">
                ENTRAR
            </button>

        </div>

        {/* imagem */}
        <div className = "w-[55%] min-w-0 h-screen overflow-hidden">
            <img src = {banner} alt = "" className = "object-cover w-full h-full object-[0px_-25px]"/>
        </div>

        </div>
  )    
}