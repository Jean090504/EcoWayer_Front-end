import { useEffect, useState } from "react"

import Login from "./pages/Login.jsx"
import Home from "./pages/Home.jsx"
import Chamados from "./pages/Chamados.jsx"
import ChamadoIndividual from "./pages/ChamadoIndividual.jsx"
import Coleta from "./pages/Coleta.jsx"
import Categorias from "./pages/Categorias.jsx"
import Pontos from "./pages/Pontos.jsx"
import GiftCards from "./pages/GiftCards.jsx"
import Resgates from "./pages/Resgates.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import CategoriaIndividual from "./pages/CategoriaIndividual.jsx"
import AssistenteChat from "./components/AssistenteChat.jsx"

import Sidebar from "./components/layout/sidebar.jsx"
import CardSair from "./components/layout/cardSair.jsx"
import { apiFetch } from "./services/api.js"

export default function App() {
  const [logado, setLogado] = useState(() => Boolean(localStorage.getItem("token") || sessionStorage.getItem("token")))
  const [ativa, setAtiva] = useState("home")
  const [mostrarCard, setMostrarCard] = useState(false)
  const [categoriaAberta, setCategoriaAberta] = useState(null) // id da categoria aberta
  const [chamadoAberto, setChamadoAberto] = useState(null)

  useEffect(() => {
    const encerrarSessao = () => setLogado(false)
    window.addEventListener('auth:expired', encerrarSessao)
    return () => window.removeEventListener('auth:expired', encerrarSessao)
  }, [])

  const fazerLogin = async (credenciais) => {
    const resposta = await apiFetch("/acesso/login", {
      method: "POST",
      body: JSON.stringify(credenciais),
    })

    const token = resposta.response?.token
    if (!token) throw new Error("A API não retornou um token de acesso.")

    sessionStorage.setItem("token", token)
    setLogado(true)
  }

  if (!logado) {
    return <Login aoLogar = {fazerLogin} />
  }

  return (
    <div className = "flex min-h-screen w-full min-w-0 flex-col bg-[#F5F5F5] md:flex-row">
      <Sidebar ativa = {ativa} setAtiva = {setAtiva} aoClicarSair = {() => setMostrarCard(true)} />

      <div className = "min-w-0 flex-1 overflow-x-hidden">
        {ativa === "home" && <Home setAtiva={setAtiva} />}
        {ativa === "chamados" && (chamadoAberto ? <ChamadoIndividual alerta={chamadoAberto} aoVoltar={() => setChamadoAberto(null)} /> : <Chamados aoAbrir={setChamadoAberto} />)}
        {ativa === "coleta" && <Coleta />}
        {ativa === "categorias" && (
          categoriaAberta
            ? <CategoriaIndividual
                categoriaId = {categoriaAberta}
                aoVoltar = {() => setCategoriaAberta(null)}
              />
            : <Categorias aoAbrirCategoria = {setCategoriaAberta} />
        )}
        {ativa === "pontos" && <Pontos />}
        {ativa === "giftcards" && <GiftCards />}
        {ativa === "resgates" && <Resgates />}
        {ativa === "dashboard" && <Dashboard />}
      </div>

      {mostrarCard && (
        <CardSair
          aoCancelar = {() => setMostrarCard(false)}
          aoConfirmar = {() => {
            setMostrarCard(false)
            localStorage.removeItem("token")
            sessionStorage.removeItem("token")
            setLogado(false)
          }}
        />
      )}
      <AssistenteChat />
    </div>
  )
}
