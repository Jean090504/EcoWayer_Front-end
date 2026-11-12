export default function TextoTabela({ texto, corTexto, background }) {
  return (
    <span className = {`${background} ${corTexto} inline-flex min-w-[42px] justify-center rounded-full px-2 py-1 text-xs font-bold`}>
      {texto}
    </span>
  )
}
