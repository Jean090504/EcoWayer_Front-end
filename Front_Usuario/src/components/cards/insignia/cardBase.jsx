export default function CardBase({
  icon,
  iconClassName = "",
  badge,
  badgeClassName = "",
  category,
  title,
  description,
  children, // conteúdo extra entre o texto e o rodapé (ex: barra de progresso)
  footerLeft,
  footerRight,
  footerClassName = "",
}) {
  return (
    <div className="flex h-[308px] flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="flex flex-1 flex-col px-6 pt-6">
        
        <div className="flex items-start justify-between">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-xl text-white ${iconClassName}`}
          >
            {icon}
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClassName}`}
          >
            {badge}
          </span>
        </div>

        <div className="mt-auto pb-4">
          {category && (
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {category}
            </p>
          )}
          <h3 className="mt-1 text-xl font-semibold text-gray-900">{title}</h3>

          {description && (
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              {description}
            </p>
          )}

          {children}
        </div>
      </div>

      <div
        className={`flex items-center justify-between px-6 py-4 text-xs font-semibold text-white ${footerClassName}`}
      >
        <span>{footerLeft}</span>
        <span>{footerRight}</span>
      </div>
    </div>
  )
}