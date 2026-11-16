import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import PopupPonto from "./PopupPonto.jsx";
import ControlesMapa from "./ControlesMapa.jsx";

const CENTRO_SP = { lat: -23.55, lng: -46.65 };
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

export default function MapaPontosGoogle({ pontos, selecionadoId, onSelect, consulta = "", onResultadosExternos }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);
  const marcadoresRef = useRef({});
  const [popupNode] = useState(() => document.createElement("div"));
  const [mapReady, setMapReady] = useState(false);
  const [erro, setErro] = useState(null);
  const selecionado = pontos.find((p) => p.id === selecionadoId);

  useEffect(() => {
    let ativo = true;
    carregarGoogleMaps().then((maps) => {
      if (!ativo || !containerRef.current) return;
      mapRef.current = new maps.Map(containerRef.current, {
        center: CENTRO_SP, zoom: 11.5, mapTypeControl: false,
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
    Object.values(marcadoresRef.current).forEach(({ marker }) => { marker.map = null; });
    marcadoresRef.current = {};
    const pontosComCoordenadas = pontos.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
    const limites = new window.google.maps.LatLngBounds();
    window.google.maps.importLibrary("marker").then(({ AdvancedMarkerElement, PinElement }) => {
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
        limites.extend({ lat: p.lat, lng: p.lng });
      });
      if (pontosComCoordenadas.length > 1) map.fitBounds(limites, 70);
      if (pontosComCoordenadas.length === 1) {
        map.setCenter({ lat: pontosComCoordenadas[0].lat, lng: pontosComCoordenadas[0].lng });
        map.setZoom(14);
      }
    });
  }, [mapReady, pontos, selecionadoId, onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map || !onResultadosExternos) return;
    const busca = consulta.trim();
    const consultas = busca.length >= 3
      ? [`ecoponto ${busca}, Brasil`]
      : [
          "ecoponto, Brasil",
          "ponto de reciclagem, Brasil",
          "coleta seletiva, Brasil",
        ];

    if (!consultas.length) {
      onResultadosExternos([]);
      return undefined;
    }

    let ativo = true;
    window.google.maps.importLibrary("places")
      .then(async ({ Place }) => {
        const locationBias = map.getBounds() || map.getCenter();
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
    if (selecionado && Number.isFinite(selecionado.lat) && Number.isFinite(selecionado.lng)) {
      const posicao = { lat: selecionado.lat, lng: selecionado.lng };
      map.panTo(posicao); map.setZoom(14); infoWindow.setPosition(posicao); infoWindow.open({ map });
    } else infoWindow.close();
  }, [mapReady, selecionadoId, pontos, selecionado]);

  const localizar = () => navigator.geolocation?.getCurrentPosition(({ coords }) => {
    mapRef.current?.panTo({ lat: coords.latitude, lng: coords.longitude });
    mapRef.current?.setZoom(14);
  });

  return (
    <section className="relative h-[calc(100vh-260px)] min-h-[520px] flex-1 overflow-hidden rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(31,41,55,0.08)]">
      <div ref={containerRef} className="h-full w-full" />
      {erro && <div className="absolute left-3 top-3 z-10 rounded-lg bg-white px-3 py-2 text-sm text-red-600 shadow">{erro}</div>}
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
