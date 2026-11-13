import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import PopupPonto from "./PopupPonto.jsx";
import ControlesMapa from "./ControlesMapa.jsx";

const CENTRO_SP = { lat: -23.55, lng: -46.65 };
const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
let mapsPromise;

function carregarGoogleMaps() {
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  if (!GOOGLE_MAPS_KEY) return Promise.reject(new Error("VITE_GOOGLE_MAPS_API_KEY não configurada."));
  if (mapsPromise) return mapsPromise;
  mapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.dataset.googleMaps = "true";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_KEY)}&libraries=geometry&language=pt-BR&region=BR`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error("Não foi possível carregar o Google Maps."));
    document.head.appendChild(script);
  });
  return mapsPromise;
}

const COR_PIN = { ativo: "#4da558", manutencao: "#b7791f", cheio: "#c9363d" };

function iconePin(status, selecionado) {
  return {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: selecionado ? 10 : 7,
    fillColor: selecionado ? "#65BA69" : "#ffffff",
    fillOpacity: 1,
    strokeColor: selecionado ? "#65BA69" : (COR_PIN[status] || "#64748b"),
    strokeWeight: 3,
  };
}

export default function MapaPontosGoogle({ pontos, selecionadoId, onSelect }) {
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
        streetViewControl: false, fullscreenControl: false,
      });
      infoWindowRef.current = new maps.InfoWindow({ content: popupNode, disableAutoPan: false });
      setMapReady(true);
    }).catch((e) => setErro(e.message));

    return () => {
      ativo = false;
      Object.values(marcadoresRef.current).forEach(({ marker }) => marker.setMap(null));
      marcadoresRef.current = {};
      mapRef.current = null;
    };
  }, [popupNode]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;
    Object.values(marcadoresRef.current).forEach(({ marker }) => marker.setMap(null));
    marcadoresRef.current = {};
    pontos.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng)).forEach((p) => {
      const marker = new window.google.maps.Marker({
        map, position: { lat: p.lat, lng: p.lng }, title: p.nome,
        icon: iconePin(p.status, p.id === selecionadoId),
      });
      marker.addListener("click", () => onSelect(p.id));
      marcadoresRef.current[p.id] = { marker };
    });
  }, [mapReady, pontos, selecionadoId, onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    const infoWindow = infoWindowRef.current;
    if (!mapReady || !map || !infoWindow) return;
    pontos.forEach((p) => {
      const item = marcadoresRef.current[p.id];
      if (item) item.marker.setIcon(iconePin(p.status, p.id === selecionadoId));
    });
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
