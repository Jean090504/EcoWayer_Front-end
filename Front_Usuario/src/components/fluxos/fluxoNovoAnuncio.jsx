import CriarAnuncio from "../../components/cards/criarAnuncio/cardNovoAnuncio.jsx";
import { publicarAnuncio } from "../../services/userService.js";


// ===================================================================
//                     FLUXO DE CRIAR NOVO ANÚNCIO
//
// Liga o formulário ao backend do usuário.
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
        const usuario = JSON.parse(sessionStorage.getItem("ecowayer_usuario") || "null");
        if (!usuario?.id) throw new Error("Faça login antes de publicar um anúncio.");
        await publicarAnuncio(dados, usuario.id);
        onNavegar("home");
    }

    // Salva o rascunho e volta pra home
    async function salvarRascunho() {
        throw new Error("Rascunhos ainda não possuem tabela no backend.");
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
