export default function TextoTabela({ texto, corTexto, background }) {
  return (
    <span className = {`${background} ${corTexto} text-[clamp(10px,0.7vw,14px)] font-semibold px-2 py-1 rounded-[6px]`}>
      {texto}
    </span>
  )
}