export default function BotaoMenu({ ativo, imagem, larguraImagem, altura: alturaImagem, texto, onClick }) {
  return (
    <div className="w-full">
      <button
        onClick={onClick}
        className={`flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold transition ${
          ativo ? "bg-[#65BA69] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <img
          src={imagem}
          alt=""
          className={`${larguraImagem} ${alturaImagem} shrink-0 object-contain ${ativo ? "brightness-0 invert" : ""}`}
        />
        <span className="whitespace-nowrap">{texto}</span>
      </button>
    </div>
  )
}
