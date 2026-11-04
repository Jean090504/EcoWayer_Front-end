export default function CabecalhoTabela({ texto, textoCor, alinhamento }) {
    return (
      <span className = {`${textoCor} text-[clamp(12px,0.8vw,16px)] font-bold uppercase flex justify-evenly w-full ${alinhamento}`}>
        {texto}
      </span>
    )
}