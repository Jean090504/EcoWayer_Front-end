import { useCallback, useEffect, useMemo, useState } from "react";
import Titulo from "../components/ui/titulo.jsx";
import SearchBar from "../components/dashboard/SearchBar.jsx";
import ListaPontos from "../components/coleta/ListaPontos.jsx";
import MapaPontos from "../components/coleta/MapaPontos.jsx";
import ModalPonto from "../components/coleta/ModalPonto.jsx";
import ModalNovoPonto from "../components/coleta/ModalNovoPonto.jsx";
import { listarPontos } from "../services/pontoColetaService.js";

// Remove acentos e deixa minúsculo para a busca não depender disso
const normalizar = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function Coleta() {
  const [pontos, setPontos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [termo, setTermo] = useState("");
  const [selecionadoId, setSelecionadoId] = useState(null);

  // Modal de edição (id do ponto) e modal de cadastro (aberto/fechado)
  const [modalId, setModalId] = useState(null);
  const [novoAberto, setNovoAberto] = useState(false);
  const pontoDoModal = pontos.find((p) => p.id === modalId);

  // Busca os pontos na API e atualiza os cards
  const carregar = useCallback(async () => {
    try {
      const dados = await listarPontos();
      setPontos(dados);
      // mantém a seleção se o ponto ainda existe; senão seleciona o primeiro (ou nenhum)
      setSelecionadoId((atual) => (dados.some((p) => p.id === atual) ? atual : dados[0]?.id ?? null));
      setErro(null);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Atualiza os cards depois de excluir: tira o ponto da tela na hora e confirma com o servidor
  const aoExcluir = useCallback(
    async (idExcluido) => {
      setModalId(null);
      setPontos((atual) => atual.filter((p) => p.id !== idExcluido));
      setSelecionadoId((atual) => (atual === idExcluido ? null : atual));
      await carregar(); // reseleciona o primeiro ponto se a seleção ficou vazia
    },
    [carregar]
  );

  const pontosFiltrados = useMemo(() => {
    const t = normalizar(termo.trim());
    if (!t) return pontos;
    return pontos.filter((p) =>
      normalizar([p.nome, p.endereco, p.cep, p.cidade, ...p.materiais].join(" ")).includes(t)
    );
  }, [termo, pontos]);

  return (
    <div className="min-h-screen w-[80%] pr-6">
      <Titulo texto="Pontos de Coleta" />

      <div className="mt-1 flex items-center justify-between gap-4 pl-[34px]">
        <div className="flex h-[50px] w-[492px] shrink-0">
          <SearchBar onSearch={setTermo} onFilterClick={() => console.log("Abrir Filtros")} />
        </div>

        <div className="flex gap-3">
          <button className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700">
            Todos os Resíduos
          </button>
          <button
            onClick={() => setNovoAberto(true)}
            className="rounded-lg bg-green-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-600"
          >
            + Adicionar Ponto
          </button>
        </div>
      </div>

      {carregando && <p className="mt-5 pl-[34px] text-sm text-gray-500">Carregando pontos...</p>}
      {erro && <p className="mt-5 pl-[34px] text-sm text-red-500">Não foi possível carregar os pontos: {erro}</p>}

      <div className="mt-5 flex gap-5 pl-[34px]">
        <ListaPontos
          pontos={pontosFiltrados}
          selecionadoId={selecionadoId}
          onSelect={setSelecionadoId}
          onGerenciar={setModalId}
        />
        <MapaPontos pontos={pontosFiltrados} selecionadoId={selecionadoId} onSelect={setSelecionadoId} />
      </div>

      {pontoDoModal && (
        <ModalPonto
          ponto={pontoDoModal}
          onClose={() => setModalId(null)}
          onSaved={carregar}
          onDeleted={aoExcluir}
        />
      )}

      {novoAberto && (
        <ModalNovoPonto
          onClose={() => setNovoAberto(false)}
          onSaved={async (idNovo) => {
            await carregar();
            if (idNovo) setSelecionadoId(idNovo);
          }}
        />
      )}
    </div>
  );
}