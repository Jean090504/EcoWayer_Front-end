import { useEffect, useRef, useState } from "react";
import { Check, Trash2 } from "lucide-react";
import CardEditarAnuncio from "../cards/editarAnuncio/cardEditarAnuncio.jsx";
import { apagarAnuncio, atualizarAnuncio, buscarAnuncio } from "../../services/userService.js";
import { urlImagem } from "../../services/api.js";

export default function FluxoEditarAnuncio({ anuncioId, onNavegar, onSalvo }) {
    const [dados, setDados] = useState(null);
    const [erro, setErro] = useState("");
    const [tentativa, setTentativa] = useState(0);
    const dialogo = useRef(null);
    const [apagando, setApagando] = useState(false);
    const [apagado, setApagado] = useState(false);
    const [erroAoApagar, setErroAoApagar] = useState("");
    useEffect(() => {
        if (!apagado) return;
        const timer = setTimeout(() => onNavegar("perfil"), 1350);
        return () => clearTimeout(timer);
    }, [apagado, onNavegar]);

    useEffect(() => {
        let ativo = true;
        buscarAnuncio(anuncioId).then(anuncio => {
            if (!ativo) return;
            setDados({
                titulo: anuncio.nome, descricao: anuncio.descricao,
                categoria: anuncio.id_categoria, condicao: anuncio.id_condicao_item,
                modalidade: String(anuncio.modalidade_nome || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(),
                preco: anuncio.preco, peso: anuncio.quantidade || anuncio.peso_kg,
                unidade: anuncio.unidade || "kg",
                fotosExistentes: anuncio.imagensOriginais.map(caminho => ({ id: caminho, caminho, url: urlImagem(caminho) }))
            });
        }).catch(error => { if (ativo) setErro(error.message); });
        return () => { ativo = false; };
    }, [anuncioId, tentativa]);
    async function salvar(formulario) {
        const usuario = JSON.parse(sessionStorage.getItem("ecowayer_usuario") || "null");
        if (!usuario?.id) throw new Error("Entre na conta para editar o anúncio.");
        await atualizarAnuncio(anuncioId, formulario, usuario.id);
        onSalvo();
    }
    async function confirmarExclusao() {
        if (apagando) return;
        setErroAoApagar("");
        setApagando(true);
        try {
            await apagarAnuncio(anuncioId);
            setApagado(true);
        } catch (error) {
            setErroAoApagar(error.message || "Não foi possível apagar o anúncio.");
        } finally {
            setApagando(false);
        }
    }

    if (erro) return <div role="alert" className="rounded-2xl bg-white p-6 text-red-700"><p>{erro}</p><button className="mt-3 underline" onClick={() => { setErro(""); setTentativa(t => t + 1); }}>Tentar novamente</button></div>;
    if (!dados) return <p role="status" className="py-12 text-center text-gray-500">Carregando anúncio...</p>;
    return <>
        <CardEditarAnuncio key={anuncioId} dadosIniciais={dados} onSalvar={salvar} onCancelar={() => onNavegar("perfil")} onApagar={() => {
            setErroAoApagar("");
            dialogo.current.showModal();
        }} />
        <dialog
            ref={dialogo}
            aria-labelledby="titulo-exclusao-anuncio"
            onCancel={event => { if (apagando || apagado) event.preventDefault(); }}
            className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl bg-white p-6 shadow-xl backdrop:bg-black/45"
        >
            {apagado ? (
                <div role="status" className="py-5 text-center">
                    <span className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-green-100 text-green-700 motion-safe:animate-bounce">
                        <Check size={28} aria-hidden="true" />
                    </span>
                    <h2 id="titulo-exclusao-anuncio" className="text-xl font-bold">Anúncio apagado</h2>
                    <p className="mt-2 text-sm text-gray-600">Voltando aos seus anúncios…</p>
                </div>
            ) : (
                <>
                    <Trash2 size={24} className="mb-3 text-red-700" aria-hidden="true" />
                    <h2 id="titulo-exclusao-anuncio" className="text-xl font-bold">Apagar anúncio?</h2>
                    <p className="mt-2 text-sm text-gray-600">“{dados.titulo}” sairá do seu perfil e deixará de aparecer para outros usuários.</p>
                    {erroAoApagar && <p role="alert" className="mt-3 text-sm text-red-700">{erroAoApagar}</p>}
                    <div className="mt-6 flex flex-wrap justify-end gap-2">
                        <button type="button" autoFocus disabled={apagando} onClick={() => dialogo.current.close()} className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold hover:bg-gray-200 disabled:opacity-60">
                            Manter anúncio
                        </button>
                        <button type="button" disabled={apagando} onClick={confirmarExclusao} className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60">
                            {apagando ? "Apagando…" : "Apagar anúncio"}
                        </button>
                    </div>
                </>
            )}
        </dialog>
    </>;
}
