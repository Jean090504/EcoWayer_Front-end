import { useEffect, useState } from "react";
import fundo1 from "../../assets/icons/img/banner1.png";
import fundo2 from "../../assets/icons/img/banner2.png";
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

    useEffect(() => {
        const intervalo = window.setInterval(() => {
            setBannerAtual((atual) => (atual + 1) % banners.length);
        }, 5000);

        return () => window.clearInterval(intervalo);
    }, [banners.length]);

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
                <div className = "relative h-[clamp(190px,22vw,300px)] w-full overflow-hidden rounded-[28px] bg-gray-100 shadow-lg shadow-slate-200/60">

                    {/* Imagem de fundo */}
                    <img
                        src={banners[bannerAtual].imagem}
                        alt="Objetos reutilizáveis para troca, venda e doação"
                        className="absolute inset-0 h-full w-full object-cover transition duration-700"
                    />

                    {/* Texto do banner */}
                    <div className="absolute inset-0 flex items-center bg-gradient-to-r from-white/98 via-white/90 to-white/10 px-5 sm:px-10 md:px-16">
                        <div className="max-w-[min(88%,560px)] rounded-2xl bg-white/80 px-5 py-4 shadow-sm ring-1 ring-white/70 backdrop-blur-[2px] sm:px-7 sm:py-5">
                            <h2 className="max-w-[18ch] text-xl font-extrabold leading-[1.08] text-[#6840BD] sm:text-3xl md:text-4xl">
                                {banners[bannerAtual].titulo}
                            </h2>
                            <p className="mt-2 max-w-[42ch] text-xs font-bold leading-5 text-[#23833d] sm:text-sm md:text-base">
                                {banners[bannerAtual].descricao}
                            </p>
                        </div>
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

                    {/* Botão anterior*/}
                    <button
                        type="button"
                        onClick={bannerAnterior}
                        aria-label="Banner anterior"
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-lg text-gray-700 shadow-md hover:bg-gray-50 transition"
                    >
                        ‹
                    </button>

                    {/* Botão proximo */}
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
