import { useState } from "react";
import Titulo from "../components/ui/titulo.jsx";
import SearchBar from "../components/dashboard/SearchBar.jsx";
import ListaPontos from "../components/coleta/ListaPontos.jsx";
import MapaPontos from "../components/coleta/MapaPontos.jsx";

// Dados de exemplo (troque pelo fetch da sua API /admin/ponto_coleta)
const PONTOS = [
  { id: 1, nome: "Eco Ponto Pinheiros", endereco: "Av. Brigadeiro Faria Lima, 1811", status: "ativo", capacidade: 75, horario: "Seg - Sáb (08:00 às 18:00)", materiais: ["Plásticos", "Metais", "Vidros"], pos: { x: 36, y: 52 } },
  { id: 2, nome: "Unidade Vila Mariana", endereco: "Rua Domingos de Morais, 820", status: "ativo", capacidade: 42, horario: "Seg - Sex (08:00 às 17:00)", materiais: ["Eletrônicos", "Pilhas & Bat."], pos: { x: 60, y: 73 } },
  { id: 3, nome: "Ecoponto Moema Verde", endereco: "Av. Ibirapuera, 2030", status: "ativo", capacidade: 88, horario: "Seg - Dom (07:00 às 19:00)", materiais: ["Orgânicos", "Papelão", "Plásticos"], pos: { x: 78, y: 62 } },
  { id: 4, nome: "Estação Santana Norte", endereco: "Rua Voluntários da Pátria, 1420", status: "manutencao", capacidade: 15, horario: "Seg - Sex (09:00 às 16:00)", materiais: ["Plásticos", "Plásticos"], pos: { x: 65, y: 18 } },
];

export default function Coleta() {
  // Id do ponto selecionado (sincroniza lista <-> mapa)
  const [selecionadoId, setSelecionadoId] = useState(1);

  return (
    // Página inteira (ocupa 80% ao lado da sidebar)
    <div className="min-h-screen w-[80%] pr-6">
      <Titulo texto="Pontos de Coleta" />

      {/* Barra de ações: pesquisa à esquerda, botões à direita */}
      <div className="mt-1 flex items-center justify-between gap-4 pl-[34px]">
        {/* Guarda a barra de pesquisa */}
        <div className="flex h-[50px] w-[492px] shrink-0">
          <SearchBar
            onSearch={(termo) => console.log("Pesquisar:", termo)}
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

      {/* Conteúdo principal: lista (esquerda) + mapa (direita) */}
      <div className="mt-5 flex gap-5 pl-[34px]">
        <ListaPontos
          pontos={PONTOS}
          selecionadoId={selecionadoId}
          onSelect={setSelecionadoId}
          onGerenciar={(id) => console.log("Gerenciar ponto:", id)}
        />
        <MapaPontos pontos={PONTOS} selecionadoId={selecionadoId} onSelect={setSelecionadoId} />
      </div>
    </div>
  );
}