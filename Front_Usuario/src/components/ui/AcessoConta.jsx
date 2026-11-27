import { LogIn } from "lucide-react"

export default function AcessoConta({ icone: Icone, titulo, descricao, onEntrar }) {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center rounded-[28px] border border-[#E8E2F2] bg-white px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F1EBFC] text-[#724BC2]">
        <Icone size={32} aria-hidden="true" />
      </span>
      <h2 className="text-2xl font-bold leading-tight text-[#241D2E] sm:text-[28px]">{titulo}</h2>
      <p className="mt-3 max-w-md text-base leading-relaxed text-[#5D5667]">{descricao}</p>
      <button type="button" onClick={onEntrar} className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#724BC2] px-8 font-semibold text-white transition hover:bg-[#603BAE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724BC2]">
        <LogIn size={18} aria-hidden="true" /> Entrar na conta
      </button>
    </section>
  )
}
