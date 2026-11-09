import { useState } from "react"

export default function ModalExcluirItem({ item, aoFechar, aoConfirmar, salvando, erro }) {
  const confirmacao = `Deletar${item?.nome || ""}`
  const [texto, setTexto] = useState("")

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-[460px] rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-red-500">Ação permanente</p>
        <h2 className="mb-4 mt-1 text-xl font-extrabold tracking-tight text-slate-800">Excluir item</h2>
        <p className="mb-3 text-sm text-slate-700">Tem certeza que deseja excluir o item <strong>“{item?.nome}”</strong>?</p>
        <p className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm leading-relaxed text-red-800"><strong>Atenção:</strong> o item será removido definitivamente desta categoria.</p>
        <p className="mb-2 text-sm text-slate-700">Para confirmar, digite: <strong>“{confirmacao}”</strong></p>
        <input autoFocus value={texto} onChange={(event) => setTexto(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" />
        {erro && <p className="mt-2 text-sm text-red-600">{erro}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={aoFechar} disabled={salvando} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Cancelar</button>
          <button type="button" disabled={salvando} onClick={() => aoConfirmar(texto === confirmacao)} className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-50">{salvando ? "Excluindo..." : "Excluir item"}</button>
        </div>
      </div>
    </div>
  )
}
