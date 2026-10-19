import { useState } from "react"
import barra from '../assets/iconsLogin/barra.png'

export default function InputLogin({ label, icone, placeholder, tipo, iconeDireita }) {
  const [mostrarSenha, setMostrarSenha] = useState(false)

  const tipoFinal = tipo === "password" && mostrarSenha ? "text" : tipo

  return (
    <div className = "w-full"> {/* Avisa que ocupa a largura toda do pai */}
      <p className = "text-[#724BC2] font-medium text-[16px]">{label}</p>
      
      {/* O container dita a largura responsiva */}
      <div className = "relative w-[350px] 2xl:w-[400px]">
        <img src = {icone} alt = "" className = "absolute left-0 top-[10px] -translate-y-1/2 w-[17.5px] h-[17px] cursor-pointer"/>
        <img src = {barra} alt = "" className = "absolute left-[23px] top-[10.5px] -translate-y-1/2 h-[14px]"/>
        
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