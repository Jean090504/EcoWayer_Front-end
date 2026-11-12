export default function ModalExcluirCategoria({ categoria, aoFechar, aoConfirmar, salvando, erro }) {
  const confirmacao = `Deletar${categoria?.nome || ""}`
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
    <div className="w-full max-w-[460px] rounded-xl bg-white p-5 shadow-2xl">
      <h2 className="mb-5 text-center text-lg font-bold text-slate-900">Excluir Categoria</h2>
      <p className="mb-3 text-sm text-slate-700">Tem certeza que deseja excluir a categoria <strong>“{categoria?.nome}”</strong>?</p>
      <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800"><strong>Atenção:</strong> Esta categoria possui {categoria?.itens?.length || 0} itens cadastrados. Se você continuar, todos os itens serão apagados permanentemente.</p>
      <p className="mb-2 text-sm text-slate-700">Para confirmar, digite o nome da categoria: <strong>“{confirmacao}”</strong></p>
      <input autoFocus id="confirmar-exclusao" className="mb-2 h-10 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-red-400" onChange={(e) => e.target.dataset.valor = e.target.value} />
      {erro && <p className="mb-2 text-sm text-red-600">{erro}</p>}
      <div className="mt-4 flex justify-end gap-2"><button type="button" onClick={aoFechar} className="rounded-lg border px-4 py-2 text-sm">Cancelar</button><button type="button" disabled={salvando} onClick={() => aoConfirmar(document.getElementById("confirmar-exclusao").value === confirmacao)} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{salvando ? "Excluindo..." : "Excluir Tudo"}</button></div>
    </div>
  </div>
}
