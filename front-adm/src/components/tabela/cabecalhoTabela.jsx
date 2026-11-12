export default function CabecalhoTabela({ texto, textoCor, largura, alinhamento }) {
    return (
      <span className = {`${textoCor} text-[clamp(12px,0.8vw,16px)] font-bold uppercase ${largura} ${alinhamento}`}>
        {texto}
      </span>
    )
}