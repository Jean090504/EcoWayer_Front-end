// ---------------------------------------------------------------
// MOCK DA TELA DE VERIFICAÇÃO DO E-MAIL
//
// O mock faz o papel do backend: envia e confere o código do e-mail.
// No final ficam as funções que o App usa: com o mock ligado (.env)
// respondem daqui; senão chamam a API.
// Na integração, só mudam as rotas e o formato dos JSONs.
// ---------------------------------------------------------------

import { USAR_MOCK, simular, chamarApi } from "./mockBase.js";


// ---------- DADOS DE MENTIRA ----------

// Código que vale pro e-mail
export const CODIGO_MOCK = "123456";

// Quantas vezes dá pra errar o código antes de precisar pedir outro
const MAX_TENTATIVAS = 5;

// Tentativas erradas do código atual
let tentativas = 0;


// ---------- FUNÇÕES DE MENTIRA ----------

// Finge que mandou o e-mail e zera as tentativas
function enviarCodigoEmailMock(email) {
    tentativas = 0;

    console.info(`[MOCK] E-mail "enviado" para ${email}. Código: ${CODIGO_MOCK}`);

    return simular({ ok: true });
}

// Confere o código do e-mail e controla as tentativas
function conferirCodigoEmailMock(codigo) {
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

// E-mail: pede pra enviar o código
export function enviarCodigoEmail(email) {
    return USAR_MOCK
        ? enviarCodigoEmailMock(email)
        : chamarApi("verificacao/email/enviar", { email });
}

// E-mail: confere o código digitado
export function conferirCodigoEmail(email, codigo) {
    return USAR_MOCK
        ? conferirCodigoEmailMock(codigo)
        : chamarApi("verificacao/email/verificar", { email, codigo });
}