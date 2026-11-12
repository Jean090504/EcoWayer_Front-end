// ---------------------------------------------------------------
// MOCK DA TELA DE CRIAR CONTA
// ---------------------------------------------------------------

import { USAR_MOCK, simular, chamarApi } from "./mockBase.js";


// ---------- DADOS DE MENTIRA ----------

// Use esse e-mail no cadastro pra ver o erro de "já cadastrado"
const EMAIL_JA_CADASTRADO = "teste@exemplo.com";


// ---------- FUNÇÕES DE MENTIRA ----------

// Backend de mentira: cria a conta e devolve o usuário.
// Só devolve o que a tela precisa (nunca a senha).
function criarContaMock(dados) {
    return simular(() => {
        if (dados.email === EMAIL_JA_CADASTRADO) {
            throw new Error("Este e-mail já está cadastrado.");
        }

        const { nome, email, telefone } = dados;

        return {
            ok: true,
            usuario: { nome, email, telefone, foto: null }
        };
    });
}


// ---------- O QUE O APP USA: MOCK OU BACKEND ----------

// Cadastro: cria a conta depois das verificações
export function criarConta(dados) {
    return USAR_MOCK
        ? criarContaMock(dados)
        : chamarApi("usuarios/cadastro", dados);
}