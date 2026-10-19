export default function BotaoMenu({ ativo, imagem, largura, altura, texto, onClick }) {
    return (
      <div className = "relative">
        <img
          src = {imagem}
          alt = ""
          className = {`${largura} ${altura} absolute left-0 top-[20px] pl-[15px] -translate-y-1/2  ${
            ativo ? "brightness-0 invert" : ""
          }`}
        />
        <button
          onClick = {onClick}
          className = {`w-[190px] h-[45px] text-left rounded-[12px] pl-12.5 cursor-pointer ${
            ativo ? "bg-[#65BA69] text-white" : "bg-transparent text-black"
          }`}
        >
          {texto}
        </button>
      </div>
    )
}