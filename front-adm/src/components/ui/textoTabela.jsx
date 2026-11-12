export default function TextoTabela({ texto, corTexto, background }) {
  return (
    <span className = {`${background} ${corTexto} inline-flex min-w-[38px] justify-center rounded-full px-2 py-1 text-[10px] font-bold`}>
      {texto}
    </span>
  )
}
