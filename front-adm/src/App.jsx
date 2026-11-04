import { useState } from "react"

import Login from "./pages/Login.jsx"
import Home from "./pages/Home.jsx"
import Chamados from "./pages/Chamados.jsx"
import Coleta from "./pages/Coleta.jsx"
import Categorias from "./pages/Categorias.jsx"
import Pontos from "./pages/Pontos.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import CategoriaIndividual from "./pages/CategoriaIndividual.jsx"

import Sidebar from "./components/layout/sidebar.jsx"
import CardSair from "./components/layout/cardSair.jsx"

export default function App() {
  const [logado, setLogado] = useState(false)
  const [ativa, setAtiva] = useState("home")
  const [mostrarCard, setMostrarCard] = useState(false)
  const [categoriaAberta, setCategoriaAberta] = useState(null) // id da categoria aberta

  if (!logado) {
    return <Login aoLogar = {() => setLogado(true)} />
  }

  return (
    <div className = "flex flex-row min-w-[1366px] min-h-screen bg-[#F5F5F5]">
      <Sidebar ativa = {ativa} setAtiva = {setAtiva} aoClicarSair = {() => setMostrarCard(true)} />

      <div className = "w-[80%]">
        {ativa === "home" && <Home />}
        {ativa === "chamados" && <Chamados />}
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
    </div>
  )
}