import CriarAnuncio from "../cards/anuncio/cardNovoAnuncio.jsx";
import { enviarAnuncio, enviarRascunho } from "../../mocks/mockNovoAnuncio.js";

// ---------------------------------------------------------------------------
//   Fluxo do novo anúncio: liga o card ao mock (ou backend).
//
//   Props recebidas da página:
//     onFinalizar -> chamada ao publicar, salvar o rascunho ou cancelar
// ---------------------------------------------------------------------------
export default function FluxoNovoAnuncio({ onFinalizar }) {

    // Publica o anúncio. Se der erro, o próprio card mostra a mensagem.
    async function publicar(dados) {
        await enviarAnuncio(dados);
        onFinalizar();
    }

    // Salva o rascunho e sai da tela.
    async function salvarRascunho(dados) {
        await enviarRascunho(dados);
        onFinalizar();
    }

    return (
        <CriarAnuncio
            onPublicar={publicar}
            onSalvarRascunho={salvarRascunho}
            onCancelar={onFinalizar}
        />
    );
}