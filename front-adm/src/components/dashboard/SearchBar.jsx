import { useState } from "react"
import InputBusca from "../ui/inputBusca.jsx"

export default function SearchBar({ onSearch, onFilterClick, maxWidth }) {
  const [termo, setTermo] = useState("")

  function handleSubmit(event) {
    event.preventDefault()
    onSearch?.(termo.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <InputBusca
        placeholder = "Buscar cep, rua ou bairro"
        value = {termo}
        onChange = {(e) => setTermo(e.target.value)}
        aoFiltrar = {onFilterClick}
        maxWidth = {maxWidth}
      />
    </form>
  )
}
