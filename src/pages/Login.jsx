import logoIcon from '../assets/iconsLogin/logo.png'
import banner from '../assets/iconsLogin/banner.png'
import emailIcon from '../assets/iconsLogin/email.png'
import cadeadoIcon from '../assets/iconsLogin/cadeado.png'
import verSenha from '../assets/iconsLogin/olho.png'
import InputLogin from '../components/inputLogin.jsx'

export default function Login({ aoLogar }){ 
    return (
        // pai
        <div className = "flex flex-row w-full min-h-screen overflow-hidden">

        {/* filho */}
        <div className = "flex flex-col items-center justify-center gap-8 w-[45%] min-w-0 2xl:-mt-17.5">

            <img src = {logoIcon} alt = "" className = 
                "w-[200px] h-[200px] -mt-21 2xl:w-[250px] 2xl:h-[250px] 2xl:mt-0" />

            {/* subfilho */}
            <div className = "w-full max-w-[350px] 2xl:max-w-[400px] flex flex-col">
            <h1 className = 
            "font-black text-[#724BC2] text-[30px] mb-7 underline decoration-[#65BA69] decoration-[3px] underline-offset-[6px] 2xl:text-[36px]">Login</h1>

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
                className = "bg-[#65BA69] text-white text-[18px] w-[350px] h-[50px] rounded-[8px] cursor-pointer 2xl:w-[400px]">
                ENTRAR
            </button>

        </div>

        {/* imagem */}
        <div className = "w-[55%] min-w-0 h-screen overflow-hidden">
            <img src = {banner} alt = "" className = "object-cover w-full h-full object-cover object-[0px_-25px]"/>
        </div>

        </div>
  )    
}