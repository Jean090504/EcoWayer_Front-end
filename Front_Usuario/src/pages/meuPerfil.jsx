import { useEffect, useState } from "react";
import DadosConta from "../components/cards/perfil/cardDadosPersona";
import Desempenho from "../components/cards/perfil/cardDesempenho";
import AnunciosPublicados from "../components/cards/perfil/cardCatalogoDeAnuncios";
import { buscarAnuncios, buscarPerfil } from "../services/userService.js";

export default function Perfil({ onNavegar }) {
    const sessao = JSON.parse(sessionStorage.getItem("ecowayer_usuario") || "null");
    const [dados, setDados] = useState(null);
    const [erro, setErro] = useState("");
    const [abaAtiva, setAbaAtiva] = useState("anuncios");
    const [ordenacao, setOrdenacao] = useState("recentes");

    useEffect(() => {
        if (!sessao?.id) { setErro("Faça login para acessar seu perfil."); return; }
        Promise.all([buscarPerfil(sessao.id), buscarAnuncios()])
            .then(([usuario, anuncios]) => {
                const meus = anuncios.filter(anuncio => Number(anuncio.id_usuario) === Number(sessao.id)).map(anuncio => ({
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
    }, [sessao?.id]);

    if (erro) return <p role="alert" className="p-10 text-red-600">{erro}</p>;
    if (!dados) return <p role="status" className="p-10 text-gray-500">Carregando perfil...</p>;

    const anuncios = [...dados.anuncios].sort((a, b) => ordenacao === "antigos" ? a.id - b.id : b.id - a.id);
    return <div className="flex flex-col gap-10 bg-[#F8F7FE] px-4 py-10 sm:px-[74px]">
        <DadosConta
            usuario={dados.usuario}
            onExtratoCarteira={() => onNavegar("minhaCarteira")}
            onNovoAnuncio={() => onNavegar("novoAnuncio")}
        />
        <Desempenho desempenho={dados.desempenho} />
        <AnunciosPublicados anuncios={anuncios} atualizadoEm="agora" abaAtiva={abaAtiva} abaComNotificacao="" ordenacao={ordenacao} onMudarAba={setAbaAtiva} onMudarOrdenacao={setOrdenacao} />
    </div>;
}
