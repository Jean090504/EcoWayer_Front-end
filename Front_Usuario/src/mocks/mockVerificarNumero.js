// ---------------------------------------------------------------
// MOCK DA TELA DE VERIFICAÇÃO DO NÚMERO (SMS)
//
// O mock faz o papel do backend: envia e confere o código do SMS.
// No final ficam as funções que o App usa: com o mock ligado (.env)
// respondem daqui; senão chamam a API.
// Na integração, só mudam as rotas e o formato dos JSONs.
// ---------------------------------------------------------------

import { USAR_MOCK, simular, chamarApi } from "./mockBase.js";


// ---------- DADOS DE MENTIRA ----------

// Código que vale pro SMS
export const CODIGO_MOCK = "123456";

// Quantas vezes dá pra errar o código antes de precisar pedir outro
const MAX_TENTATIVAS = 5;

// Tentativas erradas do código atual
let tentativas = 0;


// ---------- FUNÇÕES DE MENTIRA ----------

// Finge que mandou o SMS e zera as tentativas
function enviarCodigoMock(telefone) {
    tentativas = 0;

    console.info(`[MOCK] SMS "enviado" para ${telefone}. Código: ${CODIGO_MOCK}`);

    return simular({ ok: true });
}

// Confere o código do SMS e controla as tentativas
function conferirCodigoMock(codigo) {
    return simular(() => {
        if (tentativas >= MAX_TENTATIVAS) {
            throw new Error("Muitas tentativas. Peça um novo código.");
        }

        if (codigo !== CODIGO_MOCK) {
            tentativas += 1;

            const restantes = MAX_TENTATIVAS - tentativas;

            throw new Error(
                restantes > 0
                    ? `Código incorreto. Você tem mais ${restantes} tentativas.`
                    : "Muitas tentativas. Peça um novo código."
            );
        }

        tentativas = 0;

        return { ok: true };
    });
}


// ---------- O QUE O APP USA: MOCK OU BACKEND ----------

// Telefone (SMS): pede pra enviar o código
export function enviarCodigo(telefone) {
    return USAR_MOCK
        ? enviarCodigoMock(telefone)
        : chamarApi("verificacao/enviar", { telefone });
}

// Telefone (SMS): confere o código digitado
export function conferirCodigo(telefone, codigo) {
    return USAR_MOCK
        ? conferirCodigoMock(codigo)
        : chamarApi("verificacao/verificar", { telefone, codigo });
}