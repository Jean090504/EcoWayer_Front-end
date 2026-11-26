import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import PopupPonto from "./PopupPonto.jsx";
import ControlesMapa from "./ControlesMapa.jsx";
import { geocodificar, temCoordenadasValidas } from "../../services/pontoColetaService.js";

const CENTRO_JANDIRA = { lat: -23.535361, lng: -46.904111 };
const ZOOM_INICIAL = 15;
const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";
let mapsPromise;

function carregarGoogleMaps() {
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  if (!GOOGLE_MAPS_KEY) return Promise.reject(new Error("VITE_GOOGLE_MAPS_API_KEY não configurada."));
  if (mapsPromise) return mapsPromise;
  mapsPromise = new Promise((resolve, reject) => {
    const callbackName = "__ecowayerGoogleMapsLoaded";
    window[callbackName] = () => {
      delete window[callbackName];
      resolve(window.google.maps);
    };
    const script = document.createElement("script");
    script.dataset.googleMaps = "true";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_KEY)}&loading=async&callback=${callbackName}&libraries=geometry,places,marker&language=pt-BR&region=BR`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      delete window[callbackName];
      reject(new Error("Não foi possível carregar o Google Maps."));
    };
    document.head.appendChild(script);
  });
  return mapsPromise;
}

const COR_PIN = { ativo: "#4da558", manutencao: "#b7791f", cheio: "#c9363d" };
const normalizarTexto = (texto) => (texto ?? "").normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function coordenadasPublicadas(ponto) {
  // Mapa oficial do Ecoponto Novo Osasco: https://osasco.sp.gov.br/lixo-zero/
  const endereco = ponto.endereco?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() ?? "";
  if (ponto.nome?.trim().toLowerCase() === "ecoponto novo osasco"
    && /theodoro de souza brandao,?\s+1020\b/.test(endereco)) {
    return { lat: -23.572313784677487, lng: -46.79787838595599 };
  }
  return null;
}

async function localizarPeloEndereco(ponto) {
  const endereco = ponto.enderecoObj;
  const rua = endereco?.rua || endereco?.logradouro;
  const cidade = endereco?.cidade;
  const { numero, bairro, cep, sigla, estado } = endereco ?? {};
  if (rua && cidade) {
    try {
      const posicao = await geocodificar({ rua, numero, bairro, cep, cidade, estado: sigla || estado });
      if (temCoordenadasValidas(posicao)) return posicao;
    } catch {
      // O geocodificador do navegador usa a configuração do próprio mapa.
    }

    try {
      const { Geocoder } = await window.google.maps.importLibrary("geocoding");
    const { results } = await new Geocoder().geocode({
        address: [rua, numero, bairro, cidade, sigla || estado, cep].filter(Boolean).join(", "),
        componentRestrictions: { country: "BR" },
      });
      const resultado = results.find(({ types, partial_match }) => !partial_match
      && types.some((tipo) => ["street_address", "premise", "subpremise", "establishment", "route", "locality", "postal_code"].includes(tipo)));
      const posicao = resultado?.geometry.location.toJSON();
      if (posicao && temCoordenadasValidas(posicao)) return posicao;
    } catch {
      // Alguns cadastros são encontrados pelo nome do ecoponto no Google Places.
    }
  }

  const cidadeEsperada = normalizarTexto(cidade);
  const ruaEsperada = normalizarTexto(rua);
  try {
    const { Place } = await window.google.maps.importLibrary("places");
    const consultas = [
      [rua, numero, bairro, cidade, sigla || estado, cep, "Brasil"].filter(Boolean).join(", "),
      [ponto.nome, cidade, sigla || estado, "Brasil"].filter(Boolean).join(", "),
    ];
    const respostas = await Promise.all(consultas.map((textQuery) => Place.searchByText({
      textQuery,
      fields: ["displayName", "formattedAddress", "location"],
      maxResultCount: 5,
      language: "pt-BR",
      region: "BR",
    })));
    const lugares = respostas.flatMap(({ places = [] }) => places);
    const resultado = lugares.find((lugar) => {
      if (!lugar.location) return false;
      const enderecoNormalizado = normalizarTexto(lugar.formattedAddress);
      return cidadeEsperada && enderecoNormalizado.includes(cidadeEsperada)
        && (!ruaEsperada || enderecoNormalizado.includes(ruaEsperada));
    });
    const posicao = resultado?.location.toJSON();
    if (temCoordenadasValidas(posicao)) return posicao;
  } catch {
    // Continua com o geocodificador público para endereços que o Google não indexou.
  }

  const consulta = [rua, numero, bairro, cidade, sigla || estado, cep, "Brasil"].filter(Boolean).join(", ");
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.search = new URLSearchParams({ format: "jsonv2", addressdetails: "1", limit: "5", countrycodes: "br", q: consulta });
  const resposta = await fetch(url, { headers: { Accept: "application/json" } });
  if (!resposta.ok) throw new Error("Busca pública de endereços indisponível");
  const resultados = await resposta.json();
  const resultado = resultados.find((local) => {
    const endereco = local.address ?? {};
    const cidadeResultado = normalizarTexto(
      endereco.city || endereco.town || endereco.village || endereco.municipality || endereco.county
    );
    const textoResultado = normalizarTexto(local.display_name);
    return cidadeEsperada && cidadeResultado.includes(cidadeEsperada)
      && (!ruaEsperada || textoResultado.includes(ruaEsperada));
  });
  const posicao = resultado && { lat: Number(resultado.lat), lng: Number(resultado.lon) };
  if (!temCoordenadasValidas(posicao)) throw new Error("Endereço não localizado");
  return posicao;
}

export default function MapaPontosGoogle({ pontos, selecionadoId, revisaoSelecao, onSelect, consulta = "", onResultadosExternos }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);
  const marcadoresRef = useRef({});
  const [popupNode] = useState(() => document.createElement("div"));
  const [mapReady, setMapReady] = useState(false);
  const [erro, setErro] = useState(null);
  const [estadoLocalizacao, setEstadoLocalizacao] = useState(null);
  const selecionado = pontos.find((p) => p.id === selecionadoId);

  useEffect(() => {
    let ativo = true;
    carregarGoogleMaps().then((maps) => {
      if (!ativo || !containerRef.current) return;
      mapRef.current = new maps.Map(containerRef.current, {
        center: CENTRO_JANDIRA, zoom: ZOOM_INICIAL, mapTypeControl: false,
        streetViewControl: false, fullscreenControl: false, mapId: GOOGLE_MAPS_MAP_ID,
      });
      infoWindowRef.current = new maps.InfoWindow({ content: popupNode, disableAutoPan: false });
      setMapReady(true);
    }).catch((e) => setErro(e.message));

    return () => {
      ativo = false;
      Object.values(marcadoresRef.current).forEach(({ marker }) => { marker.map = null; });
      marcadoresRef.current = {};
      mapRef.current = null;
    };
  }, [popupNode]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;
    let ativo = true;
    Object.values(marcadoresRef.current).forEach(({ marker }) => { marker.map = null; });
    marcadoresRef.current = {};
    const pontosComCoordenadas = pontos.map((ponto) => temCoordenadasValidas(ponto)
      ? ponto
      : { ...ponto, ...coordenadasPublicadas(ponto) }).filter(temCoordenadasValidas);
    window.google.maps.importLibrary("marker").then(({ AdvancedMarkerElement, PinElement }) => {
      if (!ativo) return;
      pontosComCoordenadas.forEach((p) => {
        const pin = new PinElement({
          background: p.id === selecionadoId ? "#65BA69" : "#ffffff",
          borderColor: p.id === selecionadoId ? "#65BA69" : (COR_PIN[p.status] || "#64748b"),
          glyphColor: p.id === selecionadoId ? "#ffffff" : (COR_PIN[p.status] || "#64748b"),
          scale: p.id === selecionadoId ? 1.15 : 0.9,
        });
        const marker = new AdvancedMarkerElement({
          map, position: { lat: p.lat, lng: p.lng }, title: p.nome,
          content: pin, gmpClickable: true,
        });
        marker.addEventListener("gmp-click", () => onSelect(p.id));
        marcadoresRef.current[p.id] = { marker };
      });
    }).catch(() => {
      if (ativo) setErro("Não foi possível carregar os marcadores do mapa.");
    });
    return () => { ativo = false; };
  }, [mapReady, pontos, selecionadoId, onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map || !onResultadosExternos) return;
    const busca = consulta.trim();
    const consultas = busca.length >= 3
      ? [`ecoponto ${busca}, Brasil`]
      : [
          "ecoponto em Jandira, SP",
          "ponto de reciclagem em Jandira, SP",
          "coleta seletiva em Jandira, SP",
        ];

    if (!consultas.length) {
      onResultadosExternos([]);
      return undefined;
    }

    let ativo = true;
    window.google.maps.importLibrary("places")
      .then(async ({ Place }) => {
        const locationBias = map.getBounds() || CENTRO_JANDIRA;
        const respostas = await Promise.all(
          consultas.map((textQuery) => Place.searchByText({
            textQuery,
            fields: ["displayName", "formattedAddress", "location", "id"],
            maxResultCount: 20,
            language: "pt-BR",
            region: "BR",
            locationBias,
          }))
        );
        return respostas.flatMap(({ places }) => places || []);
      })
      .then((lugares) => {
        if (ativo) onResultadosExternos(lugaresToPontos(lugares));
      })
      .catch(() => {
        if (ativo) onResultadosExternos([]);
      });
    return () => { ativo = false; };
  }, [consulta, mapReady, onResultadosExternos]);

  useEffect(() => {
    const map = mapRef.current;
    const infoWindow = infoWindowRef.current;
    if (!mapReady || !map || !infoWindow) return;
    let ativo = true;
    infoWindow.close();
    setEstadoLocalizacao(null);

    function mostrarPonto({ lat, lng }) {
      const posicao = { lat, lng };
      map.setCenter(posicao);
      map.setZoom(ZOOM_INICIAL);
      infoWindow.setPosition(posicao);
      infoWindow.open({ map });
    }

    if (!selecionado) return;
    if (temCoordenadasValidas(selecionado)) {
      mostrarPonto(selecionado);
      return;
    }

    const posicaoPublicada = coordenadasPublicadas(selecionado);
    if (posicaoPublicada) {
      mostrarPonto(posicaoPublicada);
      return;
    }

    if (!selecionado.enderecoObj && !selecionado.endereco) {
      setEstadoLocalizacao("Este ponto está sem uma localização válida.");
      return;
    }

    setEstadoLocalizacao("Buscando o endereço do ponto…");
    localizarPeloEndereco(selecionado).then((posicao) => {
      if (!ativo) return;
      mostrarPonto(posicao);
      setEstadoLocalizacao(null);
    }).catch(() => {
      if (ativo) setEstadoLocalizacao("Não foi possível localizar este ponto pelo endereço cadastrado.");
    });
    return () => { ativo = false; };
  }, [mapReady, selecionado, revisaoSelecao]);

  const localizar = () => navigator.geolocation?.getCurrentPosition(({ coords }) => {
    mapRef.current?.panTo({ lat: coords.latitude, lng: coords.longitude });
    mapRef.current?.setZoom(14);
  });

  return (
    <section className="relative h-[calc(100vh-260px)] min-h-[520px] flex-1 overflow-hidden rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(31,41,55,0.08)]">
      <div ref={containerRef} className="h-full w-full" />
      {erro && <div className="absolute left-3 top-3 z-10 rounded-lg bg-white px-3 py-2 text-sm text-red-600 shadow">{erro}</div>}
      {estadoLocalizacao && <p role="status" className="absolute left-3 top-3 z-10 max-w-[75%] rounded-lg bg-white px-3 py-2 text-sm text-slate-700 shadow">{estadoLocalizacao}</p>}
      <ControlesMapa
        onZoomIn={() => mapRef.current?.setZoom((mapRef.current.getZoom() || 12) + 1)}
        onZoomOut={() => mapRef.current?.setZoom((mapRef.current.getZoom() || 12) - 1)}
        onLocalizar={localizar}
      />
      {selecionado && createPortal(<PopupPonto ponto={selecionado} />, popupNode)}
    </section>
  );
}

function lugaresToPontos(lugares) {
  const ids = new Set();
  return lugares
    .filter((lugar) => {
      if (!lugar.location || !lugar.id || ids.has(lugar.id)) return false;
      ids.add(lugar.id);
      return true;
    })
    .map((lugar) => ({
      id: `google-${lugar.id}`,
      nome: lugar.displayName || "Ecoponto encontrado no Google Maps",
      endereco: lugar.formattedAddress || "Endereço não informado",
      cep: "",
      cidade: "",
      status: "ativo",
      materiais: [],
      materiaisObj: [],
      lat: lugar.location.lat(),
      lng: lugar.location.lng(),
      externo: true,
      origem: "Google Maps",
    }));
}
