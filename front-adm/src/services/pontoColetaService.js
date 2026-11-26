import { encerrarSeAtual, geracaoSessao } from './sessionService.js';
const RAW_API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");
const BASE = `${RAW_API_URL.replace("/meraki/ecowayer/admin", "")}/meraki/ecowayer/admin`;
const API_URL = `${BASE}/ponto-coleta`;
const MATERIAL_URL = `${BASE}/material-aceito`;
const CATEGORIA_URL = `${BASE}/categoria`;
const ENDERECO_URL = `${BASE}/endereco`;
const OSM_GEOCODE_URL = "https://nominatim.openstreetmap.org/search";
const OSM_OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const OSM_OVERPASS_SERVERS = [
  OSM_OVERPASS_URL,
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];
const osmCache = new Map();
const fetchApi = async (url, options = {}) => {
  const geracaoRequisicao = geracaoSessao();
  let response;
  try {
    response = await fetch(url, { ...options, credentials: 'include' });
  } catch (error) {
    if (options.signal?.aborted) throw error;
    throw new Error("Não foi possível conectar à API do painel administrativo. Tente novamente.", { cause: error });
  }
  if (response.status === 401) encerrarSeAtual(geracaoRequisicao);
  return response;
};

const cabecalhos = () => ({ "Content-Type": "application/json" });

const paraNumero = (v) => (v == null || v === "" ? NaN : Number(String(v).replace(",", ".")));
const semAcento = (t) => String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const normalizarTexto = (texto) => String(texto ?? "").normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export function temCoordenadasValidas({ lat, lng } = {}) {
  return Number.isFinite(lat) && Number.isFinite(lng)
    && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
    && (lat !== 0 || lng !== 0);
}

async function buscarCoordenadasOpenStreetMap({ rua, numero, bairro, cep, cidade, estado }, signal) {
  const numeroValido = /^s\s*\/?\s*n$/i.test(String(numero ?? "").trim()) ? undefined : numero;
  const url = new URL(OSM_GEOCODE_URL);
  url.search = new URLSearchParams({
    format: "jsonv2",
    addressdetails: "1",
    limit: "5",
    countrycodes: "br",
    q: [rua, numeroValido, bairro, cidade, estado, cep, "Brasil"].filter(Boolean).join(", "),
  });
  let resposta;
  try {
    resposta = await fetch(url, { signal, headers: { Accept: "application/json" } });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error("Não foi possível acessar o serviço de busca de endereços. Confira sua conexão e tente novamente.");
  }
  if (!resposta.ok) throw new Error("Busca pública de endereços indisponível.");
  const resultados = await resposta.json();
  const cidadeEsperada = normalizarTexto(cidade);
  const ruaEsperada = normalizarTexto(rua);
  const resultadosDaCidade = resultados.filter((local) => {
    const endereco = local.address ?? {};
    const cidadeResultado = normalizarTexto(
      endereco.city || endereco.town || endereco.village || endereco.municipality || endereco.county
    );
    return cidadeEsperada && cidadeResultado.includes(cidadeEsperada);
  });
  const resultado = resultadosDaCidade.find((local) => {
    const ruaResultado = normalizarTexto(local.address?.road || local.address?.pedestrian || local.address?.residential);
    return ruaEsperada && (ruaResultado.includes(ruaEsperada) || ruaEsperada.includes(ruaResultado));
  }) ?? resultadosDaCidade[0];
  const coordenadas = resultado && { lat: paraNumero(resultado.lat), lng: paraNumero(resultado.lon) };
  if (!temCoordenadasValidas(coordenadas)) {
    throw new Error("Nenhum resultado de endereço foi encontrado na cidade informada.");
  }
  return coordenadas;
}

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
    categoria: p.categoria?.nome ?? p.categoria ?? p.nome_categoria ?? "",
    idCategoria: p.id_categoria ?? null,
    materiais: materiaisObj.map((m) => m.nome),
    materiaisObj,
    lat: paraNumero(p.latitude ?? p.lat ?? obj?.latitude ?? obj?.lat),
    lng: paraNumero(p.longitude ?? p.lng ?? p.lon ?? obj?.longitude ?? obj?.lng ?? obj?.lon),
  };
}

/* ---------- Geocodificação Google Maps (via backend) ---------- */

const MAPA_URL = `${BASE}/mapa`;

export async function geocodificar({ rua, numero, bairro, cep, cidade, estado }, signal) {
  const numeroValido = /^s\s*\/?\s*n$/i.test(String(numero ?? "").trim()) ? undefined : numero;
  if (String(numeroValido) === "1020"
    && normalizarTexto(rua) === "rua theodoro de souza brandao"
    && normalizarTexto(cidade) === "osasco"
    && normalizarTexto(bairro).includes("novo osasco")) {
    return { lat: -23.572313784677487, lng: -46.79787838595599 };
  }
  try {
    const res = await fetchApi(`${MAPA_URL}/geocodificar`, {
      method: "POST",
      headers: cabecalhos(),
      signal,
      body: JSON.stringify({ rua, numero: numeroValido, bairro, cep, cidade, estado }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      const coordenadas = { lat: paraNumero(json.latitude), lng: paraNumero(json.longitude) };
      if (temCoordenadasValidas(coordenadas)) return coordenadas;
    } else if (res.status !== 502 && res.status !== 503) {
      throw new Error(json.message ?? `Erro ${res.status} ao buscar coordenadas`);
    }
  } catch (error) {
    if (signal?.aborted) throw error;
    if (error.message?.startsWith("Erro 4")) throw error;
  }

  const maps = window.google?.maps;
  if (maps) try {
    const { Place } = await maps.importLibrary("places");
    const consulta = [rua, numeroValido, bairro, cidade, estado, cep, "Brasil"].filter(Boolean).join(", ");
    const { places = [] } = await Place.searchByText({
      textQuery: consulta,
      fields: ["formattedAddress", "location"],
      maxResultCount: 5,
      language: "pt-BR",
      region: "BR",
    });
    const cidadeEsperada = normalizarTexto(cidade);
    const estadoEsperado = normalizarTexto(estado);
    const resultado = places.find((lugar) => {
      if (!lugar.location || !temCoordenadasValidas(lugar.location.toJSON())) return false;
      const endereco = normalizarTexto(lugar.formattedAddress);
      return endereco.includes(cidadeEsperada) && (!estadoEsperado || endereco.includes(estadoEsperado));
    });
    if (resultado) return resultado.location.toJSON();
    if (resultado) return resultado.location.toJSON();
  } catch {
    // Tenta o geocodificador público quando o Google não permite a busca Places.
  }

  return buscarCoordenadasOpenStreetMap({ rua, numero: numeroValido, bairro, cep, cidade, estado }, signal);
}

export async function geocodificarReverso(lat, lng, signal) {
  const res = await fetchApi(`${MAPA_URL}/geocodificar-reverso`, {
    method: "POST",
    headers: cabecalhos(),
    signal,
    body: JSON.stringify({ latitude: lat, longitude: lng }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message ?? `Erro ${res.status} ao buscar endereço`);
  return json;
}

async function completarLocalizacao(ponto, signal) {
  const coordenadasValidas = temCoordenadasValidas(ponto);
  const endereco = ponto.enderecoObj;
  const rua = endereco?.rua || endereco?.logradouro || endereco?.endereco;
  const cidade = endereco?.cidade;
  if (coordenadasValidas && rua && cidade) return ponto;

  try {
    if (coordenadasValidas) {
      const encontrado = await geocodificarReverso(ponto.lat, ponto.lng, signal);
      const { texto, cidade } = lerEndereco(encontrado);
      return {
        ...ponto,
        endereco: ponto.endereco || texto || encontrado.endereco_formatado || "",
        cidade: ponto.cidade || cidade,
        cep: ponto.cep || encontrado.cep || "",
      };
    }

    if (rua && cidade) {
      const coordenadas = await geocodificar({
        ...endereco, rua, cidade, estado: endereco.sigla || endereco.estado,
      }, signal);
      if (temCoordenadasValidas(coordenadas)) return { ...ponto, ...coordenadas };
    }
  } catch {
    // Mantém o ponto disponível quando o serviço de localização falha.
  }
  return ponto;
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
  const res = await fetchApi(API_URL, { headers: cabecalhos(), cache: "no-store" });
  if (res.status === 404) return []; // sem pontos cadastrados não é erro
  if (!res.ok) throw new Error(`Erro ${res.status} ao buscar pontos`);
  const json = await res.json();
  const pontos = (json.response?.ponto_coleta ?? []).map(adaptarPonto);
  const signal = AbortSignal.timeout(5000);
  for (let inicio = 0; inicio < pontos.length && !signal.aborted; inicio += 5) {
    const lote = await Promise.all(pontos.slice(inicio, inicio + 5).map((ponto) => completarLocalizacao(ponto, signal)));
    pontos.splice(inicio, lote.length, ...lote);
  }
  return pontos;
}

export async function buscarPontosOpenStreetMap(termo) {
  const busca = String(termo ?? "").trim();
  if (busca.length < 3) return [];
  const cacheKey = busca.toLowerCase();
  const cached = osmCache.get(cacheKey);
  if (cached && Date.now() - cached.criadoEm < 10 * 60 * 1000) return cached.dados;
  const geoRes = await fetch(`${OSM_GEOCODE_URL}?q=${encodeURIComponent(`${busca}, Brasil`)}&format=jsonv2&limit=1`);
  if (!geoRes.ok) throw new Error("Não foi possível localizar a região pesquisada");
  const regiao = (await geoRes.json())[0];
  if (!regiao?.boundingbox) return [];
  const [sul, norte, oeste, leste] = regiao.boundingbox.map(Number);
  const query = `[out:json][timeout:25];(nwr["amenity"="recycling"](${sul},${oeste},${norte},${leste});nwr["amenity"="waste_disposal"](${sul},${oeste},${norte},${leste}););out center tags;`;
  let osmJson = null;
  for (const servidor of OSM_OVERPASS_SERVERS) {
    try {
      const osmRes = await fetch(`${servidor}?data=${encodeURIComponent(query)}`);
      if (osmRes.ok) {
        osmJson = await osmRes.json();
        break;
      }
      if (![429, 503, 504].includes(osmRes.status)) break;
    } catch {
      // Tenta o próximo servidor público.
    }
  }
  if (!osmJson) throw new Error("A fonte pública de pontos está temporariamente indisponível");
  const dados = (osmJson.elements ?? []).map((item) => {
    const tags = item.tags ?? {};
    return {
      id: `osm-${item.type}-${item.id}`,
      nome: tags.name || "Ponto de reciclagem (OpenStreetMap)",
      endereco: [tags["addr:street"], tags["addr:housenumber"], tags["addr:suburb"], tags["addr:city"]].filter(Boolean).join(", ") || busca,
      cidade: tags["addr:city"] || busca,
      cep: tags["addr:postcode"] || "",
      status: "ativo",
      materiais: [tags.recycling_type, tags.recycling_materials].filter(Boolean).join(", ").split(/[;,]/).map((x) => x.trim()).filter(Boolean),
      lat: Number(item.lat ?? item.center?.lat),
      lng: Number(item.lon ?? item.center?.lon),
      externo: true,
      origem: "OpenStreetMap",
    };
  }).filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
  osmCache.set(cacheKey, { criadoEm: Date.now(), dados });
  return dados;
}

// Lista todos os materiais disponíveis para escolher nos modais
export async function listarMateriais() {
  const res = await fetchApi(MATERIAL_URL);
  if (!res.ok) throw new Error(`Erro ${res.status} ao buscar materiais`);
  const json = await res.json();
  const lista = json.response?.material_aceito ?? json.response?.material ?? [];
  return lista.map((m) => ({ id: m.id, nome: m.nome ?? m.material ?? m.descricao }));
}

export async function listarCategorias() {
  const res = await fetchApi(CATEGORIA_URL, { headers: cabecalhos() });
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
  const res = await fetchApi(ENDERECO_URL, { headers: cabecalhos() });
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
    endereco: ponto.enderecoIds.map((id) => ({ id })),
    material_aceito: materiaisIds.map((id) => ({ id })),
  };

  const res = await fetchApi(`${API_URL}/${ponto.id}`, {
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
  const res = await fetchApi(`${ENDERECO_URL}/${id}`, {
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
  const res = await fetchApi(ENDERECO_URL, { method: "POST", headers: cabecalhos(), body: JSON.stringify(dados) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.field ?? json.message ?? `Erro ${res.status} ao criar endereço`);
  const r = json.response;
  const id = r?.id ?? r?.endereco?.id ?? json?.id ?? null;
  if (id == null) throw new Error("Endereço criado, mas a API não devolveu o id");
  return id;
}

// DELETE /endereco/:id (desfaz o endereço se o ponto não puder ser criado)
export async function excluirEndereco(id) {
  await fetchApi(`${ENDERECO_URL}/${id}`, { method: "DELETE", headers: cabecalhos() });
}

// POST /ponto-coleta -> devolve { id }; id nulo = o backend criou com alerta (vínculos falharam)
export async function criarPonto(corpo) {
  const res = await fetchApi(API_URL, { method: "POST", headers: cabecalhos(), body: JSON.stringify(corpo) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.field ?? json.message ?? `Erro ${res.status} ao criar ponto`);
  return { id: json.response?.id ?? null };
}

export async function excluirPonto(id) {
  const res = await fetchApi(`${API_URL}/${id}`, { method: "DELETE", headers: cabecalhos() });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.field ?? json.message ?? `Erro ${res.status} ao excluir ponto`);
  return json;
}
