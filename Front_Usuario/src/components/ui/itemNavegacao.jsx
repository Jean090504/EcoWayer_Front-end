export default function ItemNavegacao({ Icone, texto }) {
    return (
        <button type = "button" className = "flex items-center gap-1.5 whitespace-nowrap">
            <Icone className = "h-[clamp(20px,1.46vw,28px)] w-[clamp(20px,1.46vw,28px)]" />
            <span className = "text-[length:clamp(14px,1.025vw,18px)] font-medium text-gray-600">
                {texto}
            </span>
        </button>
    );
}
