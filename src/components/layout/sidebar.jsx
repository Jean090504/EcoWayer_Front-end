import logo from '../../assets/icons/imagens/logo-sidebar.png'
import BotaoMenu from '../ui/botaoMenu.jsx'
import homeIcon from "../../assets/icons/menu/home.png"
import chamadosIcon from '../../assets/icons/menu/chamados.png'
import coletaIcon from '../../assets/icons/menu/coleta.png'
import categoriasIcon from '../../assets/icons/menu/categorias.png'
import pontosIcon from '../../assets/icons/menu/pontos.png'
import dashboardIcon from '../../assets/icons/menu/dashboard.png'

export default function Sidebar({ ativa, setAtiva, aoClicarSair }){
  return (
    <div className = "bg-[#FFFFFF] flex flex-col w-[20%] items-center gap-1.5">
      <img src = {logo} alt = "" className = "w-[12.5rem] mt-8 pb-5" />

      <BotaoMenu
        ativo = {ativa === "home"}
        imagem = {homeIcon}
        larguraImagem = "clamp(20px, 1.5vw, 28px)"
        altura = "clamp(20px, 1.5vw, 28px)"
        texto = "Home"
        onClick = {() => setAtiva("home")}
      />

      <BotaoMenu
        ativo = {ativa === "chamados"}
        imagem = {chamadosIcon}
        larguraImagem = "clamp(20px, 1.5vw, 28px)"
        alturaImagem = "clamp(20px, 1.5vw, 28px)"
        texto = "Chamados"
        onClick = {() => setAtiva("chamados")}
      />

      <BotaoMenu
        ativo = {ativa === "coleta"}
        imagem = {coletaIcon}
        larguraImagem = "clamp(20px, 1.5vw, 28px)"
        alturaImagem = "clamp(20px, 1.5vw, 28px)"
        texto = "Ponto de Coleta"
        onClick = {() => setAtiva("coleta")}
      />

      <BotaoMenu
        ativo = {ativa === "categorias"}
        imagem = {categoriasIcon}
        larguraImagem = "clamp(20px, 1.5vw, 28px)"
        altura = "clamp(20px, 1.5vw, 28px)"
        texto = "Categorias"
        onClick = {() => setAtiva("categorias")}
      />

      <BotaoMenu
        ativo = {ativa === "pontos"}
        imagem = {pontosIcon}
        larguraImagem = "clamp(20px, 1.5vw, 28px)"
        alturaImagem = "clamp(20px, 1.5vw, 28px)"
        texto = "Pontos"
        onClick = {() => setAtiva("pontos")}
      />

      <BotaoMenu
        ativo = {ativa === "dashboard"}
        imagem = {dashboardIcon}
        larguraImagem = "20px"
        alturaImagem = "20px"
        texto = "Dashboard"
        onClick = {() => setAtiva("dashboard")}
      />

        <div className = "mt-auto mb-8">
          <button 
            onClick = {aoClicarSair}
            className = "bg-[#E43E42] text-white text-base w-full max-w-[10rem] min-h-[2.5rem] px-4 rounded-[0.5rem] cursor-pointer">
            Encerrar Sessão
          </button>
        </div>

    </div>
  )
}