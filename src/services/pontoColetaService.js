// URL da sua API de pontos de coleta
const API_URL = "http://localhost:8080/meraki/ecowayer/admin/ponto-coleta";

// Converte "-23,51" ou "-23.51" ou número em number (retorna NaN se não der)
const paraNumero = (v) => (v == null || v === "" ? NaN : Number(String(v).replace(",", ".")));

// Monta o texto do endereço aceitando array, objeto ou string, e nomes alternativos
function lerEndereco(e) {
  const end = Array.isArray(e) ? e[0] : e; // array -> primeiro item
  if (!end) return { texto: "", cep: "", cidade: "", obj: null };
  if (typeof end === "string") return { texto: end, cep: "", cidade: "", obj: null };

  const rua = end.rua ?? end.logradouro ?? end.endereco;
  const numero = end.numero ?? end.num;
  const bairro = end.bairro;
  // junta só o que existir, sem imprimir "undefined"
  const ruaNumero = [rua, numero].filter(Boolean).join(", ");
  const texto = [ruaNumero, bairro].filter(Boolean).join(" – ");
  return { texto, cep: end.cep ?? "", cidade: end.cidade ?? "", obj: end };
}

// Lê os materiais aceitos: aceita array de objetos, array de textos ou texto separado por vírgula
function lerMateriais(p) {
  const bruto = p.material_aceito ?? p.materiais_aceitos ?? p.materiais ?? p.material ?? [];
  const lista = typeof bruto === "string" ? bruto.split(",") : Array.isArray(bruto) ? bruto : [bruto];
  return lista
    .map((m) => (typeof m === "string" ? m.trim() : m?.nome ?? m?.material ?? m?.descricao ?? ""))
    .filter(Boolean);
}

// Converte o JSON da API para o formato usado nos componentes
function adaptarPonto(p) {
  const { texto, cep, cidade, obj } = lerEndereco(p.endereco);
  return {
    id: p.id,
    nome: p.nome,
    endereco: texto,
    cep,
    cidade,
    status: p.status, // ativo | inativo | manutencao | cheio
    capacidade: p.capacidade ?? p.capacidade_atual ?? 0,
    horario: p.horario_funcionamento ?? p.horario ?? "—",
    materiais: lerMateriais(p),
    // aceita latitude/longitude (ou lat/lng/lon) no ponto ou dentro do endereço
    lat: paraNumero(p.latitude ?? p.lat ?? obj?.latitude ?? obj?.lat),
    lng: paraNumero(p.longitude ?? p.lng ?? p.lon ?? obj?.longitude ?? obj?.lng ?? obj?.lon),
  };
}

// GET: lista todos os pontos já no formato dos componentes
export async function listarPontos() {
  const token = localStorage.getItem("token"); // ajuste se você guarda o JWT com outro nome
  const res = await fetch(API_URL, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!res.ok) throw new Error(`Erro ${res.status} ao buscar pontos`);

  const json = await res.json();
  console.log("JSON bruto da API:", json); // remova depois de conferir os nomes dos campos
  return (json.response?.ponto_coleta ?? []).map(adaptarPonto);
}