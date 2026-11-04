import { Star } from "lucide-react"

export default function CardDadosVendedor({
    nome = "Carlos Eduardo M.",
    email = "carlos.eduardo@email.com",
    nota = 4.8,
    avaliacoes = 34,
    tempoPlataforma = "3 anos",
    anunciosAtivos = 12,
    denuncias = 0,
    verificado = true,
    onVerPerfil
}) {
    const iniciais = nome
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join("")
        .toUpperCase()

    return (
        <div className = "flex flex-col bg-white w-full min-w-0 rounded-lg shadow-md mt-4 p-6">
            <h4 className = "text-[clamp(10px,0.8vw,12px)] font-semibold tracking-wider text-[#8A8A8A] uppercase">Dados do vendedor</h4>

            {/* Perfil */}
            <div className = "flex flex-row items-center gap-3 mt-4">
                <div className = "w-[clamp(38px,3.4vw,46px)] h-[clamp(38px,3.4vw,46px)] rounded-full bg-[#E5E7EB] flex items-center justify-center font-bold text-[clamp(13px,1.1vw,16px)] text-[#4B5563] shrink-0">
                    {iniciais}
                </div>

                <div className = "flex flex-col min-w-0">
                    <span className = "font-bold text-[clamp(14px,1.1vw,16px)] text-[#111827] truncate">{nome}</span>
                    <span className = "text-[clamp(10px,0.8vw,12px)] text-[#6B7280] truncate">{email}</span>
                    <div className = "flex flex-row items-center gap-1 text-[clamp(10px,0.8vw,12px)]">
                        <span className = "font-semibold text-[#F59E0B]">{nota.toFixed(1).replace(".", ",")}</span>
                        <Star size = {12} className = "text-[#F59E0B] fill-[#F59E0B] shrink-0"/>
                        <span className = "text-[#9CA3AF] truncate">({avaliacoes} avaliações)</span>
                    </div>
                </div>
            </div>

            <hr className = "border-t border-[#E5E7EB] mt-4" />

            {/* Informações */}
            <div className = "flex flex-col gap-3 mt-4 text-[clamp(11px,0.9vw,13px)]">
                <div className = "flex flex-row justify-between items-center gap-3">
                    <span className = "text-[#6B7280] min-w-0 truncate">Tempo na plataforma:</span>
                    <span className = "font-semibold text-[#111827] shrink-0">{tempoPlataforma}</span>
                </div>

                <div className = "flex flex-row justify-between items-center gap-3">
                    <span className = "text-[#6B7280] min-w-0 truncate">Anúncios ativos:</span>
                    <span className = "font-semibold text-[#111827] shrink-0">{anunciosAtivos}</span>
                </div>

                <div className = "flex flex-row justify-between items-center gap-3">
                    <span className = "text-[#6B7280] min-w-0 truncate">Denúncias procedentes:</span>
                    <span className = "font-bold text-[#DC2626] shrink-0">
                        {denuncias} registradas
                    </span>
                </div>

                <div className = "flex flex-row justify-between items-center gap-3">
                    <span className = "text-[#6B7280] min-w-0 truncate">Verificação de identidade:</span>
                    <span className = {`text-[clamp(10px,0.8vw,12px)] font-semibold px-2 py-0.5 rounded shrink-0 ${verificado ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#FEE2E2] text-[#B91C1C]"}`}>
                        {verificado ? "Verificado" : "Não verificado"}
                    </span>
                </div>
            </div>

            {/* Botão */}
            <button
                type = "button"
                onClick = {onVerPerfil}
                className = "mt-5 w-full py-3 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[clamp(10px,0.8vw,12px)] font-semibold text-[#111827] cursor-pointer"
            >
                Ver Perfil Completo do Usuário
            </button>
        </div>
    )
}