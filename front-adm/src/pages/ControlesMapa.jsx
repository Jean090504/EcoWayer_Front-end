// Botões flutuantes: zoom +/- e "minha localização"
export default function ControlesMapa({ onZoomIn, onZoomOut, onLocalizar }) {
    return (
      // Coluna no canto superior direito do mapa
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
        {/* Grupo de zoom */}
        <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow">
          <button onClick={onZoomIn} className="h-8 w-8 text-gray-600 hover:bg-gray-50">+</button>
          <button onClick={onZoomOut} className="h-8 w-8 border-t border-gray-100 text-gray-600 hover:bg-gray-50">−</button>
        </div>
  
        {/* Centralizar na localização do usuário */}
        <button onClick={onLocalizar} className="h-8 w-8 rounded-lg bg-white text-gray-600 shadow hover:bg-gray-50">◎</button>
      </div>
    );
  }