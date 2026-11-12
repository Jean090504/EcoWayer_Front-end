import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function InputLogin({ label, icone, placeholder, tipo, value, onChange }) {
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const senha = tipo === "password"
  const tipoFinal = senha && mostrarSenha ? "text" : tipo

  return (
    <div className="w-full">
      <p className="text-[clamp(16px,1vw,20px)] font-medium text-[#724BC2]">{label}</p>
      <div className="mt-3 w-[clamp(400px,25vw,450px)]">
        <div className="flex h-14 w-full items-center border-b-2 border-[#65BA69]">
          <img src={icone} alt="" className="h-6 w-6 shrink-0 object-contain" />
          <span aria-hidden="true" className="mx-3 h-7 w-[2px] shrink-0 bg-slate-200" />
          <input
            type={tipoFinal}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            autoComplete={senha ? "current-password" : "username"}
            className="h-full min-w-0 flex-1 bg-transparent pb-1 text-gray-600 outline-none placeholder:text-gray-400"
          />
          {senha && (
            <button type="button" onClick={() => setMostrarSenha((visivel) => !visivel)} aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"} className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
              {mostrarSenha ? <Eye size={25} strokeWidth={1.8} /> : <EyeOff size={25} strokeWidth={1.8} />}
            </button>
          )}
        </div>
        <div className="h-8" />
      </div>
    </div>
  )
}
