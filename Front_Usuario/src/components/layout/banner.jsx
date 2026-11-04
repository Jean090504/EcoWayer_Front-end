import { useState } from "react";
import fundo1 from "../../assets/icons/img/banner.png";
import fundo2 from "../../assets/icons/img/banner02.png";
import fundo3 from "../../assets/icons/img/banner3.png";

export default function Banner() {
    const [bannerAtual, setBannerAtual] = useState(0);

    const banners = [
        {
            imagem: fundo1,
            titulo: "Venda Troque ou Doe",
            descricao: "Faça parte de um futuro mais sustentável!",
        },
        {
            imagem: fundo2,
            titulo: "Dê uma nova vida aos objetos",
            descricao: "O que não serve mais para você pode servir para alguém!",
        },
        {
            imagem: fundo3,
            titulo: "Consuma de forma consciente",
            descricao: "Pequenas atitudes transformam o nosso futuro!",
        },
    ];

    function proximoBanner() {
        setBannerAtual((atual) => (atual + 1) % banners.length);
    }

    function bannerAnterior() {
        setBannerAtual(
            (atual) => (atual - 1 + banners.length) % banners.length
        );
    }

    return (
        <section className="w-full">
            <div className="relative w-full">

                {/* Área do banner (imagem + botões) */}
                <div className="relative h-[210px] overflow-hidden rounded-2xl bg-gray-100">

                    {/* Imagem de fundo */}
                    <img
                        src={banners[bannerAtual].imagem}
                        alt="Objetos reutilizáveis para troca, venda e doação"
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Texto do banner */}
                    <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-8 sm:px-12 md:px-16 max-w-[70%]">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#7546CF] leading-tight">
                            {banners[bannerAtual].titulo}
                        </h2>
                        <p className="mt-1 text-xs sm:text-sm text-green-600 font-medium">
                            {banners[bannerAtual].descricao}
                        </p>
                    </div>

                    {/* Indicadores inferiores */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                        {banners.map((_, indice) => (
                            <button
                                key={indice}
                                type="button"
                                onClick={() => setBannerAtual(indice)}
                                aria-label={`Ir para o banner ${indice + 1}`}
                                className={`h-[3px] rounded-full transition-all duration-300 ${
                                    bannerAtual === indice
                                        ? "w-8 bg-[#7546CF]"
                                        : "w-8 bg-white/80"
                                }`}
                            />
                        ))}
                    </div>

                    {/* Botão anterior - por cima da imagem, na extremidade esquerda */}
                    <button
                        type="button"
                        onClick={bannerAnterior}
                        aria-label="Banner anterior"
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-lg text-gray-700 shadow-md hover:bg-gray-50 transition"
                    >
                        ‹
                    </button>

                    {/* Botão próximo - por cima da imagem, na extremidade direita */}
                    <button
                        type="button"
                        onClick={proximoBanner}
                        aria-label="Próximo banner"
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-lg text-gray-700 shadow-md hover:bg-gray-50 transition"
                    >
                        ›
                    </button>
                </div>
            </div>
        </section>
    );
}