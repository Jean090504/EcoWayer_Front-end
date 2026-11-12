// ---------------------------------------------------------------
// MOCK DA TELA DE NOVO ANÚNCIO
// ---------------------------------------------------------------

import { USAR_MOCK, simular } from "./mockBase.js";


// <---------- AUXILIAR ---------->

// Pra não imprimir os arquivos inteiros no console, mostro só a quantidade de fotos
function resumo(dados) {
    const { fotos, ...resto } = dados;

    return { ...resto, qtdFotos: fotos.length };
}


// <---------- FUNÇÕES DE MENTIRA ---------->

// Finge que publicou o anúncio
export function enviarAnuncioMock(dados) {
    console.info("[MOCK] Anúncio publicado:", resumo(dados));

    return simular({ ok: true, id: Date.now() });
}

// Finge que salvou o rascunho
export function enviarRascunhoMock(dados) {
    console.info("[MOCK] Rascunho salvo:", resumo(dados));

    return simular({ ok: true, id: Date.now() });
}


// <---------- O QUE O APP USA: MOCK OU BACKEND ---------->

// Publicar o anúncio
export async function enviarAnuncio(dados) {
    if (USAR_MOCK) return enviarAnuncioMock(dados);

    // TODO: ainda não existe rota no backend pra isso.
    // As fotos são arquivos, então vai precisar de FormData (ou upload
    // das imagens antes) em vez do JSON do chamarApi.
    throw new Error("A publicação ainda não está conectada ao backend.");
}

// Salvar como rascunho
export async function enviarRascunho(dados) {
    if (USAR_MOCK) return enviarRascunhoMock(dados);

    // TODO: mesma coisa do enviarAnuncio
    throw new Error("O rascunho ainda não está conectado ao backend.");
}