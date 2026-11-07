import { useState } from "react"
import { ImageOff, Megaphone, ShieldAlert } from "lucide-react"
import { atualizarAlerta } from "../services/alertasService.js"

const acoes = [
  { codigo: "APROVADO_PELO_ADMIN", rotulo: "Aprovar Anúncio", estilo: "bg-[#65BA69] hover:bg-[#51a856]" },
  { codigo: "DESATIVADO_TEMPORARIAMENTE", rotulo: "Desativar Temporariamente", estilo: "bg-[#7350B9] hover:bg-[#6140a5]" },
  { codigo: "REMOVIDO_E_PENALIZADO", rotulo: "Remover Anúncio e Penalizar", estilo: "bg-[#E43E42] hover:bg-[#d12e32]" }
]

function ImagemAnuncio({ imagem, nome }) {
  const url = imagem?.url
  const [falhou, setFalhou] = useState(false)
  const disponivel = url && !url.includes("storage.ecowayer.test") && !falhou
  return <div className="flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f1f4f7] text-slate-400 sm:h-40 sm:w-40">
    {disponivel ? <img src={url} alt={nome} onError={() => setFalhou(true)} className="h-full w-full object-cover" /> : <div className="flex flex-col items-center gap-2"><ImageOff size={30} strokeWidth={1.4} /><span className="text-xs">Foto indisponível</span></div>}
  </div>
}

function Dado({ label, children, destaque = false }) {
  return <div className="rounded-lg border border-[#eef0f3] bg-white px-4 py-3"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className={`mt-1 text-sm font-semibold ${destaque ? "text-[#4da558]" : "text-slate-700"}`}>{children}</p></div>
}

export default function ChamadoIndividual({ aoVoltar, alerta }) {
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")
  const [perfilAberto, setPerfilAberto] = useState(false)
  const [confirmacao, setConfirmacao] = useState(null)
  const anuncio = alerta.anuncio?.[0]
  const denuncia = alerta.denuncia?.[0]
  const temDenuncia = Boolean(denuncia)
  const vendedor = anuncio?.usuario || alerta.usuario
  const data = anuncio?.data_publicacao ? new Date(anuncio.data_publicacao).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "Não informada"

  async function decidir(acao) {
    setSalvando(true)
    setErro("")
    try {
      await atualizarAlerta(alerta.id, { motivo: alerta.motivo, status: "RESOLVIDO", acao })
      aoVoltar()
    } catch (e) { setErro(e.message || "Não foi possível salvar a decisão.") }
    finally { setSalvando(false); setConfirmacao(null) }
  }

  return <div className="min-h-screen px-4 pb-10 pt-5 sm:px-7 lg:px-10">
    <button type="button" onClick={aoVoltar} className="text-sm font-semibold text-slate-500 hover:text-[#7350B9]">‹ Voltar para Chamados</button>
    <div className="mx-auto mt-3 max-w-[1400px]">
      <header className="flex flex-wrap items-center gap-3 pb-5">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Verificar Anúncio <span className="text-slate-400">#CH-{alerta.id}</span></h1>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${temDenuncia ? "bg-[#f1b434]" : "bg-[#7350B9]"}`}>{temDenuncia ? "Em Análise / Denúncia" : "Em Análise / Alerta"}</span>
        <span className="ml-auto text-xs font-semibold text-slate-500">Prioridade: <strong className="text-[#E43E42]">ALTA</strong></span>
      </header>

      {!temDenuncia && <section className="mb-5 flex flex-wrap items-center gap-4 rounded-xl border border-purple-100 bg-white px-5 py-4 shadow-sm">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#7350B9] text-white"><Megaphone size={25} /></div>
        <div className="min-w-0 flex-1"><h2 className="font-bold text-slate-800">Alerta da Inteligência Artificial: Atividade Suspeita / Conteúdo Irregular</h2><p className="mt-1 text-sm text-slate-600">{alerta.motivo}</p></div>
        <span className="rounded-md bg-purple-100 px-3 py-1 text-xs font-semibold text-[#7350B9]">Revisão humana</span>
      </section>}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.8fr)_minmax(280px,0.9fr)]">
        <main className="min-w-0 rounded-xl border border-[#e9edf1] bg-white p-4 shadow-sm sm:p-6">
          {anuncio ? <>
            <div className="flex flex-col gap-5 sm:flex-row">
              <ImagemAnuncio key={anuncio.id} imagem={anuncio.imagem?.[0]} nome={anuncio.nome} />
              <div className="min-w-0 flex-1">
                <span className="inline-block rounded-md bg-[#eaf6ec] px-2 py-1 text-xs font-semibold text-[#4da558]">{anuncio.categoria?.nome || "Categoria não informada"}</span>
                <h2 className="mt-2 text-lg font-bold text-slate-900 sm:text-xl">{anuncio.nome}</h2>
                <p className="mt-1 text-xs text-slate-500">Publicado em {data}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-[#f7f8fa] p-3">
                  <div><p className="text-xs text-slate-400">Modalidade</p><strong className="text-sm text-[#E43E42]">{anuncio.modalidade?.nome || "Não informada"}</strong></div>
                  <div><p className="text-xs text-slate-400">Pontuação da categoria</p><strong className="text-sm text-slate-800">{anuncio.categoria?.pontos ?? "—"} pts</strong></div>
                </div>
              </div>
            </div>
            <div className="mt-6"><h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">Descrição do anúncio</h3><p className="mt-2 min-h-24 rounded-lg bg-[#f7f8fa] p-4 text-sm leading-relaxed text-slate-700">{anuncio.descricao || "Sem descrição cadastrada."}</p></div>
            {temDenuncia && <div className="mt-5 rounded-lg border border-amber-100 bg-amber-50 p-4"><h3 className="flex items-center gap-2 text-sm font-bold text-amber-800"><ShieldAlert size={18} /> Denúncia recebida{denuncia.tipo_denuncia?.tipo ? ` · ${denuncia.tipo_denuncia.tipo}` : ""}</h3><p className="mt-2 text-sm text-slate-700">{denuncia.descricao || alerta.motivo}</p>{denuncia.denunciante?.nome && <p className="mt-2 text-xs text-slate-500">Enviada por {denuncia.denunciante.nome}</p>}</div>}
            <div className="mt-5 grid gap-3 sm:grid-cols-3"><Dado label="Condição">{anuncio.condicao_item?.nome || "—"}</Dado><Dado label="Modalidade">{anuncio.modalidade?.nome || "—"}</Dado><Dado label="Pontos ecológicos" destaque>+{anuncio.categoria?.pontos ?? 0} pontos</Dado></div>
          </> : <div className="rounded-lg bg-amber-50 p-6 text-sm text-amber-800">Este alerta não possui anúncio vinculado. Confira o motivo antes de registrar uma decisão.</div>}
        </main>

        <aside className="space-y-5">
          <section className="rounded-xl border border-[#e9edf1] bg-white p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400">Dados do vendedor</h2>
            <div className="mt-4 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600">{(vendedor?.nome || "?").slice(0, 2).toUpperCase()}</div><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-800">{vendedor?.nome || "Não informado"}</p><p className="text-xs text-slate-500">Usuário #{vendedor?.id || "—"}</p></div></div>
            <div className="mt-5 border-t pt-4 text-sm text-slate-600"><p>Categoria do item: <strong className="float-right text-slate-800">{anuncio?.categoria?.nome || "—"}</strong></p><p className="mt-3">Condição: <strong className="float-right text-slate-800">{anuncio?.condicao_item?.nome || "—"}</strong></p></div>
            <button type="button" onClick={() => setPerfilAberto(!perfilAberto)} className="mt-5 w-full rounded-lg bg-[#f4f5f7] px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">{perfilAberto ? "Ocultar Dados do Usuário" : "Ver Perfil Completo do Usuário"}</button>
            {perfilAberto && <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600"><p>Nome: {vendedor?.nome || "Não informado"}</p><p className="mt-1">ID: {vendedor?.id || "Não informado"}</p><p className="mt-1">Anúncio: #{anuncio?.id || "—"}</p>{alerta.usuario?.id === vendedor?.id && <><p className="mt-1">Status: {alerta.usuario.status_usuario?.status || "Não informado"}</p><p className="mt-1">Nível de impacto: {alerta.usuario.nivel_impacto?.nome || "Não informado"}</p></>}</div>}
          </section>
          <section className="rounded-xl border border-[#e9edf1] bg-white p-5 shadow-sm"><h2 className="text-xs font-bold uppercase tracking-wide text-slate-400">Ações do administrador</h2><div className="mt-5 flex flex-col gap-2">{acoes.map((item) => <button key={item.codigo} type="button" disabled={salvando || !anuncio} onClick={() => setConfirmacao(item)} className={`rounded-lg px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${item.estilo}`}>{item.rotulo}</button>)}</div><p className="mt-3 text-xs leading-relaxed text-slate-500">A decisão será registrada no chamado. A ocultação do anúncio na plataforma depende da integração de moderação.</p></section>
        </aside>
      </div>
      {erro && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">{erro}</p>}
    </div>

    {confirmacao && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/45 p-4" onMouseDown={() => !salvando && setConfirmacao(null)}><div role="dialog" aria-modal="true" aria-label="Confirmar decisão" onMouseDown={(e) => e.stopPropagation()} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><h2 className="text-lg font-bold text-slate-900">Confirmar decisão</h2><p className="mt-3 text-sm text-slate-600">Registrar “{confirmacao.rotulo}” para o chamado #{alerta.id}?</p><div className="mt-6 flex justify-end gap-3"><button type="button" disabled={salvando} onClick={() => setConfirmacao(null)} className="rounded-lg border px-4 py-2 text-sm">Cancelar</button><button type="button" disabled={salvando} onClick={() => decidir(confirmacao.codigo)} className="rounded-lg bg-[#7350B9] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{salvando ? "Salvando..." : "Confirmar"}</button></div></div></div>}
  </div>
}
