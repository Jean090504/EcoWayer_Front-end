// ---------------------------------------------------------------
// MOCK DA TELA DE LOGIN
// ---------------------------------------------------------------

import { simular } from "./mockBase.js";


// ---------- DADOS DE MENTIRA ----------

// Usuário de teste (se eu quiser entrar logado direto, sem passar pelo cadastro)
export const usuarioMock = {
    nome: "Daniel Mendes",
    email: "daniel@exemplo.com",
    telefone: "(11) 99999-9999",
    foto: null // null = o header usa a foto padrão
};

// Senha que vale no login de mentira
export const SENHA_MOCK = "123456";


// ---------- FUNÇÕES DE MENTIRA ----------

// Login por e-mail e senha (ainda não está ligado na tela de login).
// Quando eu for ligar, o Login chama esta função no handleSubmit.
export function loginEmailSenhaMock(email, senha) {
    return simular(() => {
        if (senha !== SENHA_MOCK) {
            throw new Error("E-mail ou senha incorretos.");
        }

        return { ...usuarioMock, email };
    });
}