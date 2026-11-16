import { useState } from "react"

import { Gavel, Heart, Leaf, BadgeCheck, ShieldAlert, Headset, MessageSquareReply, X, Truck, ArrowRight, ChevronRight, CircleCheck, } from "lucide-react"

export const ABAS = [
    { value: "todas", label: "Todas" },
    { value: "sistema", label: "Sistema & Regras" },
    { value: "negociacoes", label: "Negociações & Chat" },
    { value: "ecocreditos", label: "EcoCréditos & Recompensas" },
]

const TIPOS = {
    moderacao: {
        aba: "sistema",
        assunto: "Moderação",
        corBarra: "bg-[#E53E3E]",
        corTitulo: "text-[#E53E3E]",
        icon: () => <Gavel size={20} className="text-[#E53E3E]" />,
    },
    proposta: {
        aba: "negociacoes",
        assunto: "Nova proposta",
        corBarra: "bg-[#724BC2]",
        corTitulo: "text-[#724BC2]",
        icon: (d) => (
            <img src={d.foto} alt={d.nome} className="h-full w-full object-cover" />
        ),
    },
    ecocreditos: {
        aba: "ecocreditos",
        assunto: "EcoCréditos",
        corBarra: "bg-[#4CAF50]",
        corTitulo: "text-[#4CAF50]",
        icon: () => <Leaf size={20} className="text-[#4CAF50]" />,
    },
    desempenho: {
        aba: "negociacoes",
        assunto: "Desempenho",
        corBarra: "",
        corTitulo: "text-[#724BC2]",
        icon: () => <Heart size={20} className="fill-[#724BC2] text-[#724BC2]" />,
    },
    conta: {
        aba: "sistema",
        assunto: "Conta",
        corBarra: "",
        corTitulo: "text-[#191C1E]",
        icon: () => <BadgeCheck size={20} className="text-[#724BC2]" />,
    },
    default: {
        aba: "sistema",
        assunto: "",
        corBarra: "",
        corTitulo: "text-[#191C1E]",
        icon: () => null,
    },
}

const TIPOS_QUE_ABREM = ["moderacao", "proposta", "ecocreditos"]

export function abaDoTipo(tipo) {
    return (TIPOS[tipo] ?? TIPOS.default).aba
}

const CONTEUDOS = {
    moderacao: (dados, onAcao) => (
        <div className="mt-2 flex gap-3">
            <button
                onClick={() => onAcao?.("regularizar")}
                className="flex cursor-pointer items-center gap-2 rounded-full bg-[#E43E42] px-4 py-2 text-xs font-semibold text-white"
            >
                <ShieldAlert size={14} />
                Entender o motivo e regularizar
            </button>
            <button
                onClick={() => onAcao?.("suporte")}
                className="flex cursor-pointer items-center gap-2 rounded-full bg-[#F8F9FB] px-4 py-2 text-xs font-semibold text-[#191C1E]"
            >
                <Headset size={14} />
                Falar com suporte
            </button>
        </div>
    ),

    proposta: (dados, onAcao) => (
        <>
            <div className="mt-1 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F8F9FB] text-[#724BC2]">
                    <Truck size={16} />
                </span>
                <div className="flex flex-col">
                    <p className="text-xs font-semibold text-[#724BC2]">
                        Retirada Agendada sugerida
                    </p>
                    <p className="text-[10px] text-[#724BC2]/70">{dados.retirada}</p>
                </div>
            </div>

            <div className="mt-2 flex gap-3">
                <button
                    onClick={() => onAcao?.("responder")}
                    className="flex cursor-pointer items-center gap-2 rounded-full bg-[#724BC2] px-4 py-2 text-xs font-semibold text-white"
                >
                    <MessageSquareReply size={14} />
                    Ver Proposta e Responder
                </button>
                <button
                    onClick={() => onAcao?.("recusar")}
                    className="flex cursor-pointer items-center gap-2 rounded-full bg-[#F8F9FB] px-4 py-2 text-xs font-semibold text-[#E53E3E]"
                >
                    <X size={14} />
                    Recusar
                </button>
            </div>
        </>
    ),

    ecocreditos: (dados, onAcao) => (
        <>
            <div className="mt-1 flex w-fit items-center gap-3 rounded-xl bg-[#F8F9FB] py-2 pl-2 pr-8">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[9px] font-bold text-[#4CAF50]">
                    CO₂
                </span>
                <div className="flex flex-col">
                    <p className="text-xs font-semibold text-[#4CAF50]">
                        Compensação Estimada
                    </p>
                    <p className="text-[10px] text-[#4CAF50]/70">
                        Redução certificada de {dados.co2}kg CO₂ eq.
                    </p>
                </div>
            </div>

            <div className="mt-2 flex items-center gap-4">
                <button
                    onClick={() => onAcao?.("comprovante")}
                    className="flex cursor-pointer items-center gap-2 rounded-full bg-[#4CAF50] px-4 py-2 text-xs font-semibold text-white"
                >
                    <CircleCheck size={14} />
                    Ver comprovante de impacto
                </button>
                <button
                    onClick={() => onAcao?.("carteira")}
                    className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#4CAF50]"
                >
                    Ver saldo na Carteira
                    <ArrowRight size={14} />
                </button>
            </div>
        </>
    ),

    conta: (dados, onAcao) => (
        <button
            onClick={() => onAcao?.("perfil")}
            className="flex w-fit cursor-pointer items-center gap-1 text-xs font-semibold text-[#724BC2]"
        >
            Conferir selos no perfil
            <ChevronRight size={14} />
        </button>
    ),
    // desempenho não tem conteúdo extra
}

export default function CardNotificacoes({ tipo = "default", dados = {}, assunto, tempo, titulo, descricao, onAcao, }) {
    const [aberto, setAberto] = useState(false)

    const config = TIPOS[tipo] ?? TIPOS.default
    const conteudo = CONTEUDOS[tipo]?.(dados, onAcao)

    const abre = TIPOS_QUE_ABREM.includes(tipo)
    const mostrarDescricao = !abre || aberto

    return (
        <div
            onMouseEnter={() => abre && setAberto(true)}
            onMouseLeave={() => abre && setAberto(false)}
            className={`relative flex gap-4 overflow-hidden rounded-2xl bg-white p-6 shadow-sm ${
                abre ? "cursor-pointer" : ""
            }`}
        >

            {config.corBarra && (
                <span className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${config.corBarra}`} />
            )}

            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F8F9FB]">
                {config.icon(dados)}
            </div>

            <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        {assunto ?? config.assunto}
                    </p>
                    <p className="text-xs font-medium text-gray-500">{tempo}</p>
                </div>

                <h3 className={`text-lg font-semibold ${config.corTitulo}`}>{titulo}</h3>

                {mostrarDescricao && (
                    <p className="text-sm leading-relaxed text-gray-600">{descricao}</p>
                )}

                {conteudo}
            </div>
        </div>
    )
}