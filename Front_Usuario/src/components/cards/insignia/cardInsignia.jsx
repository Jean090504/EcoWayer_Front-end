import CardBase from "./cardBase"

const VARIANTES = {
    conquistado: {
        color: "bg-[#58A24E]",
    },
    em_progresso: {
        color: "bg-[#6F4BBF]",
    },
    bloqueado: {
        color: "bg-[#E53E3E]",
    },
    default: { 
        color: "bg-gray-400" 
    }
};

export default function CardInsignia({
    status = "conquistado",
    icon,
    badge,
    category,
    title,
    description,
    progress,
    footerLeft,
    footerRight,
}) {
    const { color } = VARIANTES[status] ?? VARIANTES.default;
    const percent =
        progress && progress.total > 0
            ? Math.min(100, (progress.value / progress.total) * 100)
            : 0

    return (
        <CardBase
            icon={icon}
            iconClassName={color}
            badge={badge}
            badgeClassName={`${color} text-white`}
            category={category}
            title={title}
            description={description}
            footerLeft={footerLeft}
            footerRight={footerRight}
            footerClassName={color}
        >
            {status === "em_progresso" && progress && (
                <div className="mt-3">
                    <p className="mb-1.5 text-xs text-gray-600">{progress.label}</p>
                    <div className="h-1.5 w-full rounded-full bg-gray-200">
                        <div
                            className={`h-full rounded-full ${color}`}
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                </div>
            )}
        </CardBase>
    )
}