import { useState } from "react"
import { CheckCheck, Settings } from "lucide-react"

import CardNotificacoes, { ABAS, abaDoTipo } from "../components/cards/notificacoes/cardNotificacoes"
import CardCarteiraEcologica from "../components/cards/notificacoes/cardCarteiraEcologica"
import CardDicaSeguranca from "../components/cards/notificacoes/cardDicaSeguranca"
import CardEcoPonto from "../components/cards/notificacoes/cardEcoPonto"

const RESUMO_NOTIFICACOES = {
    novas: 3,
}

const NOTIFICACOES = [
    {
        id: 1,
        tipo: "moderacao",
        tempo: "Há 45 minutos",
        titulo: "Anúncio removido por infração às diretrizes ambientais",
        descricao:
            'O anúncio "Tambores de Óleo Usado sem Rótulo 200L" #ECO-77412 foi retirado da plataforma temporariamente. Identificamos que o material foi classificado incorretamente como resíduo reciclável comum em vez de resíduo industrial de classe I, necessitando de Certificado de Destinação Final (CDF) e operador homologado.',
    },
    {
        id: 2,
        tipo: "proposta",
        dados: {
            nome: "Carla Silveira",
            foto: "/carla-silveira.jpg",
            retirada: "Amanhã - 14:00 • Caminhão Baú Pequeno",
        },
        tempo: "Há 2 horas",
        titulo: "Nova proposta recebida para o seu anúncio",
        descricao:
            'Carla Silveira (Cooperativa ReciclaMais) enviou uma contraproposta de permuta no seu anúncio "Lote Garrafas Vidro Âmbar": ofereceu 150kg de PET prensado + agendamento de retirada em doca própria para amanhã às 14h.',
    },
    {
        id: 3,
        tipo: "ecocreditos",
        assunto: "+120 pts",
        dados: { co2: 42 },
        tempo: "Ontem às 17:30",
        titulo: "Você recebeu +120 EcoCréditos!",
        descricao:
            "Parabéns! Sua transação de 80kg de papelão ondulado com o operador Marcos Albuquerque foi confirmada com sucesso em um EcoPonto autorizado. Seus créditos ecológicos já foram consolidados no seu balanço.",
    },
    {
        id: 4,
        tipo: "desempenho",
        tempo: "Há 1 dia",
        titulo: "Seu anúncio está ganhando destaque",
        descricao:
            'O anúncio "Paletes de Madeira PBR" atingiu mais de 50 visualizações e 6 usuários salvaram nos favoritos nas últimas 24 horas. Aproveite o momento de alta procura de cooperativas industriais para fechar negócio.',
    },
    {
        id: 5,
        tipo: "conta",
        tempo: "Há 3 dias",
        titulo: "Selo de Vendedor ESG Nível 1 Concedido",
        descricao:
            "Você completou 5 transações com destinação 100% rastreada e auditoria aprovada. Seu perfil agora exibe a insígnia de comerciante confiável com maior visibilidade no feed geral de compradores.",
    }
]

const CARTEIRA_TESTE = {
    tituloCarteira: "Sua Carteira Ecológica",
    carteiraAtiva: true,
    saldoEcoCreditos: 480,
    co2Compensado: 192,
    percentualMeta: 70,
    tituloMeta: "Meta Mensal ESG",
    ecocreditosRestantes: 70,
    insigniaMeta: "Ouro",
    textoBotaoResgate: "Resgatar benefícios",
}

const ECOPONTO_TESTE = {
    nome: "EcoPonto Central Lapa",
    distancia: "3.0",
    horarioFuncionamento: "18",
}

export default function Notificacoes() {
    const [aba, setAba] = useState("todas")

    function totalDaAba(valor) {
        if (valor === "todas") return NOTIFICACOES.length
        return NOTIFICACOES.filter((n) => abaDoTipo(n.tipo) === valor).length
    }

    const visiveis = NOTIFICACOES.filter(
        (n) => aba === "todas" || abaDoTipo(n.tipo) === aba
    )

    function tratarAcao(notificacao, acao) {
        console.log(notificacao.id, acao)
    }

    return (
        <main className="flex w-full flex-1 justify-center bg-[#FAF8FF]">
            <div className="flex w-[85%] flex-col gap-6 px-6 py-10">

                {/* Cabeçalho */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-[32px] font-bold text-[#191C1E]">Notificações</h1>
                        <span className="flex items-center gap-1.5 rounded-full bg-[#F1E9FB] px-3 py-1 text-xs font-semibold text-[#6F2DBD]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#6F2DBD]" />
                            {RESUMO_NOTIFICACOES.novas} novas
                        </span>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#191C1E] shadow-sm">
                            <CheckCheck size={14} className="text-[#4CAF50]" />
                            Marcar todas como lidas
                        </button>
                        <button className="flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#191C1E] shadow-sm">
                            <Settings size={14} />
                            Preferências
                        </button>
                    </div>
                </div>

                {/* Abas */}
                <div className="flex flex-wrap gap-2 rounded-2xl bg-white p-2 shadow-sm">
                    {ABAS.map((a) => (
                        <button
                            key={a.value}
                            onClick={() => setAba(a.value)}
                            className={`flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition ${aba === a.value
                                    ? "bg-[#724BC2] text-white"
                                    : "text-[#191C1E] hover:bg-gray-100"
                                }`}
                        >
                            {a.label}
                            <span
                                className={`rounded-full px-2 py-0.5 text-[10px] ${aba === a.value ? "bg-white/25" : "bg-gray-100"
                                    }`}
                            >
                                {totalDaAba(a.value)}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Lista e a barra lateral */}
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_390px]">

                    <section className="flex flex-col gap-6">
                        {visiveis.map((n) => (
                            <CardNotificacoes
                                key={n.id}
                                tipo={n.tipo}
                                dados={n.dados}
                                assunto={n.assunto}
                                tempo={n.tempo}
                                titulo={n.titulo}
                                descricao={n.descricao}
                                onAcao={(acao) => tratarAcao(n, acao)}
                            />
                        ))}

                        {visiveis.length === 0 && (
                            <p className="rounded-2xl bg-white p-6 text-sm text-gray-600 shadow-sm">
                                Nenhuma notificação nesta aba.
                            </p>
                        )}
                    </section>

                    {/* Barra lateral */}
                    <aside className="flex flex-col gap-6">

                        {/* Carteira ecológica */}
                        <CardCarteiraEcologica
                            tituloCarteira={CARTEIRA_TESTE.tituloCarteira}
                            carteiraAtiva={CARTEIRA_TESTE.carteiraAtiva}
                            saldoEcoCreditos={CARTEIRA_TESTE.saldoEcoCreditos}
                            co2Compensado={CARTEIRA_TESTE.co2Compensado}
                            percentualMeta={CARTEIRA_TESTE.percentualMeta}
                            tituloMeta={CARTEIRA_TESTE.tituloMeta}
                            ecocreditosRestantes={CARTEIRA_TESTE.ecocreditosRestantes}
                            insigniaMeta={CARTEIRA_TESTE.insigniaMeta}
                            textoBotaoResgate={CARTEIRA_TESTE.textoBotaoResgate}
                        />

                        {/* Dicas de segurança */}
                        <CardDicaSeguranca />

                        {/* EcoPonto próximo */}
                        <CardEcoPonto
                            nome = {ECOPONTO_TESTE.nome}
                            distancia = {ECOPONTO_TESTE.distancia}
                            horarioFuncionamento = {ECOPONTO_TESTE.horarioFuncionamento}
                        />
                    </aside>
                </div>
            </div>
        </main>
    )
}