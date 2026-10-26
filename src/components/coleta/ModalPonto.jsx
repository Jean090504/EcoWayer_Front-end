import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge.jsx";
import TagMaterial from "./TagMaterial.jsx";
import { listarMateriais, atualizarPonto, atualizarEndereco,geocodificar } from "../../services/pontoColetaService.js";

const STATUS = [
  { valor: "ativo", rotulo: "Ativo", cor: "bg-green-500 text-white" },
  { valor: "inativo", rotulo: "Inativo", cor: "bg-red-500 text-white" },
];

// Campos editáveis do endereço (ajuste os nomes para os do seu banco)
const CAMPOS_ENDERECO = [
  { chave: "rua", rotulo: "Rua", largura: "col-span-2" },
  { chave: "numero", rotulo: "Número", largura: "" },
  { chave: "bairro", rotulo: "Bairro", largura: "" },
  { chave: "cep", rotulo: "CEP", largura: "" },
  { chave: "cidade", rotulo: "Cidade", largura: "" },
];

function Campo({ rotulo, children }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{rotulo}</p>
      <div className="mt-0.5 text-sm text-gray-800">{children}</div>
    </div>
  );
}

export default function ModalPonto({ ponto, onClose, onSaved }) {
  const [editando, setEditando] = useState(false);
  const [status, setStatus] = useState(ponto?.status);
  const [selecionados, setSelecionados] = useState([]);
  const [todosMateriais, setTodosMateriais] = useState([]);
  const [formEndereco, setFormEndereco] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const aoApertar = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", aoApertar);
    return () => window.removeEventListener("keydown", aoApertar);
  }, [onClose]);

  if (!ponto) return null;

  async function iniciarEdicao() {
    setErro(null);
    setStatus(ponto.status);
    setSelecionados(ponto.materiaisObj.map((m) => m.id).filter((id) => id != null));
    // copia os dados atuais do endereço para os inputs
    const end = ponto.enderecoObj ?? {};
    setFormEndereco(
      Object.fromEntries(CAMPOS_ENDERECO.map((c) => [c.chave, end[c.chave] ?? ""]))
    );
    setEditando(true);
    try {
      setTodosMateriais(await listarMateriais());
    } catch (e) {
      setErro(e.message);
    }
  }

  const cancelarEdicao = () => {
    setEditando(false);
    setErro(null);
  };

  const alternarMaterial = (id) =>
    setSelecionados((atual) => (atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]));

  const mudarEndereco = (chave, valor) => setFormEndereco((f) => ({ ...f, [chave]: valor }));

  async function salvar() {
    if (selecionados.length === 0) {
      setErro("Selecione ao menos 1 material aceito");
      return;
    }
    setSalvando(true);
    setErro(null);
    try {
      const end = ponto.enderecoObj;
      const mudouEndereco =
        end?.id != null && CAMPOS_ENDERECO.some((c) => String(formEndereco[c.chave] ?? "") !== String(end[c.chave] ?? ""));

      // 1) Se o endereço mudou, descobre as novas coordenadas ANTES de gravar qualquer coisa
      let coords = null;
      if (mudouEndereco) {
        coords = await geocodificar({ ...end, ...formEndereco });
        if (!coords) throw new Error("Não encontrei coordenadas para esse endereço. Confira os dados.");
        await atualizarEndereco(end.id, { ...end, ...formEndereco });
      }

      // 2) Atualiza o ponto com status, materiais e as coordenadas novas (se houver)
      await atualizarPonto(ponto, { status, materiaisIds: selecionados, coords });

      await onSaved?.();
      onClose();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{ponto.nome}</h2>
            <p className="text-xs text-gray-400">ID do ponto: #{ponto.id}</p>
          </div>
          <button onClick={onClose} className="text-xl leading-none text-gray-400 hover:text-gray-700">
            ×
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <Campo rotulo="Status">
            {editando ? (
              <div className="flex gap-2">
                {STATUS.map((s) => (
                  <button
                    key={s.valor}
                    onClick={() => setStatus(s.valor)}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                      status === s.valor ? s.cor : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {s.rotulo}
                  </button>
                ))}
              </div>
            ) : (
              <StatusBadge status={ponto.status} />
            )}
          </Campo>

          {/* Endereço: texto no modo normal, inputs no modo edição */}
          <Campo rotulo="Endereço">
            {editando && ponto.enderecoObj ? (
              <div className="grid grid-cols-2 gap-2">
                {CAMPOS_ENDERECO.map((c) => (
                  <label key={c.chave} className={`flex flex-col gap-0.5 ${c.largura}`}>
                    <span className="text-[10px] text-gray-400">{c.rotulo}</span>
                    <input
                      value={formEndereco[c.chave] ?? ""}
                      onChange={(e) => mudarEndereco(c.chave, e.target.value)}
                      className="rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-800 outline-none focus:border-purple-600"
                    />
                  </label>
                ))}
              </div>
            ) : (
              <>
                {ponto.endereco || "—"}
                {(ponto.cep || ponto.cidade) && (
                  <span className="block text-xs text-gray-500">
                    {[ponto.cep, ponto.cidade].filter(Boolean).join(" · ")}
                  </span>
                )}
              </>
            )}
          </Campo>

          <Campo rotulo="Materiais aceitos">
            {editando ? (
              <div className="flex flex-wrap gap-1">
                {todosMateriais.map((m) => {
                  const marcado = selecionados.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => alternarMaterial(m.id)}
                      className={`rounded-md border px-3 py-1 text-xs font-semibold transition ${
                        marcado
                          ? "border-purple-600 bg-purple-600 text-white"
                          : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {m.nome}
                    </button>
                  );
                })}
                {todosMateriais.length === 0 && !erro && <span className="text-xs text-gray-400">Carregando...</span>}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1">
                {ponto.materiais.length ? ponto.materiais.map((m) => <TagMaterial key={m} nome={m} />) : "—"}
              </div>
            )}
          </Campo>

          <Campo rotulo="Coordenadas">
            <span className="text-xs text-gray-500">
              {Number.isFinite(ponto.lat) ? `${ponto.lat}, ${ponto.lng}` : "Não informadas"}
            </span>
          </Campo>

          {erro && <p className="text-xs text-red-500">{erro}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          {editando ? (
            <>
              <button
                onClick={cancelarEdicao}
                disabled={salvando}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={salvar}
                disabled={salvando}
                className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-60"
              >
                {salvando ? "Salvando..." : "Salvar"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Fechar
              </button>
              <button
                onClick={iniciarEdicao}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
              >
                Editar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}