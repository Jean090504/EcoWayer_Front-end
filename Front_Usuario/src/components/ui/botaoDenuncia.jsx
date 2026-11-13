export default function BotaoDenuncia({ icon, title, description, value, name = "motivo", checked = false, onChange }) {
    return (
      <label
        className={`flex cursor-pointer items-center gap-5 rounded-2xl border p-5 transition ${
          checked
            ? "border-[#E53E3E]/40 bg-[#FFF5F5]"
            : "border-transparent bg-[#F8F9FB] hover:bg-gray-100"
        }`}
      >
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange?.(value)}
          className="h-4 w-4 shrink-0 cursor-pointer accent-[#E53E3E]"
        />

        <div className="flex flex-col gap-1">
          <p className="flex items-center gap-2 text-sm font-semibold text-[#E53E3E]">
            {icon}
            {title}
          </p>
          <p className="text-sm leading-snug text-[#191C1E]">{description}</p>
        </div>
      </label>
    )
  }