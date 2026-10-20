import logo from '../../assets/icons/imagens/logo-sidebar.png'
import BotaoMenu from '../ui/botaoMenu.jsx'
import homeIcon from "../../assets/icons/menu/home.png";
import chamadosIcon from '../../assets/icons/menu/chamados.png'
import coletaIcon from '../../assets/icons/menu/coleta.png'
import categoriasIcon from '../../assets/icons/menu/categorias.png'
import pontosIcon from '../../assets/icons/menu/pontos.png'
import dashboardIcon from '../../assets/icons/menu/dashboard.png'

export default function Sidebar({ ativa, setAtiva, aoClicarSair }){
  return (
    <div className = "bg-[#FFFFFF] flex flex-col w-[20%] items-center gap-1.5">
      <img src = {logo} alt = "" className = "w-[200px] mt-8 pb-5" />

      <BotaoMenu
        ativo = {ativa === "home"}
        imagem = {homeIcon}
        largura = "20px"
        altura = "20px"
        texto = "Home"
        onClick = {() => setAtiva("home")}
      />

      <BotaoMenu
        ativo = {ativa === "chamados"}
        imagem = {chamadosIcon}
        largura = "20px"
        altura = "20px"
        texto = "Chamados"
        onClick = {() => setAtiva("chamados")}
      />

      <BotaoMenu
        ativo = {ativa === "coleta"}
        imagem = {coletaIcon}
        largura = "20px"
        altura = "20px"
        texto = "Ponto de Coleta"
        onClick = {() => setAtiva("coleta")}
      />

      <BotaoMenu
        ativo = {ativa === "categorias"}
        imagem = {categoriasIcon}
        largura = "20px"
        altura = "20px"
        texto = "Categorias"
        onClick = {() => setAtiva("categorias")}
      />

      <BotaoMenu
        ativo = {ativa === "pontos"}
        imagem = {pontosIcon}
        largura = "20px"
        altura = "20px"
        texto = "Pontos"
        onClick = {() => setAtiva("pontos")}
      />

      <BotaoMenu
        ativo = {ativa === "dashboard"}
        imagem = {dashboardIcon}
        largura = "20px"
        altura = "20px"
        texto = "Dashboard"
        onClick = {() => setAtiva("dashboard")}
      />

        <div className = "mt-auto mb-8">
          <button 
            onClick = {aoClicarSair}
            className = "bg-[#E43E42] text-white w-[160px] h-[40px] rounded-[8px] cursor-pointer">
            Encerrar Sessão
          </button>
        </div>

    </div>
  )
}