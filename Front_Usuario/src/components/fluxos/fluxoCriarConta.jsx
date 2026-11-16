import CriarConta from "../cards/conta/cardCriarConta.jsx";
import { criarUsuario } from "../../services/userService.js";

export default function FluxoCriarConta({ onClose, onContaCriada }) {
    async function cadastrar(dados) {
        const usuario = await criarUsuario(dados);
        onContaCriada(usuario);
    }

    return <CriarConta onClose={onClose} onContinuarVerificacao={cadastrar} />;
}
