import { useMemo, useState } from "react"
import Titulo from "../components/ui/titulo.jsx"
import SearchBar from "../components/dashboard/SearchBar.jsx"
import ListaPontos from "../components/coleta/ListaPontos.jsx"
import MapaPontos from "../components/coleta/MapaPontos.jsx"

// Dados de exemplo (troque pelo fetch da sua API /admin/ponto_coleta; lng/lat vêm do endereço do ponto)
const PONTOS = [
  {
    id: 1,
    nome: "EcoPonto Barueri Centro",
    endereco: "Rua Campos Sales, Centro, Barueri",
    status: "ativo",
    capacidade: 75,
    horario: "Seg - Sáb (08:00 às 18:00)",
    materiais: ["Plásticos", "Metais", "Vidros"],
    lng: -46.8760,
    lat: -23.5110
  },
  {
    id: 2,
    nome: "EcoPonto Alphaville",
    endereco: "Alameda Rio Negro, Alphaville, Barueri",
    status: "ativo",
    capacidade: 85,
    horario: "Seg - Sex (08:00 às 17:00)",
    materiais: ["Papel", "Plásticos", "Papelão"],
    lng: -46.8480,
    lat: -23.4960
  },
  {
    id: 3,
    nome: "EcoPonto Jardim Belval",
    endereco: "Região do Jardim Belval, Barueri",
    status: "ativo",
    capacidade: 60,
    horario: "Seg - Sáb (08:00 às 17:00)",
    materiais: ["Metais", "Vidros", "Plásticos"],
    lng: -46.8930,
    lat: -23.5160
  },
  {
    id: 4,
    nome: "EcoPonto Jardim Silveira",
    endereco: "Região do Jardim Silveira, Barueri",
    status: "ativo",
    capacidade: 55,
    horario: "Seg - Sex (08:00 às 17:00)",
    materiais: ["Papel", "Papelão", "Plásticos"],
    lng: -46.9020,
    lat: -23.5260
  },
  {
    id: 5,
    nome: "EcoPonto Engenho Novo",
    endereco: "Região do Engenho Novo, Barueri",
    status: "ativo",
    capacidade: 48,
    horario: "Seg - Sáb (08:00 às 16:00)",
    materiais: ["Eletrônicos", "Pilhas & Bat."],
    lng: -46.8890,
    lat: -23.5080
  },
  {
    id: 6,
    nome: "EcoPonto Jardim Mutinga",
    endereco: "Região do Jardim Mutinga, Barueri",
    status: "ativo",
    capacidade: 70,
    horario: "Seg - Sáb (08:00 às 18:00)",
    materiais: ["Plásticos", "Metais", "Papel"],
    lng: -46.9050,
    lat: -23.5020
  },
  {
    id: 7,
    nome: "EcoPonto Aldeia da Serra",
    endereco: "Região de Aldeia da Serra, Barueri",
    status: "ativo",
    capacidade: 40,
    horario: "Seg - Sex (09:00 às 17:00)",
    materiais: ["Vidros", "Plásticos"],
    lng: -46.8920,
    lat: -23.4730
  },
  {
    id: 8,
    nome: "EcoPonto Tamboré",
    endereco: "Região de Tamboré, Barueri",
    status: "ativo",
    capacidade: 90,
    horario: "Seg - Sáb (08:00 às 18:00)",
    materiais: ["Eletrônicos", "Metais", "Plásticos"],
    lng: -46.8360,
    lat: -23.5010
  },
  {
    id: 9,
    nome: "EcoPonto Jardim Tupanci",
    endereco: "Região do Jardim Tupanci, Barueri",
    status: "manutencao",
    capacidade: 20,
    horario: "Seg - Sex (09:00 às 16:00)",
    materiais: ["Papel", "Papelão"],
    lng: -46.8810,
    lat: -23.5190
  },
  {
    id: 10,
    nome: "EcoPonto Parque Imperial",
    endereco: "Região do Parque Imperial, Barueri",
    status: "ativo",
    capacidade: 65,
    horario: "Seg - Sáb (08:00 às 17:00)",
    materiais: ["Plásticos", "Vidros", "Metais"],
    lng: -46.8660,
    lat: -23.5320
  },
  {
    id: 11,
    nome: "EcoPonto Santana de Parnaíba Centro",
    endereco: "Região central de Santana de Parnaíba",
    status: "ativo",
    capacidade: 72,
    horario: "Seg - Sáb (08:00 às 18:00)",
    materiais: ["Papel", "Plásticos", "Metais"],
    lng: -46.9170,
    lat: -23.4440
  },
  {
    id: 12,
    nome: "EcoPonto Fazendinha",
    endereco: "Região da Fazendinha, Santana de Parnaíba",
    status: "ativo",
    capacidade: 50,
    horario: "Seg - Sex (08:00 às 17:00)",
    materiais: ["Vidros", "Plásticos", "Papelão"],
    lng: -46.9260,
    lat: -23.4550
  },
  {
    id: 13,
    nome: "EcoPonto Aldeia de Barueri",
    endereco: "Região próxima à divisa com Santana de Parnaíba",
    status: "ativo",
    capacidade: 45,
    horario: "Seg - Sáb (08:00 às 16:00)",
    materiais: ["Eletrônicos", "Pilhas & Bat."],
    lng: -46.8640,
    lat: -23.4880
  },
  {
    id: 14,
    nome: "EcoPonto Jandira Centro",
    endereco: "Região central de Jandira",
    status: "ativo",
    capacidade: 68,
    horario: "Seg - Sáb (08:00 às 18:00)",
    materiais: ["Plásticos", "Papel", "Metais"],
    lng: -46.9020,
    lat: -23.5270
  },
  {
    id: 15,
    nome: "EcoPonto Jardim Nossa Senhora",
    endereco: "Região residencial de Jandira",
    status: "ativo",
    capacidade: 35,
    horario: "Seg - Sex (08:00 às 17:00)",
    materiais: ["Vidros", "Papelão"],
    lng: -46.9130,
    lat: -23.5350
  },
  {
    id: 16,
    nome: "EcoPonto Itapevi Centro",
    endereco: "Região central de Itapevi",
    status: "ativo",
    capacidade: 80,
    horario: "Seg - Sáb (08:00 às 18:00)",
    materiais: ["Plásticos", "Metais", "Vidros"],
    lng: -46.9340,
    lat: -23.5480
  },
  {
    id: 17,
    nome: "EcoPonto Cohab",
    endereco: "Região da Cohab, Carapicuíba",
    status: "ativo",
    capacidade: 58,
    horario: "Seg - Sex (08:00 às 17:00)",
    materiais: ["Papel", "Plásticos", "Papelão"],
    lng: -46.8480,
    lat: -23.5320
  },
  {
    id: 18,
    nome: "EcoPonto Carapicuíba Centro",
    endereco: "Região central de Carapicuíba",
    status: "ativo",
    capacidade: 62,
    horario: "Seg - Sáb (08:00 às 17:00)",
    materiais: ["Metais", "Vidros", "Plásticos"],
    lng: -46.8350,
    lat: -23.5230
  },
  {
    id: 19,
    nome: "EcoPonto Osasco Oeste",
    endereco: "Região oeste de Osasco",
    status: "ativo",
    capacidade: 95,
    horario: "Seg - Sáb (08:00 às 18:00)",
    materiais: ["Eletrônicos", "Plásticos", "Metais"],
    lng: -46.7930,
    lat: -23.5320
  },
  {
    id: 20,
    nome: "EcoPonto Vila Yara",
    endereco: "Região da Vila Yara, Osasco",
    status: "inativo",
    capacidade: 25,
    horario: "Seg - Sex (09:00 às 16:00)",
    materiais: ["Papel", "Papelão", "Vidros"],
    lng: -46.7690,
    lat: -23.5460
  }
]

// Remove acentos e deixa minúsculo para a busca não depender disso
const normalizar = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

export default function Coleta() {
  // Texto digitado na barra de pesquisa
  const [termo, setTermo] = useState("")

  // Id do ponto selecionado (sincroniza lista <-> mapa)
  const [selecionadoId, setSelecionadoId] = useState(1)

  // Pontos filtrados pelo texto (busca por nome, endereço ou material)
  const pontosFiltrados = useMemo(() => {
    const t = normalizar(termo.trim())
    if (!t) return PONTOS
    return PONTOS.filter((p) =>
      normalizar([p.nome, p.endereco, ...p.materiais].join(" ")).includes(t)
    )
  }, [termo])

  return (
    <div>
      <Titulo texto = "Pontos de Coleta" />

      <div className = "flex w-[95%] flex-col items-center mt-5">

        {/* Barra de ações */}
        <div className = "mt-1 flex w-full flex-wrap items-center justify-between gap-4 px-[clamp(12px,2vw,34px)]">

          {/* Barra de pesquisa */}
          <div className = "flex h-[50px] w-[500px] shrink-0">
            <SearchBar
              onSearch = {setTermo}
              onFilterClick = {() => console.log("Abrir Filtros")}
            />
          </div>

          {/* Botões de ação */}
          <div className = "flex gap-3">
            <button className = "rounded-lg bg-[#7350B9] px-5 py-2.5 text-sm font-semibold text-white cursor-pointer">
              Todos os Resíduos
            </button>

            <button className = "rounded-lg bg-[#65BA69] px-5 py-2.5 text-sm font-semibold text-white cursor-pointer">
              + Adicionar Ponto
            </button>
          </div>
        </div>

        {/* Lista e mapa */}
        <div className = "mt-5 flex w-full flex-wrap gap-5 px-[clamp(12px,2vw,34px)]">
          <ListaPontos
            pontos = {pontosFiltrados}
            selecionadoId = {selecionadoId}
            onSelect = {setSelecionadoId}
            onGerenciar = {(id) => console.log("Gerenciar ponto:", id)}
          />

          <MapaPontos
            pontos = {pontosFiltrados}
            selecionadoId = {selecionadoId}
            onSelect = {setSelecionadoId}
          />
        </div>

      </div>
    </div>
  )
}