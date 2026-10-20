import { useState } from "react"
import Login from "./pages/Login.jsx"
import Home from "./pages/Home.jsx"
import Chamados from "./pages/Chamados.jsx"
import Coleta from "./pages/Coleta.jsx"
import Categorias from "./pages/Categorias.jsx"
import Pontos from "./pages/Pontos.jsx"
import Dashboard from "./pages/Dashboard.jsx"

import Sidebar from "./components/layout/sidebar.jsx"
import CardSair from "./components/layout/cardSair.jsx"

export default function App() {
  // estado para controlar se o usuário está logado ou não, o setLogado atualiza esse valor e o react redesenha a tela automaticamente quando ele muda
  const [logado, setLogado] = useState(false) // controla se tá logado
  const [ativa, setAtiva] = useState("home")
  const [mostrarCard, setMostrarCard] = useState(false)

  // se não estiver logado, mostra só o login
  if (!logado) {
    return <Login aoLogar = {() => setLogado(true)} />
  }

  // se estiver logado, mostra o home
  return (
    <div className = "flex flex-row min-w-[1366px] min-h-screen bg-[#F5F5F5]">
      <Sidebar ativa = {ativa} setAtiva = {setAtiva} aoClicarSair = {() => setMostrarCard(true)} />

      <div className = "w-[80%]">
        {ativa === "home" && <Home />}
        {ativa === "chamados" && <Chamados />}
        {ativa === "coleta" && <Coleta />}
        {ativa === "categorias" && <Categorias />}
        {ativa === "pontos" && <Pontos />}
        {ativa === "dashboard" && <Dashboard />}
      </div>

      {mostrarCard && (
        <CardSair 
          aoCancelar = {() => setMostrarCard(false)} 
          aoConfirmar = {() => {
            setMostrarCard(false)
            setLogado(false)
          }} 
        />
      )}

    </div>
  )
}