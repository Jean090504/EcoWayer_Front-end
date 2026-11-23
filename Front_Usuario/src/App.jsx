import { useEffect, useState } from "react"

import { Header, Footer } from './components/layout'
import { logoutUsuario } from "./services/userService.js"

import { FluxoCriarConta, FluxoDenunciarAnuncio } from './components/fluxos'
import { EVENTO_SESSAO_EXPIRADA, sessaoFoiEncerrada } from "./services/sessionService.js"
import TelaMapa from "./pages/MapaEcoPontos.jsx"
import Login from "./components/cards/conta/cardLogin.jsx"
import DenunciarAnuncio from './pages/DenunciarAnuncio.jsx'

import {
    Home,
    ConfiguracoesPerfil,
    AvaliacaoAnuncio,
    DetalhesAnuncio,
    MinhaCarteira,
    PontosBeneficios,
    Insignias,
    CriarNovoAnuncio,
    TelaMeuPerfil,
    Notificacoes,
    Chat,
    EditarAnuncio,
    ConfirmacaoAnuncioAlterado,
    SessaoEncerrada
} from './pages'


export default function App() {
    return (
        <div className="flex min-h-screen flex-col gap-y-15 bg-[#F2F4F6]">
            <Header />
            <div className="flex-1">
                <TelaMapa />
            </div>
            <Footer />
        </div>
    );
}