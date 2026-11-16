import { useState } from "react";

import DadosConta from "../components/cards/perfil/cardDadosPersona";
import Desempenho from "../components/cards/perfil/cardDesempenho";
import AnunciosPublicados from "../components/cards/perfil/cardCatalogoDeAnuncios";

import mockPerfil from "../mocks/mockMeuPerfil";


// ===================================================================
//                         FUNÇÕES AUXILIARES
// ===================================================================

// Ordena os anúncios conforme a opção escolhida
// (com o back end, essa ordenação pode vir pronta da API)
function ordenarAnuncios(lista, ordenacao) {
    const copia = [...lista];

    if (ordenacao === "antigos") return copia.sort((a, b) => a.id - b.id);
    if (ordenacao === "visualizacoes") return copia.sort((a, b) => b.views - a.views);

    return copia.sort((a, b) => b.id - a.id); // "recentes"
}


// ===================================================================
//                          PAGE MEU PERFIL
// ===================================================================
export default function Perfil() {

    // ---------------------------------------------------------------
    //                            Estados
    // ---------------------------------------------------------------

    // Por enquanto vem do mock. Depois: troque por useState + fetch da API.
    const dados = mockPerfil;

    const [abaAtiva, setAbaAtiva] = useState("anuncios");
    const [ordenacao, setOrdenacao] = useState("recentes");

    // ---------------------------------------------------------------
    //                            Funções
    // ---------------------------------------------------------------

    // Cada função abaixo é o ponto de ligação com o fluxo / back end
    function handleCompartilhar() {
        console.log("Compartilhar perfil");
    }

    function handleExtratoCarteira() {
        console.log("Abrir extrato da carteira");
    }

    function handleNovoAnuncio() {
        console.log("Abrir criar novo anúncio");
    }

    function handleEditarAnuncio(anuncio) {
        console.log("Editar anúncio", anuncio.id);
    }

    function handleAlterarVisibilidade(anuncio) {
        console.log("Alterar visibilidade do anúncio", anuncio.id);
    }

    // ---------------------------------------------------------------
    //                              Tela
    // ---------------------------------------------------------------
    return (
        <div className="flex flex-col gap-10 bg-[#F8F7FE] px-4 py-10 sm:px-[74px]">

            <DadosConta
                usuario={dados.usuario}
                onCompartilhar={handleCompartilhar}
                onExtratoCarteira={handleExtratoCarteira}
                onNovoAnuncio={handleNovoAnuncio}
            />

            <Desempenho desempenho={dados.desempenho} />

            <AnunciosPublicados
                anuncios={ordenarAnuncios(dados.anuncios, ordenacao)}
                atualizadoEm={dados.atualizadoEm}
                abaAtiva={abaAtiva}
                abaComNotificacao={dados.abaComNotificacao}
                ordenacao={ordenacao}
                onMudarAba={setAbaAtiva}
                onMudarOrdenacao={setOrdenacao}
                onEditarAnuncio={handleEditarAnuncio}
                onAlterarVisibilidade={handleAlterarVisibilidade}
            />

        </div>
    );
}
