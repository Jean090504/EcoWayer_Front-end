import { useEffect, useState } from "react"
import { Pause, Play } from "lucide-react"
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
            <img src={banner.imagem} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-y-0 left-0 flex max-w-[70%] flex-col justify-center px-8 sm:px-12 md:px-16">
                <h2 className="text-xl font-extrabold leading-tight text-[#7546CF] sm:text-2xl md:text-3xl">{banner.titulo}</h2>
                <p className="mt-1 text-xs font-medium text-green-600 sm:text-sm">{banner.descricao}</p>
            </div>
        </div>
    )
}

export default function Banner() {
    const [slide, setSlide] = useState({ indice: 0, anterior: null, direcao: 1 })
    const [pausado, setPausado] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    const [mouseSobreBanner, setMouseSobreBanner] = useState(false)

    useEffect(() => {
        if (pausado || mouseSobreBanner) return
        const timer = window.setTimeout(() => setSlide(atual => moverBanner(atual, 1)), 6000)
        return () => window.clearTimeout(timer)
    }, [slide, pausado, mouseSobreBanner])

    return (
        <section
            aria-label="Destaques da página inicial"
            onMouseEnter={() => setMouseSobreBanner(true)}
            onMouseLeave={() => setMouseSobreBanner(false)}
            className="relative h-[clamp(190px,30vw,230px)] w-full overflow-hidden rounded-2xl bg-gray-100"
            style={{ "--banner-deslocamento": slide.direcao === 1 ? "100%" : "-100%" }}
        >
            {slide.anterior !== null && <Slide key={slide.anterior} indice={slide.anterior} saida animar />}
            <Slide key={slide.indice} indice={slide.indice} animar={slide.anterior !== null} />

            <div className="absolute bottom-1 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
                {BANNERS.map((banner, indice) => (
                    <button
                        key={banner.titulo}
                        type="button"
                        onClick={() => setSlide(atual => trocarBanner(atual, indice, indice > atual.indice ? 1 : -1))}
                        aria-label={`Ir para o banner ${indice + 1}`}
                        aria-current={slide.indice === indice ? "true" : undefined}
                        className="flex h-6 w-8 items-center"
                    >
                        <span className={`h-[3px] w-full rounded-full transition-colors motion-reduce:transition-none ${slide.indice === indice ? "bg-[#7546CF]" : "bg-white/80"}`} />
                    </button>
                ))}
            </div>

            <button
                type="button"
                onClick={() => setSlide(atual => moverBanner(atual, -1))}
                aria-label="Banner anterior"
                className="absolute left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-lg text-gray-700 shadow-md transition hover:bg-gray-50"
            >
                ‹
            </button>
            <button
                type="button"
                onClick={() => setSlide(atual => moverBanner(atual, 1))}
                aria-label="Próximo banner"
                className="absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-lg text-gray-700 shadow-md transition hover:bg-gray-50"
            >
                ›
            </button>
        </section>
    )
}
