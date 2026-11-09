import { useState } from "react"

import Login from "./pages/Login.jsx"
import Home from "./pages/Home.jsx"
import Chamados from "./pages/Chamados.jsx"
import ChamadoIndividual from "./pages/ChamadoIndividual.jsx"
import Coleta from "./pages/Coleta.jsx"
import Categorias from "./pages/Categorias.jsx"
import Pontos from "./pages/Pontos.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import CategoriaIndividual from "./pages/CategoriaIndividual.jsx"
import AssistenteChat from "./components/AssistenteChat.jsx"

import Sidebar from "./components/layout/sidebar.jsx"
import CardSair from "./components/layout/cardSair.jsx"

export default function App() {
  const [logado, setLogado] = useState(false)
  const [ativa, setAtiva] = useState("home")
  const [mostrarCard, setMostrarCard] = useState(false)
  const [categoriaAberta, setCategoriaAberta] = useState(null) // id da categoria aberta
  const [chamadoAberto, setChamadoAberto] = useState(null)

  if (!logado) {
    return <Login aoLogar = {() => setLogado(true)} />
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
      <AssistenteChat />
    </div>
  )
}
