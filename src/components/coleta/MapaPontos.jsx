import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import PopupPonto from "./PopupPonto.jsx";
import ControlesMapa from "./ControlesMapa.jsx";
import LegendaMapa from "./LegendaMapa.jsx";

// Token público do Mapbox vem do .env (nunca deixe fixo no código)
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// Centro inicial do mapa: São Paulo [lng, lat]
const CENTRO_SP = [-46.65, -23.55];

// Pin normal (não selecionado): fundo branco, borda e ícone na cor do status
const COR_PIN = {
  ativo: "border-green-500 text-green-600",
  manutencao: "border-orange-400 text-orange-500",
  cheio: "border-red-500 text-red-600",
  inativo: "border-red-500 text-red-600",
};

// Pin selecionado: maior e preenchido na cor do status
const COR_PIN_SELECIONADO = {
  ativo: "border-green-600 bg-green-600 text-white",
  manutencao: "border-orange-500 bg-orange-500 text-white",
  cheio: "border-red-600 bg-red-600 text-white",
  inativo: "border-red-600 bg-red-600 text-white",
};

// Cores de reserva caso venha um status que não está nas listas
const PIN_PADRAO = "border-gray-400 text-gray-500";
const PIN_SELECIONADO_PADRAO = "border-gray-500 bg-gray-500 text-white";

// Pin pequeno branco; selecionado = maior e preenchido, sempre na cor do status
function estiloPin(status, selecionado) {
  const base = "flex items-center justify-center rounded-full border-2 transition-all";
  return selecionado
    ? `${base} h-10 w-10 ${COR_PIN_SELECIONADO[status] ?? PIN_SELECIONADO_PADRAO}`
    : `${base} h-6 w-6 bg-white ${COR_PIN[status] ?? PIN_PADRAO}`;
}

// Cria o elemento HTML do pin (Mapbox exige um elemento DOM para o Marker)
function criarElementoPin(ponto, selecionado) {
  const el = document.createElement("button");
  el.className = estiloPin(ponto.status, selecionado);
  el.innerHTML = `<svg viewBox="0 0 24 24" class="h-3/5 w-3/5" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"/></svg>`;
  return el;
}

export default function MapaPontos({ pontos, selecionadoId, onSelect }) {
  const containerRef = useRef(null); // div onde o Mapbox desenha
  const mapRef = useRef(null);       // instância do mapa
  const marcadoresRef = useRef({});  // { idDoPonto: { marker, el } }
  const popupRef = useRef(null);     // instância do popup
  const [popupNode] = useState(() => document.createElement("div")); // div que recebe o React via portal

  const selecionado = pontos.find((p) => p.id === selecionadoId);

  // 1) Cria o mapa uma única vez
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: CENTRO_SP,
      zoom: 11.5,
      attributionControl: false,
    });
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");
    mapRef.current = map;

    // Popup único, reaproveitado para o ponto selecionado
    popupRef.current = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 28, maxWidth: "none" })
      .setDOMContent(popupNode);

    // Redesenha o mapa sempre que o tamanho da caixa mudar (janela, sidebar, etc.)
    const observer = new ResizeObserver(() => map.resize());
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      map.remove(); // limpa ao desmontar
    };
  }, [popupNode]);

  // 2) Cria/atualiza os marcadores quando a lista de pontos muda
  useEffect(() => {
    const map = mapRef.current;
    Object.values(marcadoresRef.current).forEach(({ marker }) => marker.remove());
    marcadoresRef.current = {};

    pontos.forEach((p) => {
      // ignora pontos sem coordenadas válidas (evita o erro Invalid LngLat)
      if (!Number.isFinite(p.lat) || !Number.isFinite(p.lng)) return;
      const el = criarElementoPin(p, p.id === selecionadoId);
      el.addEventListener("click", () => onSelect(p.id));
      const marker = new mapboxgl.Marker({ element: el }).setLngLat([p.lng, p.lat]).addTo(map);
      marcadoresRef.current[p.id] = { marker, el };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pontos]);

  // 3) Quando a seleção ou os dados mudam: recolore os pins, voa até o selecionado e abre o popup
  useEffect(() => {
    const map = mapRef.current;
    pontos.forEach((p) => {
      const item = marcadoresRef.current[p.id];
      if (item) item.el.className = estiloPin(p.status, p.id === selecionadoId);
    });

    if (selecionado && Number.isFinite(selecionado.lat) && Number.isFinite(selecionado.lng)) {
      map.flyTo({ center: [selecionado.lng, selecionado.lat], zoom: 14, duration: 800 });
      popupRef.current.setLngLat([selecionado.lng, selecionado.lat]).addTo(map);
    } else {
      popupRef.current.remove();
    }
  }, [selecionadoId, pontos, selecionado]);

  // Centraliza no usuário usando a geolocalização do navegador
  const localizar = () => {
    navigator.geolocation?.getCurrentPosition(({ coords }) =>
      mapRef.current.flyTo({ center: [coords.longitude, coords.latitude], zoom: 14 })
    );
  };

  return (
    <section className="relative h-[calc(100vh-200px)] min-h-[420px] flex-1 overflow-hidden rounded-2xl shadow-inner">
      {/* h-full w-full: o CSS do Mapbox força position:relative, então não use absolute aqui */}
      <div ref={containerRef} className="h-full w-full" />

      <ControlesMapa
        onZoomIn={() => mapRef.current.zoomIn()}
        onZoomOut={() => mapRef.current.zoomOut()}
        onLocalizar={localizar}
      />

      <LegendaMapa />

      {/* Renderiza o conteúdo React do popup dentro do popup do Mapbox */}
      {selecionado && createPortal(<PopupPonto ponto={selecionado} />, popupNode)}
    </section>
  );
}