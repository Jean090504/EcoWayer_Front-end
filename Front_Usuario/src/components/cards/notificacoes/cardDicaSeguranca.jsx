import { ShieldCheck } from "lucide-react"

export default function CardDicaSeguranca() {
    return (
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-semibold text-[#191C1E]">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8F9FB]">
                    <ShieldCheck size={18} className="text-[#6F2DBD]" />
                </span>
                Dicas de Segurança
            </h2>
            <p className="text-sm leading-relaxed text-gray-600">
                Nunca realize pagamentos por fora da plataforma. As transações
                protegidas pelo Ecomarket SafeTrade garantem certificação de
                pesagem, Nota Fiscal de Resíduo e desbloqueio imediato de
                EcoCréditos no ato da retirada.
            </p>
            <a
                href="#"
                className="w-fit text-xs font-semibold text-[#6F2DBD] hover:underline"
            >
                Ler Diretrizes de Compliance ↗
            </a>
        </div>
    )
}