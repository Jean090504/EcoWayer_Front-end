import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge.jsx";
import TagMaterial from "./TagMaterial.jsx";
import { listarMateriais, atualizarPonto } from "../../services/pontoColetaService.js";

// Opções de status (iguais ao STATUS_VALIDOS do controller) com a cor de cada uma
const STATUS = [
  { valor: "ativo", rotulo: "Ativo", cor: "bg-green-500 text-white" },
  { valor: "inativo", rotulo: "Inativo", cor: "bg-red-500 text-white" },
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
  const [selecionados, setSelecionados] = useState([]); // ids dos materiais marcados
  const [todosMateriais, setTodosMateriais] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  // Fecha o modal ao apertar ESC
  useEffect(() => {
    const aoApertar = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", aoApertar);
    return () => window.removeEventListener("keydown", aoApertar);
  }, [onClose]);

  if (!ponto) return null;

  // Entra no modo edição: copia os valores atuais e carrega a lista de materiais
  async function iniciarEdicao() {
    setErro(null);
    setStatus(ponto.status);
    setSelecionados(ponto.materiaisObj.map((m) => m.id).filter((id) => id != null));
    setEditando(true);
    try {
      setTodosMateriais(await listarMateriais());
    } catch (e) {
      setErro(e.message);
    }
  }

  function cancelarEdicao() {
    setEditando(false);
    setErro(null);
  }

  // Marca/desmarca um material
  const alternarMaterial = (id) =>
    setSelecionados((atual) => (atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]));

  async function salvar() {
    if (selecionados.length === 0) {
      setErro("Selecione ao menos 1 material aceito");
      return;
    }
    setSalvando(true);
    setErro(null);
    try {
      await atualizarPonto(ponto, { status, materiaisIds: selecionados });
      await onSaved?.(); // recarrega a lista na página
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
        {/* Cabeçalho */}
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
          {/* Status: badge no modo normal, botões coloridos no modo edição */}
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

          {/* Endereço */}
          <Campo rotulo="Endereço">
            {ponto.endereco || "—"}
            {(ponto.cep || ponto.cidade) && (
              <span className="block text-xs text-gray-500">
                {[ponto.cep, ponto.cidade].filter(Boolean).join(" · ")}
              </span>
            )}
          </Campo>

          {/* Materiais aceitos: tags no modo normal, chips selecionáveis na edição */}
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

          {/* Coordenadas */}
          <Campo rotulo="Coordenadas">
            <span className="text-xs text-gray-500">
              {Number.isFinite(ponto.lat) ? `${ponto.lat}, ${ponto.lng}` : "Não informadas"}
            </span>
          </Campo>

          {erro && <p className="text-xs text-red-500">{erro}</p>}
        </div>

        {/* Rodapé */}
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