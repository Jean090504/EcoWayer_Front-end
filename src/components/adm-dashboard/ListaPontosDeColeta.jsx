
const pontos = [
    {
      id: 1,
      nome: "Eco Ponto Pinheiros",
      endereco: "Av. Brigadeiro Faria Lima, 1811",
      status: "Ativo",
      materiais: ["Plásticos", "Metais", "Vidros"],
      capacidade: 75,
    },
    {
      id: 2,
      nome: "Unidade Vila Mariana",
      endereco: "Rua Domingos de Morais, 820",
      status: "Ativo",
      materiais: ["Eletrônicos", "Pilhas & Bat."],
      capacidade: 42,
    },
    {
      id: 3,
      nome: "Ecoponto Moema Verde",
      endereco: "Av. Ibirapuera, 2030",
      status: "Ativo",
      materiais: ["Orgânicos", "Papelão", "Plásticos"],
      capacidade: 88,
    },
    {
      id: 4,
      nome: "Estação Santana Norte",
      endereco: "Rua Voluntários da Pátria, 1420",
      status: "Manutenção",
      materiais: ["Plásticos", "Plásticos"],
      capacidade: 15,
    },
  ];
  
  const coresMateriais = {
    "Plásticos": "bg-blue-500",
    "Metais": "bg-yellow-500",
    "Vidros": "bg-green-500",
    "Eletrônicos": "bg-purple-600",
    "Pilhas & Bat.": "bg-blue-500",
    "Orgânicos": "bg-green-500",
    "Papelão": "bg-yellow-500",
  };
  
  export default function ListaPontosColeta() {
    return (
      <div className="w-full space-y-2">
        {/* Cabeçalho da lista */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wide text-gray-500">
            Pontos cadastrados ({pontos.length})
          </span>
  
          <span className="rounded-full bg-green-500 px-2 py-1 text-[9px] text-white">
            12 Operando
          </span>
        </div>
  
        {/* Cartões */}
        {pontos.map((ponto) => (
          <div
            key={ponto.id}
            className="w-full rounded-xl border border-gray-100
              bg-white p-3 shadow-sm"
          >
            {/* Nome e status */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-1.5">
                <h3 className="truncate text-xs font-semibold text-gray-800">
                  {ponto.nome}
                </h3>
  
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    ponto.status === "Manutenção"
                      ? "bg-amber-400"
                      : "bg-green-600"
                  }`}
                />
              </div>
  
              <span
                className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] ${
                  ponto.status === "Manutenção"
                    ? "bg-orange-50 text-orange-600"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {ponto.status}
              </span>
            </div>
  
            {/* Endereço */}
            <p className="mt-1 truncate text-[10px] text-gray-500">
              {ponto.endereco}
            </p>
  
            {/* Materiais aceitos */}
            <div className="mt-2 flex flex-wrap gap-1">
              {ponto.materiais.map((material, index) => (
                <span
                  key={`${material}-${index}`}
                  className={`rounded px-1.5 py-0.5 text-[9px] font-medium text-white ${
                    coresMateriais[material] || "bg-gray-500"
                  }`}
                >
                  {material}
                </span>
              ))}
            </div>
  
            {/* Divisor */}
            <div className="my-2.5 border-t border-gray-100" />
  
            {/* Capacidade e botão */}
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex justify-between text-[9px]">
                  <span className="text-gray-400">Capacidade</span>
  
                  <span
                    className={
                      ponto.capacidade >= 80
                        ? "text-orange-600"
                        : "text-gray-700"
                    }
                  >
                    {ponto.capacidade}%
                  </span>
                </div>
  
                <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${
                      ponto.capacidade >= 80
                        ? "bg-orange-500"
                        : "bg-green-600"
                    }`}
                    style={{ width: `${ponto.capacidade}%` }}
                  />
                </div>
              </div>
  
              <button
                type="button"
                onClick={() => console.log("Gerenciar ponto:", ponto.id)}
                className="shrink-0 rounded-md bg-purple-600 px-3 py-1.5
                  text-[10px] font-medium text-white transition
                  hover:bg-purple-700"
              >
                Gerenciar
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }
  