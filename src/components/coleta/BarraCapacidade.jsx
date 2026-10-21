// Escolhe a cor da barra conforme o nível de ocupação
function corDaBarra(valor) {
    if (valor >= 95) return "bg-red-500";
    if (valor >= 80) return "bg-orange-400";
    return "bg-green-500";
  }
  
  export default function BarraCapacidade({ valor }) {
    return (
      // Bloco inteiro da capacidade (rótulo + porcentagem + barra)
      <div className="w-full">
        {/* Linha com o rótulo "Capacidade" à esquerda e a % à direita */}
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>Capacidade</span>
          <span className="font-semibold text-gray-700">{valor}%</span>
        </div>
  
        {/* Trilho cinza da barra */}
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          {/* Preenchimento: largura = % de capacidade */}
          <div className={`h-full rounded-full ${corDaBarra(valor)}`} style={{ width: `${valor}%` }} />
        </div>
      </div>
    );
  }