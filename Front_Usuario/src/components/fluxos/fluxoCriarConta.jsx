import { CriarConta } from "../cards/conta"
import { criarUsuario } from "../../services/userService.js"

export default function FluxoCriarConta({ onClose, onContaCriada }) {
    async function cadastrar(dados) {
        await criarUsuario(dados);
        onContaCriada({ email: dados.email });
    }

    return <CriarConta onClose={onClose} onContinuarVerificacao={cadastrar} />;
}