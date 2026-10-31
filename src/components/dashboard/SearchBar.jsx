import { useState } from "react"
import InputBusca from "../ui/inputBusca.jsx"

export default function SearchBar({ onSearch, onFilterClick }) {
  const [termo, setTermo] = useState("")

  function handleSubmit(event) {
    event.preventDefault()
    onSearch?.(termo.trim())
  }

  return (
    <form onSubmit = {handleSubmit}>
      <InputBusca
        placeholder = "Buscar cep, rua ou bairro"
        value = {termo}
        onChange = {(e) => setTermo(e.target.value)}
        aoFiltrar = {onFilterClick}
      />
    </form>
  )
}