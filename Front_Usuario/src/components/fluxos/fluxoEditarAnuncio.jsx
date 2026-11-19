import { useEffect, useState } from "react"

import { CardEditarAnuncio } from "../cards/editarAnuncio"

import { atualizarAnuncio, buscarAnuncio } from "../../services/userService.js"
import { urlImagem } from "../../services/api.js"

export default function FluxoEditarAnuncio({ anuncioId, onNavegar, onSalvo }) {
    const [dados, setDados] = useState(null)
    const [erro, setErro] = useState("")
    const [tentativa, setTentativa] = useState(0)
    useEffect(() => {
        let ativo = true
        buscarAnuncio(anuncioId).then(anuncio => {
            if (!ativo) return
            setDados({
                titulo: anuncio.nome, descricao: anuncio.descricao,
                categoria: anuncio.id_categoria, condicao: anuncio.id_condicao_item,
                modalidade: String(anuncio.modalidade_nome || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(),
                preco: anuncio.preco, peso: anuncio.quantidade || anuncio.peso_kg,
                unidade: anuncio.unidade || "kg",
                fotosExistentes: anuncio.imagensOriginais.map(caminho => ({ id: caminho, caminho, url: urlImagem(caminho) }))
            })
        }).catch(error => { if (ativo) setErro(error.message) })
        return () => { ativo = false }
    }, [anuncioId, tentativa])
    async function salvar(formulario) {
        const usuario = JSON.parse(sessionStorage.getItem("ecowayer_usuario") || "null")
        if (!usuario?.id) throw new Error("Entre na conta para editar o anúncio.")
        await atualizarAnuncio(anuncioId, formulario, usuario.id)
        onSalvo()
    }
    if (erro) return <div role="alert" className="rounded-2xl bg-white p-6 text-red-700"><p>{erro}</p><button className="mt-3 underline" onClick={() => { setErro(""); setTentativa(t => t + 1) }}>Tentar novamente</button></div>
    if (!dados) return <p role="status" className="py-12 text-center text-gray-500">Carregando anúncio...</p>
    return <CardEditarAnuncio key={anuncioId} dadosIniciais={dados} onSalvar={salvar} onCancelar={() => onNavegar("perfil")} />
}