import CriarAnuncio from "../../components/cards/criarAnuncio/cardNovoAnuncio.jsx";
import { enviarAnuncio, enviarRascunho } from "../../mocks/mockCriarNovoAnuncio.js";


// ===================================================================
//                     FLUXO DE CRIAR NOVO ANÚNCIO
//
// Liga o card ao mock (backend de mentira).
// Se o mock lançar erro, o card mostra a mensagem acima dos botões.
//
// Props recebidas do App (via página):
//   onNavegar -> troca a tela ativa (depois de publicar, salvar ou cancelar)
// ===================================================================
export default function FluxoCriarAnuncio({ onNavegar }) {

    // ---------------------------------------------------------------
    //                            Funções
    // ---------------------------------------------------------------

    // Publica o anúncio e volta pra home
    async function publicar(dados) {
        await enviarAnuncio(dados);
        onNavegar("home");
    }

    // Salva o rascunho e volta pra home
    async function salvarRascunho(dados) {
        await enviarRascunho(dados);
        onNavegar("home");
    }

    // Descarta tudo e volta pra home
    function cancelar() {
        onNavegar("home");
    }

    // ---------------------------------------------------------------
    //                              Tela
    // ---------------------------------------------------------------
    return (
        <CriarAnuncio
            onPublicar={publicar}
            onSalvarRascunho={salvarRascunho}
            onCancelar={cancelar}
        />
    );
}