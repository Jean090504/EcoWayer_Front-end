export default function ItemNavegacao({ Icone, texto, onClick }) {
    return (
        <button type = "button" onClick={onClick} className = "group flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition">
            <Icone className = "h-[clamp(20px,1.46vw,28px)] w-[clamp(20px,1.46vw,28px)] text-[#5A665D] group-hover:text-[#58A24D]" />
            <span className = "text-[length:clamp(14px,1.025vw,18px)] font-medium text-[#5A665D] group-hover:text-[#58A24D]">
                {texto}
            </span>
        </button>
    )
}
