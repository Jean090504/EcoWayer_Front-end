import logoIcon from '../assets/icons/imagens/logo-login.png'
import banner from '../assets/icons/imagens/banner-login.png'
import emailIcon from '../assets/icons/ui/email.png'
import cadeadoIcon from '../assets/icons/ui/cadeado.png'
import verSenha from '../assets/icons/ui/olho.png'
import InputLogin from '../components/ui/inputLogin.jsx'

export default function Login({ aoLogar }){
    return (
        <div className = "flex flex-row w-full min-h-screen overflow-hidden">

            <div className = "flex flex-col items-center justify-center gap-8 w-[45%] ">
                <img src = {logoIcon} alt = "" className = 
                    "w-[15.625rem] h-[15.625rem] -mt-[5.25rem]" />
                
                <div className = "flex flex-col items-center justify-center">
                    <div className = "flex flex-col w-[clamp(400px,25vw,450px)]">
                        <h1 className = 
                        "font-black text-[#724BC2] text-4xl mb-7 underline decoration-[#65BA69] decoration-[3px] underline-offset-[6px]">Login</h1>

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
                        className = "bg-[#65BA69] text-white text-[clamp(16px,1.125vw,18px)] w-[clamp(400px,25vw,450px)] min-h-[clamp(45px,3.125rem,50px)] rounded-[0.5rem] cursor-pointer">
                        ENTRAR
                    </button>
                </div>
            </div>

            {/* imagem */}
            <div className = "w-[55%] min-w-0 h-screen overflow-hidden">
                <img src = {banner} alt = "" className = "object-cover w-full h-full min-object-[center_-1.5vw]" />
            </div>
        </div>
    )
}