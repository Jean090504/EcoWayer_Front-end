import { useState } from "react"
import barra from '../../assets/icons/imagens/barra-input.png'

export default function InputLogin({ label, icone, placeholder, tipo, iconeDireita }) {
  const [mostrarSenha, setMostrarSenha] = useState(false)

  const tipoFinal = tipo === "password" && mostrarSenha ? "text" : tipo

  return (
    <div className = "w-full"> {/* Avisa que ocupa a largura toda do pai */}
      <p className = "text-[#724BC2] font-medium text-[clamp(16px,1vw,20px)]">{label}</p>
      
      {/* O container dita a largura responsiva */}
      <div className = "relative w-[clamp(400px,25vw,450px)]">
        <img src = {icone} alt = "" className = "absolute left-0 top-[10px] -translate-y-1/2 w-[clamp(17.5px,1.3vw,20px)] h-[clamp(17px,1.3vw,20px)] cursor-pointer"/>
        <img src = {barra} alt = "" className = "absolute left-[23px] top-[10.5px] -translate-y-1/2 w-[2px] h-[14px]"/>
        
        {/* O input ocupa 100% do container, sem largura fixa própria */}
        <input 
          type = {tipoFinal} 
          placeholder = {placeholder} 
          className = "w-full border-0 border-b border-[#65BA69] bg-transparent outline-none text-gray-600 placeholder-gray-400 mb-8 pl-[30px]"
        />
        
        {iconeDireita && (
          <img 
            src = {iconeDireita} 
            alt = "" 
            onClick = {() => setMostrarSenha(!mostrarSenha)}
            className = "absolute right-0 top-[10px] -translate-y-1/2 w-[20px] h-[20px] cursor-pointer"
          />
        )}
      </div>
    </div>
  )
}