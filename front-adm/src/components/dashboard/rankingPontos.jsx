import ItemRanking from "./itemRanking.jsx"

export default function RankingPontos({ 
  usuarios = [], 
  filtroAtivo = "semanal", 
  carregando = false 
}) {
  return (
    <article className = "flex min-w-0 flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgba(31,41,55,0.05)] sm:p-6">
      
      {/* Cabeçalho Fixo */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Destaques</p>
            <h2 className = "mt-1 text-xl font-bold text-slate-800">Ranking de pontos</h2>
          </div>
        </div>
        <p className = "mt-2 border-b border-slate-100 pb-4 text-sm text-slate-400">
          Os usuários que mais pontuaram {filtroAtivo === "diario" ? "hoje" : filtroAtivo === "mensal" ? "este mês" : "esta semana"}
        </p>
      </div>

      {/* Lista com Rolagem */}
      <div className = "mt-2 max-h-[338px] min-h-[240px] flex-1 overflow-y-auto pr-1 scrollbar-hide">
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

    </article>
  )
}
