import { useEffect, useMemo, useState } from "react";
import Titulo from "../components/ui/titulo.jsx";
import SearchBar from "../components/dashboard/SearchBar.jsx";
import ListaPontos from "../components/coleta/ListaPontos.jsx";
import MapaPontos from "../components/coleta/MapaPontos.jsx";
import ModalPonto from "../components/coleta/ModalPonto.jsx";
import { listarPontos } from "../services/pontoColetaService.js";

// Remove acentos e deixa minúsculo para a busca não depender disso
const normalizar = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function Coleta() {
  // Pontos vindos da API
  const [pontos, setPontos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Texto digitado na barra de pesquisa
  const [termo, setTermo] = useState("");

  // Id do ponto selecionado (sincroniza lista <-> mapa)
  const [selecionadoId, setSelecionadoId] = useState(null);

  // Id do ponto aberto no modal (null = modal fechado)
  const [modalId, setModalId] = useState(null);
  const pontoDoModal = pontos.find((p) => p.id === modalId);

  // Busca os pontos na API quando a página abre
  useEffect(() => {
    listarPontos()
      .then((dados) => {
        setPontos(dados);
        setSelecionadoId(dados[0]?.id ?? null); // seleciona o primeiro ponto
      })
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  // Pontos filtrados pelo texto (nome, endereço, CEP, cidade ou material)
  const pontosFiltrados = useMemo(() => {
    const t = normalizar(termo.trim());
    if (!t) return pontos;
    return pontos.filter((p) =>
      normalizar([p.nome, p.endereco, p.cep, p.cidade, ...p.materiais].join(" ")).includes(t)
    );
  }, [termo, pontos]);

  return (
    // Página inteira (ocupa 80% ao lado da sidebar)
    <div className="min-h-screen w-[80%] pr-6">
      <Titulo texto="Pontos de Coleta" />

      {/* Barra de ações: pesquisa à esquerda, botões à direita */}
      <div className="mt-1 flex items-center justify-between gap-4 pl-[34px]">
        {/* Guarda a barra de pesquisa */}
        <div className="flex h-[50px] w-[492px] shrink-0">
          <SearchBar
            onSearch={setTermo}
            onFilterClick={() => console.log("Abrir Filtros")}
          />
        </div>

        {/* Botões de ação */}
        <div className="flex gap-3">
          <button className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700">
            Todos os Resíduos
          </button>
          <button className="rounded-lg bg-green-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-600">
            + Adicionar Ponto
          </button>
        </div>
      </div>

      {/* Avisos de carregamento e erro da API */}
      {carregando && <p className="mt-5 pl-[34px] text-sm text-gray-500">Carregando pontos...</p>}
      {erro && <p className="mt-5 pl-[34px] text-sm text-red-500">Não foi possível carregar os pontos: {erro}</p>}

      {/* Conteúdo principal: lista (esquerda) + mapa (direita) */}
      <div className="mt-5 flex gap-5 pl-[34px]">
        <ListaPontos
          pontos={pontosFiltrados}
          selecionadoId={selecionadoId}
          onSelect={setSelecionadoId}
          onGerenciar={setModalId} // recebe o id do card clicado e abre o modal
        />
        <MapaPontos pontos={pontosFiltrados} selecionadoId={selecionadoId} onSelect={setSelecionadoId} />
      </div>

      {/* Modal com as informações do ponto (só aparece quando há id selecionado) */}
      {pontoDoModal && <ModalPonto ponto={pontoDoModal} onClose={() => setModalId(null)} />}
    </div>
  );
}