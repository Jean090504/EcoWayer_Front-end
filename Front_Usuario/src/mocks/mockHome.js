
// ---------- CONFIGURAÇÕES ----------

// Endereço do backend (pode trocar no .env com VITE_API_URL)
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// Chave que liga o mock
export const USAR_MOCK = import.meta.env.VITE_USAR_MOCK === "true";


// ---------- FERRAMENTAS ----------

// Espera um tempinho (pra parecer que está falando com um servidor)
export const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


export async function simular(resposta, { atraso = 800, erro = null } = {}) {
    await esperar(atraso);

    if (erro) {
        throw new Error(erro);
    }

    return typeof resposta === "function" ? resposta() : resposta;
}


// ---------- DADOS DE MENTIRA ----------

// Código que vale tanto pro SMS quanto pro e-mail
export const CODIGO_MOCK = "123456";

// Usuário de teste (se eu quiser entrar logado direto, sem passar pelo cadastro)
export const usuarioMock = {
    nome: "Daniel Mendes",
    email: "daniel@exemplo.com",
    telefone: "(11) 99999-9999",
    foto: null // null = o header usa a foto padrão
};

// Anúncios de teste.
// Obs.: as imagens eu importo direto no componente, por isso não coloco aqui.
export const anunciosMock = [
    {
        id: 1,
        nome: "Mesa semi nova",
        preco: "R$ 170,00",
        avaliacao: "4.9",
        distancia: "2.4 km"
    },
    {
        id: 2,
        nome: "Fardo de PET limpo - garrafas",
        preco: "R$ 64,00",
        avaliacao: "4.7",
        distancia: "1.1 km"
    }
];


// ---------- FUNÇÕES DE MENTIRA: VERIFICAÇÃO ----------

// Mensagem quando o código está errado
const ERRO_CODIGO = "Código incorreto. Você tem mais 4 tentativas.";

// Finge que mandou o SMS
export function enviarCodigoSmsMock(telefone) {
    console.info(`[MOCK] SMS "enviado" para ${telefone}. Código: ${CODIGO_MOCK}`);

    return simular({ ok: true });
}

// Confere o código do SMS
export function conferirCodigoSmsMock(telefone, codigo) {
    return simular(() => {
        if (codigo !== CODIGO_MOCK) {
            throw new Error(ERRO_CODIGO);
        }

        return { ok: true };
    });
}

// Finge que mandou o e-mail
export function enviarCodigoEmailMock(email) {
    console.info(`[MOCK] E-mail "enviado" para ${email}. Código: ${CODIGO_MOCK}`);

    return simular({ ok: true });
}

// Confere o código do e-mail
export function conferirCodigoEmailMock(email, codigo) {
    return simular(() => {
        if (codigo !== CODIGO_MOCK) {
            throw new Error(ERRO_CODIGO);
        }

        return { ok: true };
    });
}


// ---------- API: USA O MOCK OU O BACKEND ----------

// Chama o backend e traduz os erros pra mensagem que aparece pro usuário.
// "caminho" é a rota completa depois de /api, ex.: "verificacao/enviar"
async function chamarApi(caminho, corpo) {
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

// Estas quatro são as que o App usa.
// Se o mock estiver ligado, usa as de mentira; senão, chama o backend.

// Telefone (SMS): pede pra enviar o código
export function enviarCodigo(telefone) {
    return USAR_MOCK
        ? enviarCodigoSmsMock(telefone)
        : chamarApi("verificacao/enviar", { telefone });
}

// Telefone (SMS): confere o código digitado
export function conferirCodigo(telefone, codigo) {
    return USAR_MOCK
        ? conferirCodigoSmsMock(telefone, codigo)
        : chamarApi("verificacao/verificar", { telefone, codigo });
}

// E-mail: pede pra enviar o código
export function enviarCodigoEmail(email) {
    return USAR_MOCK
        ? enviarCodigoEmailMock(email)
        : chamarApi("verificacao/email/enviar", { email });
}

// E-mail: confere o código digitado
export function conferirCodigoEmail(email, codigo) {
    return USAR_MOCK
        ? conferirCodigoEmailMock(email, codigo)
        : chamarApi("verificacao/email/verificar", { email, codigo });
}


