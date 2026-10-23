export default function BotaoMenu({ ativo, imagem, larguraImagem, altura: alturaImagem, texto, onClick }) {
    return (
      <div className = "relative">
        <img
          src = {imagem}
          alt = ""
          className = {`${larguraImagem} ${alturaImagem} absolute left-0 top-[20px] pl-[15px] -translate-y-1/2  ${
            ativo ? "brightness-0 invert" : ""
          }`}
        />
        <button
          onClick = {onClick}
          className = {`w-[clamp(190px,14vw,260px)] h-[clamp(45px,3.3vw,50px)] text-[clamp(16px,1vw,20px)] text-left rounded-[12px] pl-12.5 cursor-pointer ${
            ativo ? "bg-[#65BA69] text-white" : "bg-transparent text-black"
          }`}
        >
          {texto}
        </button>
      </div>
    )
}