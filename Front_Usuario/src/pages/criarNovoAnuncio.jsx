import FluxoCriarAnuncio from "../components/fluxos/fluxoNovoAnuncio";

export default function CriarNovoAnuncio({ onNavegar }) {
    return (
        // adiciona um fundo lilas e chama o fluxo do card
        <div className="flex flex-col items-center bg-[#FAF8FF] py-25">
            <div className="flex w-[60%] items-center">

                {/* Fluxo do anúncio (card + mock) */}
                <FluxoCriarAnuncio onNavegar={onNavegar} />

            </div>
        </div>
    );
}