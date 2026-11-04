// Escolhe a cor da barra conforme o nível de ocupação
function corDaBarra(valor) {
    if (valor >= 95) return "bg-[#E43E42]"
    if (valor >= 80) return "bg-[#F59E0B]"
    return "bg-[#2E9E5B]"
  }
  
  export default function BarraCapacidade({ valor }) {
    return (
      // Bloco inteiro da capacidade (rótulo + porcentagem + barra)
      <div className="w-full">
        {/* Linha com o rótulo "Capacidade" à esquerda e a % à direita */}
        <div className="flex justify-between text-[10px] text-[#6B7280]">
          <span>Capacidade</span>
          <span className="font-semibold text-[#1F2937]">{valor}%</span>
        </div>
  
        {/* Trilho cinza da barra */}
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
          {/* Preenchimento: largura = % de capacidade */}
          <div className={`h-full rounded-full ${corDaBarra(valor)}`} style={{ width: `${valor}%` }} />
        </div>
      </div>
    );
  }