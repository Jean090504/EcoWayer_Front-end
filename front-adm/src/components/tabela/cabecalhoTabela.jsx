export default function CabecalhoTabela({ texto, textoCor, largura, alinhamento }) {
    return (
      <span className = {`${textoCor} text-[clamp(14px,0.9vw,17px)] font-bold uppercase ${largura} ${alinhamento}`}>
        {texto}
      </span>
    )
}
