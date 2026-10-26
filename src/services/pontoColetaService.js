const BASE = "http://localhost:8080/meraki/ecowayer/admin";
const API_URL = `${BASE}/ponto-coleta`;
const MATERIAL_URL = `${BASE}/material-aceito`; // ajuste para a sua rota
const CATEGORIA_URL = `${BASE}/categoria`;      // ajuste para a sua rota
const ENDERECO_URL = `${BASE}/endereco`; // ajuste para a sua rota
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const cabecalhos = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const paraNumero = (v) => (v == null || v === "" ? NaN : Number(String(v).replace(",", ".")));
const semAcento = (t) => String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

function lerEndereco(e) {
  const end = Array.isArray(e) ? e[0] : e;
  if (!end) return { texto: "", cep: "", cidade: "", obj: null };
  if (typeof end === "string") return { texto: end, cep: "", cidade: "", obj: null };

  const rua = end.rua ?? end.logradouro ?? end.endereco;
  const numero = end.numero ?? end.num;
  const bairro = end.bairro;
  const ruaNumero = [rua, numero].filter(Boolean).join(", ");
  const texto = [ruaNumero, bairro].filter(Boolean).join(" – ");
  return { texto, cep: end.cep ?? "", cidade: end.cidade ?? "", obj: end };
}

// Materiais como objetos { id, nome } (o id é necessário para o PUT)
function lerMateriaisObj(p) {
  const bruto = p.material_aceito ?? p.materiais_aceitos ?? p.materiais ?? p.material ?? [];
  const lista = typeof bruto === "string" ? bruto.split(",") : Array.isArray(bruto) ? bruto : [bruto];
  return lista
    .map((m) =>
      typeof m === "string"
        ? { id: null, nome: m.trim() }
        : { id: m?.id ?? null, nome: m?.nome ?? m?.material ?? m?.descricao ?? "" }
    )
    .filter((m) => m.nome);
}

// Ids dos endereços do ponto (para reenviar no PUT)
function lerEnderecoIds(e) {
  const lista = Array.isArray(e) ? e : e ? [e] : [];
  return lista.map((x) => x?.id).filter((id) => id != null);
}

function adaptarPonto(p) {
  const { texto, cep, cidade, obj } = lerEndereco(p.endereco);
  const materiaisObj = lerMateriaisObj(p);
  return {
    id: p.id,
    nome: p.nome,
    descricao: p.descricao ?? "",
    endereco: texto,
    enderecoIds: lerEnderecoIds(p.endereco),
    enderecoObj: obj ?? null, // dados completos do endereço (para editar)
    cep,
    cidade,
    status: String(p.status ?? "").trim().toLowerCase(), // ativo | inativo (ignora maiúsculas e espaços)
    capacidade: p.capacidade ?? p.capacidade_atual, // não aparece na tela, mas vai no PUT
    categoria: p.categoria?.nome ?? p.categoria ?? p.nome_categoria ?? "",
    idCategoria: p.id_categoria ?? null, // normalmente não vem da API
    materiais: materiaisObj.map((m) => m.nome), // mantém o formato que o resto do app usa
    materiaisObj,
    lat: paraNumero(p.latitude ?? p.lat ?? obj?.latitude ?? obj?.lat),
    lng: paraNumero(p.longitude ?? p.lng ?? p.lon ?? obj?.longitude ?? obj?.lng ?? obj?.lon),
  };
}

// Converte o endereço em coordenadas; devolve { lat, lng } ou null se não achar
export async function geocodificar({ rua, numero, bairro, cep, cidade }) {
  const q = [[rua, numero].filter(Boolean).join(" "), bairro, cidade, cep].filter(Boolean).join(", ");
  const url =
    `https://api.mapbox.com/search/geocode/v6/forward` +
    `?q=${encodeURIComponent(q)}&country=br&language=pt&limit=1&access_token=${MAPBOX_TOKEN}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro ${res.status} ao buscar coordenadas`);
  const json = await res.json();
  const coords = json.features?.[0]?.geometry?.coordinates; // [lng, lat]
  return coords ? { lat: coords[1], lng: coords[0] } : null;
}

export async function listarPontos() {
  const res = await fetch(API_URL, { headers: cabecalhos() });
  if (!res.ok) throw new Error(`Erro ${res.status} ao buscar pontos`);
  const json = await res.json();
  return (json.response?.ponto_coleta ?? []).map(adaptarPonto);
}

// Lista todos os materiais disponíveis para escolher no modal
export async function listarMateriais() {
  const res = await fetch(MATERIAL_URL, { headers: cabecalhos() });
  if (!res.ok) throw new Error(`Erro ${res.status} ao buscar materiais`);
  const json = await res.json();
  const lista = json.response?.material_aceito ?? json.response?.material ?? [];
  return lista.map((m) => ({ id: m.id, nome: m.nome ?? m.material ?? m.descricao }));
}

async function buscarIdCategoria(nome) {
  const res = await fetch(CATEGORIA_URL, { headers: cabecalhos() });
  if (!res.ok) throw new Error(`Erro ${res.status} ao buscar categorias`);
  const json = await res.json();
  const lista = json.response?.categoria ?? [];
  return lista.find((c) => semAcento(c.nome) === semAcento(nome))?.id ?? null;
}

// PUT: monta o JSON no formato que o controller espera e envia
export async function atualizarPonto(ponto, { status, materiaisIds,coords }) {
  const id_categoria = ponto.idCategoria ?? (await buscarIdCategoria(ponto.categoria));
  if (!id_categoria) throw new Error("Não foi possível descobrir o id da categoria");

  const corpo = {
    nome: ponto.nome,
    descricao: ponto.descricao || null,
    status, // "ativo" | "inativo"
    latitude: ponto.lat,
    longitude: ponto.lng,
    id_categoria,
    ...(ponto.capacidade !== undefined && { capacidade: ponto.capacidade }),
    endereco: ponto.enderecoIds.map((id) => ({ id })),
    material_aceito: materiaisIds.map((id) => ({ id })),
    latitude: coords?.lat ?? ponto.lat,
    longitude: coords?.lng ?? ponto.lng,
  };

  const res = await fetch(`${API_URL}/${ponto.id}`, {
    method: "PUT",
    headers: cabecalhos(),
    body: JSON.stringify(corpo),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.field ?? json.message ?? `Erro ${res.status} ao salvar`);
  return json;
}

// PUT no próprio registro de endereço (o vínculo com o ponto não muda, pois o id é o mesmo)
export async function atualizarEndereco(id, dados) {
  const res = await fetch(`${ENDERECO_URL}/${id}`, {
    method: "PUT",
    headers: cabecalhos(),
    body: JSON.stringify(dados),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.field ?? json.message ?? `Erro ${res.status} ao salvar endereço`);
  return json;
}