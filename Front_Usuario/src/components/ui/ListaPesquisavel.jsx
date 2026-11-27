import { useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

function normalizar(texto) {
    return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

export default function ListaPesquisavel({ titulo, opcoes, valor, onSelecionar, placeholder, desabilitado }) {
    const [aberta, setAberta] = useState(false);
    const [pesquisa, setPesquisa] = useState("");
    const [indiceAtivo, setIndiceAtivo] = useState(0);
    const campoRef = useRef(null);
    const selecionada = opcoes.find(opcao => String(opcao.valor) === String(valor));
    const filtradas = opcoes.filter(opcao => normalizar(opcao.nome).includes(normalizar(pesquisa)));
    const id = titulo === "Cidade" ? "cidade" : "estado";

    function escolher(opcao) {
        onSelecionar(opcao.valor);
        setPesquisa("");
        setAberta(false);
        campoRef.current?.blur();
    }

    function teclado(evento) {
        if (evento.key === "Escape") { setAberta(false); setPesquisa(""); campoRef.current?.blur(); }
        if (evento.key === "ArrowDown") { evento.preventDefault(); setAberta(true); setIndiceAtivo(indice => Math.min(indice + 1, filtradas.length - 1)); }
        if (evento.key === "ArrowUp") { evento.preventDefault(); setIndiceAtivo(indice => Math.max(indice - 1, 0)); }
        if (evento.key === "Enter" && aberta && filtradas[indiceAtivo]) { evento.preventDefault(); escolher(filtradas[indiceAtivo]); }
    }

    return <div className="relative" onBlur={evento => { if (!evento.currentTarget.contains(evento.relatedTarget)) { setAberta(false); setPesquisa(""); } }}>
        <label htmlFor={`filtro-${id}`} className="mb-2 block text-xs font-bold text-[#43394D]">{titulo}</label>
        <div className={`flex h-11 items-center gap-2 rounded-xl border px-3 transition focus-within:border-[#724BC2] focus-within:ring-2 focus-within:ring-[#724BC2]/15 ${aberta ? "border-[#724BC2]" : "border-[#DED8E6]"} ${desabilitado ? "bg-gray-50 opacity-60" : "bg-white"}`}>
            <Search size={16} className="shrink-0 text-[#796D85]" aria-hidden="true" />
            <input ref={campoRef} id={`filtro-${id}`} type="text" role="combobox" aria-autocomplete="list" aria-expanded={aberta} aria-controls={`opcoes-${id}`} disabled={desabilitado} value={aberta ? pesquisa : selecionada?.nome || ""} placeholder={placeholder} onFocus={() => { setAberta(true); setIndiceAtivo(0); }} onChange={evento => { setPesquisa(evento.target.value); setIndiceAtivo(0); setAberta(true); }} onKeyDown={teclado} className="min-w-0 flex-1 bg-transparent text-sm text-[#302838] outline-none placeholder:text-[#918899]" />
            {valor ? <button type="button" aria-label={`Limpar ${titulo.toLowerCase()}`} onClick={() => { onSelecionar(""); setPesquisa(""); campoRef.current?.focus(); }} className="rounded p-1 text-[#796D85] hover:bg-[#F2EEF8]"><X size={15} /></button> : <ChevronDown size={16} className="shrink-0 text-[#796D85]" aria-hidden="true" />}
        </div>
        {aberta && !desabilitado && <div id={`opcoes-${id}`} role="listbox" aria-label={titulo} className="absolute left-0 right-0 top-full z-[60] mt-2 max-h-56 overflow-y-auto rounded-xl border border-[#E7E0EE] bg-white p-1.5 shadow-xl">
            {filtradas.length ? filtradas.map((opcao, indice) => <button key={opcao.valor} type="button" role="option" aria-selected={String(valor) === String(opcao.valor)} onMouseDown={evento => evento.preventDefault()} onMouseEnter={() => setIndiceAtivo(indice)} onClick={() => escolher(opcao)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${indice === indiceAtivo ? "bg-[#F1EBFA] text-[#5D3B9D]" : "text-[#42384B] hover:bg-[#F7F3FB]"}`}><span>{opcao.nome}</span>{String(valor) === String(opcao.valor) && <Check size={15} aria-hidden="true" />}</button>) : <p className="px-3 py-4 text-center text-sm text-[#796D85]">Nenhum resultado encontrado.</p>}
        </div>}
    </div>;
}
