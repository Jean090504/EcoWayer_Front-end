// Dados de exemplo da tela Meu Perfil.
// Quando o back end estiver pronto, esse arquivo deixa de ser usado
// e a page passa a receber os mesmos formatos da API.

const mockPerfil = {

    usuario: {
        nome: "Daniel Mendes",
        foto: "",                       // Coloque o caminho da foto (ex: "/assets/daniel.jpg")
        localizacao: "Vila Mariana, São Paulo - SP",
        membroDesde: "Março de 2024",
        nota: 4.9,
        totalAvaliacoes: 42,
        verificado: true
    },

    desempenho: {
        saldoPontos: 3490,
        pontosNoMes: 180,
        kgReciclados: 1450,
        itensRegenerados: 38
    },

    atualizadoEm: "hoje às 14:22",
    abaComNotificacao: "avaliacoes",

    anuncios: [
        {
            id: 1,
            titulo: "Fardo de PET Limpo - 30kg",
            categoria: "Fardos & Reciclagem",
            imagem: "",                 // Coloque o caminho da imagem
            modalidade: "venda",
            status: "ativo",
            preco: 64,
            unidadePreco: "unidade",
            nota: 4.7,
            views: 128,
            distancia: "1.1 km",
            entrega: "Retirada local"
        },
        {
            id: 2,
            titulo: "Geladeira semi nova - cor bege",
            categoria: "Móveis Restaurados",
            imagem: "",
            modalidade: "venda",
            status: "ativo",
            preco: 170,
            unidadePreco: "",
            nota: 4.9,
            views: 312,
            distancia: "2.4 km",
            entrega: "Vila Mariana"
        },
        {
            id: 3,
            titulo: "Papelão Prensado - 50kg",
            categoria: "Papelão & Celulose",
            imagem: "",
            modalidade: "venda",
            status: "ativo",
            preco: 45,
            unidadePreco: "lote",
            nota: 4.8,
            views: 89,
            distancia: "4.0 km",
            entrega: "Envio Cooperativa"
        },
        {
            id: 4,
            titulo: "Garrafas de Vidro p/ Reuso",
            categoria: "Vidros & Garrafas",
            imagem: "",
            modalidade: "doacao",
            status: "ativo",
            preco: 0,
            unidadePreco: "",
            nota: 5.0,
            views: 245,
            distancia: "1.8 km",
            entrega: "Retirada Imediata"
        }
    ]
};

export { mockPerfil };
export default mockPerfil;
