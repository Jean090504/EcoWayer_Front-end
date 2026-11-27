import { useState } from 'react'
import { CriarConta, VerificarNumero, VerificarEmail } from '../cards/conta'
import { criarUsuario, iniciarVerificacao, confirmarVerificacao, reenviarVerificacao } from '../../services/userService.js'

export default function FluxoCriarConta({ onClose, onContaCriada }) {
    const [etapa, setEtapa] = useState('dados')
    const [dados, setDados] = useState(null)
    const [desafioTelefone, setDesafioTelefone] = useState(null)
    const [desafioEmail, setDesafioEmail] = useState(null)

    async function iniciar(dadosCadastro) {
        const desafio = await iniciarVerificacao('telefone', dadosCadastro.telefone)
        setDados(dadosCadastro)
        setDesafioTelefone(desafio.desafio)
        setEtapa('telefone')
    }

    async function confirmarTelefone(codigo) {
        await confirmarVerificacao(desafioTelefone, codigo)
        const desafio = await iniciarVerificacao('email', dados.email)
        setDesafioEmail(desafio.desafio)
        setEtapa('email')
    }

    async function confirmarEmail(codigo) {
        await confirmarVerificacao(desafioEmail, codigo)
        await criarUsuario({ ...dados, desafio_telefone: desafioTelefone, desafio_email: desafioEmail })
        onContaCriada({ email: dados.email })
    }

    if (etapa === 'telefone') return <VerificarNumero telefone={dados.telefone} onVoltar={() => setEtapa('dados')}
        onVerificar={confirmarTelefone} onReenviar={() => reenviarVerificacao(desafioTelefone)} />
    if (etapa === 'email') return <VerificarEmail email={dados.email} onVoltar={() => setEtapa('telefone')}
        onAlterarEmail={() => setEtapa('dados')} onVerificar={confirmarEmail}
        onReenviar={() => reenviarVerificacao(desafioEmail)} />
    return <CriarConta onClose={onClose} onContinuarVerificacao={iniciar} />
}
