import { simular } from './mockBase.js';
import Papelao from '../assets/icons/img/papelao.png';
import Garrafas from '../assets/icons/img/garrafas.png';
import Mesa from '../assets/icons/img/mesa.png';
import Foto from '../assets/icons/icones/foto.png';

// Contrato da tela: substituir a consulta abaixo pela API na integração.
export const anuncioDetalhesMock = {
 id: 'papelao-50kg', nome: 'Papelão para Mudança e Prensado', imagem: Papelao,
 preco: 'R$ 75,00', unidade: '/ lote total (50 kg)', categoria: 'Recicláveis', subcategoria: 'Papel e celulose', publicado: 'Publicado há 2 horas',
 troca: 'Aceita troca parcial por garrafas PET limpas ou EcoCréditos.',
 peso: '50 kg', quantidade: '12 fardos prensados', estado: 'Excelente', conservacao: 'Sem contaminações',
 descricao: 'Fardos de papelão prensado limpo, ideal para embalagem industrial ou reciclagem de grande escala. Armazenado em local 100% seco e coberto, livre de óleos, fitas adesivas pesadas ou solventes.\nPerfeito tanto para quem está realizando mudanças comerciais de grande porte quanto para cooperativas de reciclagem, fábricas de papel artesanal ou logística reversa corporativa. Facilidade para carregamento imediato em doca térrea.',
 vendedor: { nome: 'Fernando Resende', foto: Foto, verificado: true, avaliacao: '4,9', avaliacoes: 128, tempoResposta: '< 1 hora', entregas: '100%' },
 outrosAnuncios: [
 { id:'pet', nome:'Fardo de PET limpo - 20 kg', preco:'R$ 64,00', imagem:Garrafas, avaliacao:'4,7', distancia:'1,1 km' },
 { id:'madeira', nome:'Mesa de Madeira', preco:'R$ 35,00', imagem:Mesa, avaliacao:'4,9', distancia:'1,2 km' },
 { id:'garrafas', nome:'Lote de Garrafas para Reciclagem', preco:'R$ 40,00', imagem:Garrafas, avaliacao:'4,8', distancia:'1,2 km' },
 { id:'papelao', nome:'Fardos de Papelão Limpo', preco:'R$ 28,00', imagem:Papelao, avaliacao:'4,6', distancia:'1,2 km' }
 ]
};
export function buscarDetalhesAnuncio(selecionado) {
 if (!selecionado) return simular(anuncioDetalhesMock, { atraso:300 });
 const dados = { ...anuncioDetalhesMock, ...selecionado };
 if (!selecionado.nome.toLowerCase().includes('papelão')) Object.assign(dados, {
 categoria:'Mercado circular', subcategoria:'Materiais e produtos', unidade:'', peso:'A consultar', quantidade:'Quantidade a combinar', estado:'A consultar', conservacao:'Confirme com o anunciante', troca:'Condições de troca e retirada a combinar com o anunciante.', descricao:selecionado.nome + '. Entre em contato com o anunciante para consultar disponibilidade, conservação e condições de retirada.'
 });
 return simular(dados, { atraso:300 });
}
