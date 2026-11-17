import FormularioAnuncio from "../criarAnuncio/cardNovoAnuncio.jsx";

export default function CardEditarAnuncio({ dadosIniciais, onSalvar, onCancelar }) {
    return <FormularioAnuncio editando dadosIniciais={dadosIniciais} onPublicar={onSalvar} onCancelar={onCancelar} />;
}
