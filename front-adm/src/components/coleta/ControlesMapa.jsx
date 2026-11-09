// Botões flutuantes: zoom +/- e "minha localização"
export default function ControlesMapa({ onZoomIn, onZoomOut, onLocalizar }) {
    return (
      // Coluna no canto superior direito do mapa
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
        {/* Grupo de zoom */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <button onClick={onZoomIn} className="h-9 w-9 text-[#7350B9] transition hover:bg-violet-50">+</button>
          <button onClick={onZoomOut} className="h-9 w-9 border-t border-slate-100 text-[#7350B9] transition hover:bg-violet-50">−</button>
        </div>
  
        {/* Centralizar na localização do usuário */}
        <button onClick={onLocalizar} className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-[#65BA69] shadow-lg transition hover:bg-green-50">◎</button>
      </div>
    );
  }
