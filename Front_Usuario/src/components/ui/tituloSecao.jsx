export default function TituloSecao({ numero, children, opcional = false }) {
    return (
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-3 text-[22px] font-semibold text-[#6F2DBD]">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6F2DBD] text-xs font-bold text-white">
            {numero}
          </span>
          {children}
        </h3>
  
        {opcional && (
          <span className="text-xs font-semibold text-gray-600">Opcional</span>
        )}
      </div>
    )
  }