// mocks/beneficiosMock.js
import { simular } from './mockBase'

// fábrica de um benefício — todos os campos com defaults
export const criarBeneficioMock = (override = {}) => ({
  id: 1,
  imagem: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80',
  selo: 'Parceiro Eco',
  aviso: 'Válido por 30 dias',
  categoria: 'Desconto local',
  pontos: 1000,
  titulo: 'Benefício de exemplo',
  descricao: 'Descrição de exemplo do benefício.',
  nota: 4.9,
  resgates: 0,
  ...override,
});

// fábrica da lista completa (o que hoje é a const `beneficios`)
export const criarListaBeneficiosMock = () => [
  criarBeneficioMock({
    id: 1,
    selo: 'Parceiro Eco',
    aviso: 'Válido por 30 dias',
    categoria: 'Desconto local',
    pontos: 1000,
    titulo: 'Desconto de R$ 20 em Cooperativas',
    descricao:
      'Válido para compras de produtos reciclados, compostos orgânicos e feiras de cooperativas filiadas da rede EcoWayer.',
    nota: 4.9,
    resgates: 342,
  }),
  criarBeneficioMock({
    id: 2,
    imagem: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80',
    selo: 'Mobilidade',
    aviso: 'Recarga Imediata',
    categoria: 'Transporte urbano',
    pontos: 2500,
    titulo: 'Vale Transporte / Bilhete Único',
    descricao:
      'Crédito de R$ 50 para recarga imediata de cartão de transporte público metropolitano ou passes de bicicleta.',
    nota: 5.0,
    resgates: 1120,
  }),
  criarBeneficioMock({
    id: 3,
    imagem: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
    selo: 'Impacto Puro',
    aviso: 'Com Certificado GPS',
    categoria: 'Reflorestamento',
    pontos: 500,
    titulo: 'Muda Nativa para Plantio',
    descricao:
      'Plante uma árvore nativa na bacia hidrográfica regional da Mata Atlântica e receba fotos com coordenadas georreferenciadas.',
    nota: 4.8,
    resgates: 890,
  }),
  criarBeneficioMock({
    id: 4,
    selo: 'Reciclagem Consciente',
    aviso: 'Com Relatório de Impacto',
    categoria: 'Reciclagem',
    pontos: 350,
    titulo: 'Kit de Compostagem Doméstica',
    descricao:
      'Receba um kit completo para transformar resíduos orgânicos em adubo em casa, incluindo manual ilustrado e acompanhamento mensal do volume desviado de aterros.',
    nota: 4.6,
    resgates: 1240,
  }),
];

// função pronta pra usar dentro do componente (simula chamada ao backend)
export function buscarBeneficiosMock() {
  return simular(criarListaBeneficiosMock);
}