import { Wallet, Gift } from "lucide-react"

export default function CardCarteiraEcologica({ tituloCarteira = "Sua Carteira Ecológica", carteiraAtiva = true, saldoEcoCreditos = 480, co2Compensado = 192, percentualMeta = 68, tituloMeta = "Meta Mensal ESG", ecocreditosRestantes = 70, insigniaMeta = "Ouro", textoBotaoResgate = "Resgatar benefícios", onResgatar, }) {
    return (
        <div className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-base font-semibold text-[#191C1E]">
                    <Wallet size={18} className="text-[#4CAF50]" />
                    {tituloCarteira}
                </h2>
                <span className={`rounded-full px-3 py-0.5 text-[11px] font-semibold text-white ${carteiraAtiva ? "bg-[#4CAF50]" : "bg-gray-400"}`}>
                    {carteiraAtiva ? "Ativa" : "Inativa"}
                </span>
            </div>

            <div className="flex flex-col gap-2 rounded-2xl bg-[#F8F9FB] p-4">
                <p className="text-[11px] font-medium uppercase text-gray-600">
                    Saldo atual
                </p>
                <p className="flex items-baseline gap-2">
                    <span className="text-[40px] font-bold leading-none text-[#4CAF50]">
                        {saldoEcoCreditos}
                    </span>
                    <span className="text-base font-semibold text-[#191C1E]">
                        EcoCréditos
                    </span>
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
                    style={{
                        background: `conic-gradient(#4CAF50 0 ${percentualMeta}%, #E5E7EB ${percentualMeta}% 100%)`,
                    }}
                >
                    <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#191C1E]">
                        {percentualMeta}%
                    </span>
                </div>
                <div className="flex flex-col">
                    <p className="text-xs font-bold text-[#191C1E]">{tituloMeta}</p>
                    <p className="text-xs text-gray-600">
                        Faltam {ecocreditosRestantes} EcoCréditos para atingir a insígnia {insigniaMeta} deste mês.
                    </p>
                </div>
            </div>

            <button
                onClick={onResgatar}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#4CAF50] py-3 text-sm font-semibold text-white"
            >
                <Gift size={16} />
                {textoBotaoResgate}
            </button>
        </div>
    )
}