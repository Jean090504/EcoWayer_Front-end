import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

export default function SearchBar({ onSearch, onFilterClick }) {
  const [termo, setTermo] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onSearch?.(termo.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-10 w-full items-center gap-2
        rounded-xl border border-gray-200 bg-white
        px-3 shadow-[0_2px_5px_rgba(0,0,0,0.08)]
        transition focus-within:border-lime-500"
    >
      <Search
        size={17}
        className="shrink-0 text-gray-400"
      />

      <input
        type="search"
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        placeholder="Buscar cep, rua ou bairro"
        aria-label="Buscar CEP, rua ou bairro"
        className="min-w-0 flex-1 bg-transparent
          text-sm text-gray-700 outline-none
          placeholder:text-gray-400"
      />

      <div className="h-6 w-px shrink-0 bg-gray-200" />

      <button
        type="button"
        onClick={onFilterClick}
        aria-label="Abrir filtros"
        className="flex h-8 w-8 shrink-0 items-center
          justify-center rounded-lg text-lime-600
          transition hover:bg-lime-50"
      >
        <SlidersHorizontal size={18} />
      </button>
    </form>
  );
}
