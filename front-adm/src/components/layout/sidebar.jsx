import logo from '../../assets/icons/imagens/logo-sidebar.png'
import BotaoMenu from '../ui/botaoMenu.jsx'
import homeIcon from "../../assets/icons/menu/home.png"
import chamadosIcon from '../../assets/icons/menu/chamados.png'
import coletaIcon from '../../assets/icons/menu/coleta.png'
import categoriasIcon from '../../assets/icons/menu/categorias.png'
import pontosIcon from '../../assets/icons/menu/pontos.png'
import dashboardIcon from '../../assets/icons/menu/dashboard.png'
import giftCardIcon from '../../assets/icons/menu/gift-card.svg'

export default function Sidebar({ ativa, setAtiva, aoClicarSair }){
  return (
    <aside className="flex w-full shrink-0 flex-row items-center overflow-x-auto border-b border-slate-100 bg-white px-3 py-2 md:min-h-screen md:w-[260px] md:flex-col md:items-stretch md:border-b-0 md:border-r md:px-4 md:py-6">
      <div className="hidden px-3 pb-7 md:block">
        <img src={logo} alt="Ecowayer" className="h-auto w-[165px]" />
      </div>

      <nav className="flex min-w-max flex-1 items-center gap-1 md:min-w-0 md:flex-col md:items-stretch md:gap-1.5" aria-label="Navegação principal">

      <BotaoMenu
        ativo = {ativa === "home"}
        imagem = {homeIcon}
        larguraImagem = "22px"
        altura = "22px"
        texto = "Home"
        onClick = {() => setAtiva("home")}
      />

      <BotaoMenu
        ativo = {ativa === "chamados"}
        imagem = {chamadosIcon}
        larguraImagem = "22px"
        alturaImagem = "22px"
        texto = "Chamados"
        onClick = {() => setAtiva("chamados")}
      />

      <BotaoMenu
        ativo = {ativa === "coleta"}
        imagem = {coletaIcon}
        larguraImagem = "22px"
        alturaImagem = "22px"
        texto = "Ponto de Coleta"
        onClick = {() => setAtiva("coleta")}
      />

      <BotaoMenu
        ativo = {ativa === "categorias"}
        imagem = {categoriasIcon}
        larguraImagem = "22px"
        altura = "22px"
        texto = "Categorias"
        onClick = {() => setAtiva("categorias")}
      />

      <BotaoMenu
        ativo = {ativa === "pontos"}
        imagem = {pontosIcon}
        larguraImagem = "22px"
        alturaImagem = "22px"
        texto = "Pontos"
        onClick = {() => setAtiva("pontos")}
      />

      <BotaoMenu
        ativo = {ativa === "giftcards"}
        imagem = {giftCardIcon}
        larguraImagem = "22px"
        alturaImagem = "22px"
        texto = "Gift cards"
        onClick = {() => setAtiva("giftcards")}
      />

      <BotaoMenu
        ativo = {ativa === "resgates"}
        imagem = {giftCardIcon}
        larguraImagem = "22px"
        alturaImagem = "22px"
        texto = "Resgates"
        onClick = {() => setAtiva("resgates")}
      />

      <BotaoMenu
        ativo = {ativa === "dashboard"}
        imagem = {dashboardIcon}
        larguraImagem = "22px"
        alturaImagem = "22px"
        texto = "Dashboard"
        onClick = {() => setAtiva("dashboard")}
      />
      </nav>

      <div className="ml-auto pl-2 md:mt-auto md:w-full md:px-3 md:pt-6">
        <button
          onClick={aoClicarSair}
          className="flex min-h-10 w-full items-center justify-center rounded-xl border border-red-100 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        >
          Encerrar sessão
        </button>
      </div>

    </aside>
  )
}
