export default function CardSair({ aoCancelar, aoConfirmar }) {
  return (
    // fundo escuro (overlay) que ocupa a tela toda
    <div className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50">
 
      <div className = "bg-white p-6 rounded-lg shadow-lg w-[400px] flex flex-col gap-4">
        <h2 className = "text-[#202735] text-[20px] font-bold">Encerrar sessão?</h2>
        <p className = "text-gray-500">Você vai precisar fazer login novamente.</p>
        
        <div className = "flex justify-end gap-3 mt-4">
         
          <button 
            onClick = {aoCancelar}
            className = "px-4 py-2 rounded text-gray-600 hover:bg-gray-100 cursor-pointer"
          >
            Cancelar
          </button>
          
          <button 
            onClick = {aoConfirmar}
            className = "px-4 py-2 rounded bg-[#E43E42] text-white cursor-pointer"
          >
            Sair
          </button>
        </div>
      </div>

    </div>
  )
}