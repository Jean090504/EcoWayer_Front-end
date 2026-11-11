// ---------------------------------------------------------------
// MOCK BASE
//
// Aqui ficam as coisas que TODOS os mocks usam.
// Cada tela tem o seu próprio arquivo (mockHome.js, mockCriarConta.js...)
// e todos importam as ferramentas daqui.
//
// Liga e desliga pelo .env:
//   VITE_USAR_MOCK=true   -> usa os dados e funções de mentira
//   VITE_USAR_MOCK=false  -> usa o backend de verdade
// (depois de mexer no .env, preciso reiniciar o `npm run dev`)
// ---------------------------------------------------------------


// ---------- CONFIGURAÇÕES ----------

// Endereço do backend (pode trocar no .env com VITE_API_URL)
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5173/api";

// Chave que liga o mock
export const USAR_MOCK = import.meta.env.VITE_USAR_MOCK === "true";


// ---------- FERRAMENTAS ----------

// Espera um tempinho (pra parecer que está falando com um servidor)
export const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Simula uma chamada ao backend.
// - resposta: o que devolver (pode ser um valor ou uma função que devolve o valor)
// - atraso: quantos ms demora (padrão 800)
// - erro: se eu passar um texto, a chamada falha com essa mensagem
export async function simular(resposta, { atraso = 800, erro = null } = {}) {
    await esperar(atraso);

    if (erro) {
        throw new Error(erro);
    }

    return typeof resposta === "function" ? resposta() : resposta;
}

// Chama o backend de verdade e traduz os erros pra mensagem que aparece pro usuário.
// "caminho" é a rota completa depois de /api, ex.: "verificacao/enviar"
export async function chamarApi(caminho, corpo) {
    let resposta;

    try {
        resposta = await fetch(`${API_URL}/${caminho}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(corpo)
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor. Tente novamente.");
    }

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
        throw new Error(dados.erro || "Algo deu errado. Tente novamente.");
    }

    return dados;
}