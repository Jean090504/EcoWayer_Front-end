export default function BotaoVoltar({ aoVoltar, texto }) {
  return (
    <button className = "text-[#9A9A9A] pt-[clamp(20px,1.3vw,26px)] pl-[clamp(24px,1.6vw,32px)]" onClick = {aoVoltar}>{texto}</button>
)}