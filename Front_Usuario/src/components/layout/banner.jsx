import { useEffect, useState } from "react"
import fundo1 from "../../assets/icons/img/banner1.png"
import fundo2 from "../../assets/icons/img/banner2.png"
import fundo3 from "../../assets/icons/img/banner3.png"

const BANNERS = [
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
]

function trocarBanner(atual, indice, direcao) {
    if (indice === atual.indice) return atual
    return { indice, anterior: atual.indice, direcao }
}

function moverBanner(atual, direcao) {
    const indice = (atual.indice + direcao + BANNERS.length) % BANNERS.length
    return trocarBanner(atual, indice, direcao)
}

function Slide({ indice, saida = false, animar }) {
    const banner = BANNERS[indice]
    const animacao = saida ? "banner-saida" : "banner-entrada"

    return (
        <div aria-hidden={saida || undefined} className={`absolute inset-0 ${animar ? animacao : ""}`}>
            <img src={banner.imagem} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div className="absolute inset-y-0 left-0 w-[92%] bg-gradient-to-r from-white/95 via-white/85 to-transparent sm:w-[72%] lg:w-[62%]" />
            <div className="absolute inset-y-0 left-0 z-[1] flex w-[88%] max-w-[650px] flex-col justify-center px-14 py-6 sm:w-[70%] sm:px-20 md:px-24">
                <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold leading-[1.12] tracking-tight text-[#4D278F]">{banner.titulo}</h2>
                <p className="mt-3 max-w-[34rem] text-sm font-semibold leading-relaxed text-[#176B36] sm:text-base md:text-lg">{banner.descricao}</p>
            </div>
        </div>
    )
}

export default function Banner() {
    const [slide, setSlide] = useState({ indice: 0, anterior: null, direcao: 1 })
    useEffect(() => {
        const timer = window.setTimeout(() => setSlide(atual => moverBanner(atual, 1)), 5000)
        return () => window.clearTimeout(timer)
    }, [slide])

    return (
        <section
            aria-label="Destaques da página inicial"
            className="relative h-[300px] w-full overflow-hidden rounded-2xl bg-gray-100 sm:h-[clamp(290px,25vw,400px)]"
            style={{ "--banner-deslocamento": slide.direcao === 1 ? "100%" : "-100%" }}
        >
            {slide.anterior !== null && <Slide key={slide.anterior} indice={slide.anterior} saida animar />}
            <Slide key={slide.indice} indice={slide.indice} animar={slide.anterior !== null} />

            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/85 px-2 shadow-sm backdrop-blur-sm">
                {BANNERS.map((banner, indice) => (
                    <button
                        key={banner.titulo}
                        type="button"
                        onClick={() => setSlide(atual => trocarBanner(atual, indice, indice > atual.indice ? 1 : -1))}
                        aria-label={`Ir para o banner ${indice + 1}`}
                        aria-current={slide.indice === indice ? "true" : undefined}
                        className="flex h-9 w-9 items-center"
                    >
                        <span className={`h-1 w-full rounded-full transition-colors motion-reduce:transition-none ${slide.indice === indice ? "bg-[#7546CF]" : "bg-[#7B6B91]/45"}`} />
                    </button>
                ))}
            </div>

            <button
                type="button"
                onClick={() => setSlide(atual => moverBanner(atual, -1))}
                aria-label="Banner anterior"
                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl text-[#4D278F] shadow-md transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4D278F]"
            >
                ‹
            </button>
            <button
                type="button"
                onClick={() => setSlide(atual => moverBanner(atual, 1))}
                aria-label="Próximo banner"
                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl text-[#4D278F] shadow-md transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4D278F]"
            >
                ›
            </button>
        </section>
    )
}
