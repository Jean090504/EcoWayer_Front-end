const BASE = "http://localhost:8080/meraki/ecowayer/admin";
const API_URL = `${BASE}/ponto-coleta`;
const MATERIAL_URL = `${BASE}/material-aceito`;
const CATEGORIA_URL = `${BASE}/categoria`;
const ENDERECO_URL = `${BASE}/endereco`;
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const GEO_URL = "https://api.mapbox.com/search/geocode/v6";

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
    status: String(p.status ?? "").trim().toLowerCase(), // ativo | inativo
    capacidade: p.capacidade ?? p.capacidade_atual, // não aparece na tela
    categoria: p.categoria?.nome ?? p.categoria ?? p.nome_categoria ?? "",
    idCategoria: p.id_categoria ?? null,
    materiais: materiaisObj.map((m) => m.nome),
    materiaisObj,
    lat: paraNumero(p.latitude ?? p.lat ?? obj?.latitude ?? obj?.lat),
    lng: paraNumero(p.longitude ?? p.lng ?? p.lon ?? obj?.longitude ?? obj?.lng ?? obj?.lon),
  };
}

/* ---------- Geocodificação ---------- */

// Endereço -> coordenadas. Devolve { lat, lng } ou null se não achar
export async function geocodificar({ rua, numero, bairro, cep, cidade }) {
  if (!MAPBOX_TOKEN) throw new Error("Token do Mapbox ausente (VITE_MAPBOX_TOKEN)");
  const q = [[rua, numero].filter(Boolean).join(" "), bairro, cidade, cep].filter(Boolean).join(", ");
  const url = `${GEO_URL}/forward?q=${encodeURIComponent(q)}&country=br&language=pt&limit=1&access_token=${MAPBOX_TOKEN}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro ${res.status} ao buscar coordenadas`);
  const json = await res.json();
  const coords = json.features?.[0]?.geometry?.coordinates; // [lng, lat]
  return coords ? { lat: coords[1], lng: coords[0] } : null;
}

// Coordenadas -> endereço. Devolve só o que encontrou, ou null
export async function geocodificarReverso(lat, lng) {
  if (!MAPBOX_TOKEN) throw new Error("Token do Mapbox ausente (VITE_MAPBOX_TOKEN)");
  const url = `${GEO_URL}/reverse?longitude=${lng}&latitude=${lat}&language=pt&limit=1&access_token=${MAPBOX_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro ${res.status} ao buscar endereço`);
  const json = await res.json();
  const f = json.features?.[0];
  if (!f) return null;
  const c = f.properties?.context ?? {};
  return {
    rua: c.street?.name ?? c.address?.street_name ?? "",
    numero: c.address?.address_number ?? "",
    bairro: c.neighborhood?.name ?? c.locality?.name ?? c.district?.name ?? "",
    cep: c.postcode?.name ?? "",
    cidade: c.place?.name ?? "",
    estado: c.region?.name ?? "",
    sigla: c.region?.region_code ?? "",
  };
}

// CEP -> rua, bairro, cidade, estado e sigla (ViaCEP). Devolve null se o CEP não existe
export async function buscarCep(cep) {
  const digitos = String(cep).replace(/\D/g, "");
  if (digitos.length !== 8) return null;
  const res = await fetch(`https://viacep.com.br/ws/${digitos}/json/`);
  if (!res.ok) throw new Error(`Erro ${res.status} ao buscar CEP`);
  const json = await res.json();
  if (json.erro) return null;
  return {
    rua: json.logradouro ?? "",
    bairro: json.bairro ?? "",
    cidade: json.localidade ?? "",
    estado: json.estado ?? "",
    sigla: json.uf ?? "",
  };
}

/* ---------- Leitura ---------- */

export async function listarPontos() {
  const res = await fetch(API_URL, { headers: cabecalhos() });
  if (!res.ok) throw new Error(`Erro ${res.status} ao buscar pontos`);
  const json = await res.json();
  return (json.response?.ponto_coleta ?? []).map(adaptarPonto);
}

// Lista todos os materiais disponíveis para escolher nos modais
export async function listarMateriais() {
  const res = await fetch(MATERIAL_URL, { headers: cabecalhos() });
  if (!res.ok) throw new Error(`Erro ${res.status} ao buscar materiais`);
  const json = await res.json();
  const lista = json.response?.material_aceito ?? json.response?.material ?? [];
  return lista.map((m) => ({ id: m.id, nome: m.nome ?? m.material ?? m.descricao }));
}

export async function listarCategorias() {
  const res = await fetch(CATEGORIA_URL, { headers: cabecalhos() });
  if (!res.ok) throw new Error(`Erro ${res.status} ao buscar categorias`);
  const json = await res.json();
  return (json.response?.categoria ?? []).map((c) => ({ id: c.id, nome: c.nome }));
}

async function buscarIdCategoria(nome) {
  const lista = await listarCategorias();
  return lista.find((c) => semAcento(c.nome) === semAcento(nome))?.id ?? null;
}

// Lista todos os endereços cadastrados
export async function listarEnderecos() {
  const res = await fetch(ENDERECO_URL, { headers: cabecalhos() });
  if (!res.ok) throw new Error(`Erro ${res.status} ao buscar endereços`);
  const json = await res.json();
  return json.response?.endereco ?? [];
}

// Procura um endereço já cadastrado com o mesmo CEP, número e rua (para não duplicar)
export async function buscarEnderecoExistente({ cep, numero, rua }) {
  const digitos = (v) => String(v ?? "").replace(/\D/g, "");
  const lista = await listarEnderecos();
  return (
    lista.find(
      (e) =>
        digitos(e.cep) === digitos(cep) &&
        String(e.numero ?? "").trim() === String(numero ?? "").trim() &&
        semAcento(e.rua ?? "") === semAcento(rua ?? "")
    ) ?? null
  );
}

/* ---------- Edição ---------- */

// PUT do ponto: monta o JSON no formato que o controller espera
export async function atualizarPonto(ponto, { status, materiaisIds, coords }) {
  const id_categoria = ponto.idCategoria ?? (await buscarIdCategoria(ponto.categoria));
  if (!id_categoria) throw new Error("Não foi possível descobrir o id da categoria");

  const corpo = {
    nome: ponto.nome,
    descricao: ponto.descricao || null,
    status,
    latitude: coords?.lat ?? ponto.lat,
    longitude: coords?.lng ?? ponto.lng,
    id_categoria,
    ...(ponto.capacidade !== undefined && { capacidade: ponto.capacidade }),
    endereco: ponto.enderecoIds.map((id) => ({ id })),
    material_aceito: materiaisIds.map((id) => ({ id })),
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

// PUT no registro de endereço (o vínculo com o ponto não muda, pois o id é o mesmo)
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

/* ---------- Cadastro ---------- */

// POST /endereco -> devolve o id criado (aceita os formatos comuns de resposta)
export async function criarEndereco(dados) {
  const res = await fetch(ENDERECO_URL, { method: "POST", headers: cabecalhos(), body: JSON.stringify(dados) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.field ?? json.message ?? `Erro ${res.status} ao criar endereço`);
  const r = json.response;
  const id = r?.id ?? r?.endereco?.id ?? json?.id ?? null;
  if (id == null) throw new Error("Endereço criado, mas a API não devolveu o id");
  return id;
}

// DELETE /endereco/:id (desfaz o endereço se o ponto não puder ser criado)
export async function excluirEndereco(id) {
  await fetch(`${ENDERECO_URL}/${id}`, { method: "DELETE", headers: cabecalhos() });
}

// POST /ponto-coleta -> devolve { id }; id nulo = o backend criou com alerta (vínculos falharam)
export async function criarPonto(corpo) {
  const res = await fetch(API_URL, { method: "POST", headers: cabecalhos(), body: JSON.stringify(corpo) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.field ?? json.message ?? `Erro ${res.status} ao criar ponto`);
  return { id: json.response?.id ?? null };
}