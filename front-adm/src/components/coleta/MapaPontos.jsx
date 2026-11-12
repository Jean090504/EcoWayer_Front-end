import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import PopupPonto from "./PopupPonto.jsx";
import ControlesMapa from "./ControlesMapa.jsx";

// Token público do Mapbox vem do .env (nunca deixe fixo no código)
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// O Mapbox GL envia eventos de telemetria para events.mapbox.com. Essa chamada
// não participa do desenho do mapa e falha em ambientes sem acesso a esse host,
// gerando erros não tratados no console. O mapa continua funcionando sem ela.
try {
  Object.defineProperty(mapboxgl.config, "EVENTS_URL", {
    configurable: true,
    value: null,
  });
} catch {
  // Algumas versões do Mapbox podem expor a configuração como não configurável.
}

// Centro inicial do mapa: São Paulo [lng, lat]
const CENTRO_SP = [-46.65, -23.55];

// Classes do pin por status (borda/cor do ícone)
const COR_PIN = {
  ativo: "border-[#65BA69] text-[#4da558]",
  manutencao: "border-[#d8a24a] text-[#b7791f]",
  cheio: "border-[#d95b61] text-[#c9363d]",
};

// Cria o elemento HTML do pin (Mapbox exige um elemento DOM para o Marker)
function criarElementoPin(ponto, selecionado) {
  const el = document.createElement("button");
  el.className = estiloPin(ponto.status, selecionado);
  el.innerHTML = `<svg viewBox="0 0 24 24" class="h-3/5 w-3/5" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"/></svg>`;
  return el;
}

// Pin pequeno branco; selecionado = maior e verde sólido
function estiloPin(status, selecionado) {
  const base = "flex items-center justify-center rounded-full border-2 transition-all";
  return selecionado
    ? `${base} h-[clamp(32px,2.5vw,40px)] w-[clamp(32px,2.5vw,40px)] border-[#65BA69] bg-[#65BA69] text-white`
    : `${base} h-[clamp(20px,1.5vw,24px)] w-[clamp(20px,1.5vw,24px)] bg-white ${COR_PIN[status]}`;
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
    if (!containerRef.current || !mapboxgl.accessToken) return undefined;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12", // estilo padrão do Mapbox (ruas coloridas)
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
    if (!map) return;
    Object.values(marcadoresRef.current).forEach(({ marker }) => marker.remove());
    marcadoresRef.current = {};

    pontos.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng)).forEach((p) => {
      const el = criarElementoPin(p, p.id === selecionadoId);
      el.addEventListener("click", () => onSelect(p.id));
      const marker = new mapboxgl.Marker({ element: el }).setLngLat([p.lng, p.lat]).addTo(map);
      marcadoresRef.current[p.id] = { marker, el };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pontos]);

  // 3) Quando a seleção muda: destaca o pin, voa até ele e abre o popup
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    pontos.forEach((p) => {
      const item = marcadoresRef.current[p.id];
      if (item) item.el.className = estiloPin(p.status, p.id === selecionadoId);
    });

    if (selecionado) {
      map.flyTo({ center: [selecionado.lng, selecionado.lat], zoom: 14, duration: 800 });
      popupRef.current.setLngLat([selecionado.lng, selecionado.lat]).addTo(map);
    } else {
      popupRef.current.remove();
    }
  }, [selecionadoId, pontos, selecionado]);

  // Centraliza no usuário usando a geolocalização do navegador
  const localizar = () => {
    navigator.geolocation?.getCurrentPosition(({ coords }) =>
      mapRef.current?.flyTo({ center: [coords.longitude, coords.latitude], zoom: 14 })
    );
  };

  return (
    // Container do mapa com cantos arredondados
    <section className="relative h-[calc(100vh-260px)] min-h-[520px] flex-1 overflow-hidden rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(31,41,55,0.08)]">
      {/* Div onde o Mapbox renderiza o mapa (h-full w-full: o CSS do Mapbox força position:relative, então não use absolute aqui) */}
      <div ref={containerRef} className="h-full w-full" />

      {/* Controles de zoom e localização */}
      <ControlesMapa
        onZoomIn={() => mapRef.current.zoomIn()}
        onZoomOut={() => mapRef.current.zoomOut()}
        onLocalizar={localizar}
      />

      {/* Legenda de status */}

      {/* Renderiza o conteúdo React do popup dentro do popup do Mapbox */}
      {selecionado && createPortal(<PopupPonto ponto={selecionado} />, popupNode)}
    </section>
  );
}
