import { useCallback, useEffect, useMemo, useState } from "react";
import SearchBar from "../components/dashboard/SearchBar.jsx";
import ListaPontos from "../components/coleta/ListaPontos.jsx";
import MapaPontos from "../components/coleta/MapaPontos.jsx";
import ModalPonto from "../components/coleta/ModalPonto.jsx";
import ModalNovoPonto from "../components/coleta/ModalNovoPonto.jsx";
import { listarPontos, buscarPontosOpenStreetMap, atualizarPonto } from "../services/pontoColetaService.js";

// Remove acentos e deixa minúsculo para a busca não depender disso
const normalizar = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function Coleta() {
  const [pontos, setPontos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [termo, setTermo] = useState("");
  const [selecionadoId, setSelecionadoId] = useState(null);
  const [pontosExternos, setPontosExternos] = useState([]);
  const [buscandoExternos, setBuscandoExternos] = useState(false);
  const [erroExterno, setErroExterno] = useState(null);
  const [pontoParaCadastrar, setPontoParaCadastrar] = useState(null);
  const [statusAlterandoId, setStatusAlterandoId] = useState(null);

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

  useEffect(() => {
    const busca = termo.trim();
    if (busca.length < 3) {
      setPontosExternos([]);
      setErroExterno(null);
      return undefined;
    }
    const timer = setTimeout(async () => {
      setBuscandoExternos(true);
      try {
        setPontosExternos(await buscarPontosOpenStreetMap(busca));
        setErroExterno(null);
      } catch {
        setPontosExternos([]);
        setErroExterno("Não foi possível consultar os pontos públicos agora.");
      } finally {
        setBuscandoExternos(false);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [termo]);

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

  const aoAlterarStatus = useCallback(async (ponto) => {
    const novoStatus = ponto.status === "ativo" ? "inativo" : "ativo";
    setStatusAlterandoId(ponto.id);
    try {
      await atualizarPonto(ponto, {
        status: novoStatus,
        materiaisIds: ponto.materiaisObj.map((material) => material.id).filter((id) => id != null),
        coords: null,
      });
      setPontos((atual) => atual.map((item) => item.id === ponto.id ? { ...item, status: novoStatus } : item));
    } catch (e) {
      setErro(e.message);
    } finally {
      setStatusAlterandoId(null);
    }
  }, []);

  const pontosFiltrados = useMemo(() => {
    const t = normalizar(termo.trim());
    if (!t) return pontos;
    const locais = pontos.filter((p) =>
      normalizar([p.nome, p.endereco, p.cep, p.cidade, ...p.materiais].join(" ")).includes(t)
    );
    return locais.length ? locais : pontosExternos;
  }, [termo, pontos, pontosExternos]);

  return (
    <div className="min-h-full bg-[#f6f7fb] pb-10">
      <main className="mx-auto w-full max-w-[1800px] px-5 py-7 sm:px-8 lg:px-10">
        <header className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#65BA69]">Operação</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">Pontos de coleta</h1>
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-[#7350B9] shadow-sm transition hover:border-[#7350B9] hover:bg-violet-50">Todos os resíduos</button>
            <button onClick={() => setNovoAberto(true)} className="rounded-xl bg-[#65BA69] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#51a856]">+ Adicionar ponto</button>
          </div>
        </header>

        <div className="flex items-center justify-between gap-4">
          <div className="flex w-full max-w-[500px] shrink-0">
          <SearchBar maxWidth="max-w-none" onSearch={setTermo} />
          </div>
        </div>

        {carregando && <p className="mt-4 rounded-xl bg-white p-4 text-sm text-slate-500 shadow-sm">Carregando pontos...</p>}
        {erro && <p className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-500">Não foi possível carregar os pontos: {erro}</p>}
        {buscandoExternos && <p className="mt-3 text-xs text-slate-500">Consultando pontos públicos próximos...</p>}
        {erroExterno && <p className="mt-3 text-xs text-orange-600">{erroExterno}</p>}

      <div className="mt-5 flex flex-col gap-5 xl:flex-row">
        <ListaPontos
          pontos={pontosFiltrados}
          selecionadoId={selecionadoId}
          onSelect={setSelecionadoId}
          onGerenciar={setModalId}
          onCadastrar={setPontoParaCadastrar}
          onAlterarStatus={aoAlterarStatus}
          statusAlterandoId={statusAlterandoId}
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

      {(novoAberto || pontoParaCadastrar) && (
        <ModalNovoPonto
          onClose={() => { setNovoAberto(false); setPontoParaCadastrar(null); }}
          pontoInicial={pontoParaCadastrar}
          onSaved={async (idNovo) => {
            await carregar();
            if (idNovo) setSelecionadoId(idNovo);
            setPontoParaCadastrar(null);
            setNovoAberto(false);
          }}
        />
      )}
      </main>
    </div>
  );
}
