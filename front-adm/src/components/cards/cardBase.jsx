export default function CardBase({ imagem, botaoTexto, children, onClick, onDelete, imagemTamanho = "w-auto h-auto", margin }) {
  return (
    <div className = {`flex flex-row bg-[#FFFFFF] gap-4 items-center rounded-lg shadow-md w-full min-h-[130px] h-[15vh]`}>

      {imagem ? <img src = {imagem} alt = "" onError={(e) => { e.currentTarget.style.display = "none" }} className = {`${imagemTamanho} ${margin}`} /> : <div className="ml-4 h-[56px] w-[56px] shrink-0 rounded-xl bg-[#7350B9]" />}

      <div className = "flex flex-col gap-1">
        {children}
      </div>

      <div className="ml-auto mr-5 flex items-center gap-2">
      <button className = "bg-[#7350B9] text-[#FFFFFF] text-[clamp(16px,1.2vw,18px)] w-[clamp(180px,15vw,200px)] h-[clamp(45px,5vh,60px)] rounded-[10px] cursor-pointer" onClick = {onClick}>
        {botaoTexto}
      </button>
      {onDelete && <button type="button" onClick={onDelete} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Excluir</button>}
      </div>

    </div>
  )
}
