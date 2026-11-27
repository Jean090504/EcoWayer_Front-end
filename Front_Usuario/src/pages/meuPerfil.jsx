import { useEffect, useState } from "react"
import { UserRound } from "lucide-react"
import AcessoConta from "../components/ui/AcessoConta"

import { DadosConta, Desempenho, AnunciosPublicados } from '../components/cards/perfil'

import { buscarAnuncios, buscarPerfil } from "../services/userService.js"

export default function Perfil({ onNavegar, onEditarAnuncio, onAbrirLogin, usuario }) {
    const [dados, setDados] = useState(null);
    const [erro, setErro] = useState("");
    const [abaAtiva, setAbaAtiva] = useState("anuncios");
    const [ordenacao, setOrdenacao] = useState("recentes");

    useEffect(() => {
        if (!usuario?.id) return;
        Promise.all([buscarPerfil(usuario.id), buscarAnuncios()])
            .then(([usuario, anuncios]) => {
                const meus = anuncios.filter(anuncio => Number(anuncio.id_usuario) === Number(usuario.id)).map(anuncio => ({
                    ...anuncio,
                    titulo: anuncio.nome,
                    categoria: anuncio.categoria || "EcoWayer",
                    modalidade: String(anuncio.modalidade_nome || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(),
                    imagem: anuncio.imagem || "",
                    views: Number(anuncio.views || 0),
                    preco: Number(anuncio.preco || 0)
                }));
                setDados({ usuario: { ...usuario, foto: usuario.imagem, localizacao: usuario.enderecos?.[0]?.cidade, membroDesde: usuario.data_cadastro, verificado: true }, desempenho: { saldoPontos: 0, pontosNoMes: 0, kgReciclados: 0, itensRegenerados: meus.length }, anuncios: meus });
            })
            .catch(error => setErro(error.message));
    }, [usuario?.id]);

    if (!usuario?.id) return <main className="flex min-h-[580px] flex-1 items-center justify-center bg-[#F8F7FE] px-5 py-12"><AcessoConta icone={UserRound} titulo="Seu espaço no EcoWayer" descricao="Entre na sua conta para ver seu perfil, acompanhar seus anúncios e conferir seu desempenho." onEntrar={onAbrirLogin} /></main>;
    if (erro) return <main className="flex min-h-[420px] flex-1 items-center justify-center bg-[#F8F7FE] px-5 py-12"><div role="alert" className="rounded-2xl bg-white p-8 text-center text-red-700">Não foi possível carregar seu perfil. <button type="button" className="font-semibold underline" onClick={() => window.location.reload()}>Tentar novamente</button></div></main>;
    if (!dados) return <p role="status" className="p-10 text-gray-500">Carregando perfil...</p>;

    const anuncios = [...dados.anuncios].sort((a, b) => ordenacao === "antigos" ? a.id - b.id : b.id - a.id);
    return <div className="flex flex-col gap-10 bg-[#F8F7FE] px-4 py-10 sm:px-[74px]">
        <DadosConta
            usuario={dados.usuario}
            onExtratoCarteira={() => onNavegar("minhaCarteira")}
            onNovoAnuncio={() => onNavegar("novoAnuncio")}
        />
        <Desempenho desempenho={dados.desempenho} />
        <AnunciosPublicados anuncios={anuncios} atualizadoEm="agora" abaAtiva={abaAtiva} abaComNotificacao="" ordenacao={ordenacao} onMudarAba={setAbaAtiva} onMudarOrdenacao={setOrdenacao} onEditarAnuncio={onEditarAnuncio} />
    </div>;
}
