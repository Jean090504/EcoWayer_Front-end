import ItemRanking from "./itemRanking.jsx"
import BotaoFiltro from "./botaoFiltro.jsx"

export default function RankingPontos({ 
  usuarios = [], 
  filtroAtivo = "semanal", 
  aoMudarFiltro = () => {}, 
  carregando = false 
}) {
  return (
    <div className = "bg-[#FFFFFF] rounded-[25px] p-8 w-[40%] min-h-[425px] shadow-md flex flex-col">
      
      {/* Cabeçalho Fixo */}
      <div>
        <h2 className = "text-[24px] font-bold text-[#202735]">Ranking de Pontos</h2>
        <p className = "text-[#8A8A8A] text-[15px] mt-1 pb-4 border-b border-[#E5E7EB]">
          Os usuários que mais pontuaram {filtroAtivo === "diario" ? "hoje" : filtroAtivo === "mensal" ? "este mês" : "esta semana"}
        </p>
      </div>

      {/* Lista com Rolagem */}
      <div className = "flex-1 min-h-0 overflow-y-auto pr-2 mt-2 scrollbar-hide">
        {carregando ? (
          <div className = "flex items-center justify-center h-full text-[#8A8A8A]">
            Carregando ranking...
          </div>
        ) : usuarios.length === 0 ? (
          <div className = "flex items-center justify-center h-full text-[#8A8A8A]">
            Nenhum usuário encontrado.
          </div>
        ) : (
          usuarios.map((usuario, index) => (
            <ItemRanking 
              key = {usuario.id}
              posicao = {index + 1} 
              nome = {usuario.nome}
              pontos = {usuario.pontos}
              variacao = {usuario.variacao}
              fotoUrl = {usuario.fotoUrl} // Agora aceita a foto que vem da API
              isLast = {index === usuarios.length - 1} 
            />
          ))
        )}
      </div>

      {/* Botões de Filtro Dinâmicos */}
      <div className = "flex flex-row bg-[#7350B9] rounded-full p-1 mt-4">
        
        <BotaoFiltro texto = "Diário" ativo = {filtroAtivo === "diario"} onClick = {() => aoMudarFiltro("diario")} />
        <BotaoFiltro texto = "Semanal" ativo = {filtroAtivo === "semanal"} onClick = {() => aoMudarFiltro("semanal")} />
        <BotaoFiltro texto = "Mensal" ativo = {filtroAtivo === "mensal"} onClick = {() => aoMudarFiltro("mensal")} />

      </div>

    </div>
  )
}