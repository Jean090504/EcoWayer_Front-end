import { useEffect, useRef, useState } from "react";
import { uploadFoto, validarFoto } from "../services/cloudinaryService.js";
import { AlertTriangle, ExternalLink, FileText, Save, UserRound, X } from "lucide-react";
import { buscarPerfil, atualizarPerfil, desativarConta, buscarCep } from "../services/userService.js";
import { urlImagem } from "../services/api.js";

const UFS = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");
const estados = { AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia", CE: "Ceará", DF: "Distrito Federal", ES: "Espírito Santo", GO: "Goiás", MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul", MG: "Minas Gerais", PA: "Pará", PB: "Paraíba", PR: "Paraná", PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro", RN: "Rio Grande do Norte", RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima", SC: "Santa Catarina", SP: "São Paulo", SE: "Sergipe", TO: "Tocantins" };
function formulario(dados) {
    return { email: dados.email || "", confirmar_email: dados.email || "", telefone: dados.telefone || "", endereco: { ...(dados.enderecos?.[0] || {}) }, senha_atual: "", senha: "", confirmar_senha: "" };
}
const campo = "mt-1 w-full rounded-lg border border-transparent bg-[#F8F7FD] px-4 py-3 text-sm text-[#444] outline-none focus:border-[#724BC2] disabled:text-gray-500";
function Campo({ titulo, ...props }) {
    return <label className="block text-sm font-semibold text-[#303640]">{titulo}<input className={campo} {...props} /></label>;
}

export default function ConfiguracoesPerfil({ usuario, onAtualizarUsuario, onNavegar, onContaDesativada, tema = "claro", onAlterarTema }) {
    const [perfil, setPerfil] = useState(null);
    const [form, setForm] = useState(null);
    const arquivoRef = useRef(null);
    const salvandoRef = useRef(false);
    const [arquivoFoto, setArquivoFoto] = useState(null);
    const [previaFoto, setPreviaFoto] = useState("");
    const [fotoEnviada, setFotoEnviada] = useState("");
    const [enviandoFoto, setEnviandoFoto] = useState(false);
    useEffect(() => () => { if (previaFoto) URL.revokeObjectURL(previaFoto); }, [previaFoto]);
    function selecionarFoto(event) {
        const arquivo = event.target.files?.[0];
        event.target.value = "";
        if (!arquivo) return;
        try {
            validarFoto(arquivo);
            setArquivoFoto(arquivo); setPreviaFoto(URL.createObjectURL(arquivo)); setFotoEnviada(""); setFotoErro(false); setErro(""); setMensagem("");
        } catch (error) { setErro(error.message); }
    }
    const [nome, setNome] = useState("");
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [salvando, setSalvando] = useState(false);
    const [fotoErro, setFotoErro] = useState(false);
    const [buscandoCep, setBuscandoCep] = useState(false);
    const [erroCep, setErroCep] = useState("");
    const [confirmarDesativacao, setConfirmarDesativacao] = useState(false);
    const [desativando, setDesativando] = useState(false);
    useEffect(() => {
        let ativo = true;
        if (!usuario?.id) return;
        buscarPerfil(usuario.id).then(dados => {
            if (ativo) { setPerfil(dados); setNome(dados.nome || ""); setForm(formulario(dados)); }
        }).catch(error => { if (ativo) setErro(error.message); });
        return () => { ativo = false; };
    }, [usuario?.id]);

    async function salvar(event) {
        event.preventDefault();
        if (salvandoRef.current) return;
        salvandoRef.current = true;
        setErro(""); setMensagem(""); setSalvando(true);
        try {
            let fotoUrl = fotoEnviada;
            if (arquivoFoto && !fotoUrl) {
                setEnviandoFoto(true);
                try { fotoUrl = await uploadFoto(arquivoFoto); }
                finally { setEnviandoFoto(false); }
                setFotoEnviada(fotoUrl);
            }
            const atualizado = await atualizarPerfil(usuario.id, { ...form, nome: nome.trim(), foto_url: fotoUrl || undefined });
            const sessao = { ...usuario, nome: atualizado.nome || nome.trim(), email: atualizado.email, foto: atualizado.imagem };
            sessionStorage.setItem("ecowayer_usuario", JSON.stringify(sessao));
            onAtualizarUsuario(sessao);
            setPerfil(atualizado); setNome(atualizado.nome || nome.trim()); setForm(formulario(atualizado)); setFotoErro(false);
            setArquivoFoto(null); setPreviaFoto(""); setFotoEnviada("");
            setMensagem("Alterações salvas com sucesso.");
        } catch (error) { setErro(error.message); }
        finally { setSalvando(false); salvandoRef.current = false; }
    }
    async function confirmarDesativarConta() {
        if (desativando) return;
        setDesativando(true); setErro("");
        try {
            await desativarConta(usuario.id);
            onContaDesativada?.();
        } catch (error) { setErro(error.message); setDesativando(false); }
    }
    const endereco = form?.endereco || {};
    const alterar = chave => e => setForm(atual => ({ ...atual, [chave]: e.target.value }));
    const alterarEndereco = chave => e => {
        const valor = e.target.value;
        setForm(atual => ({ ...atual, endereco: { ...atual.endereco, [chave]: valor, ...(chave === "sigla" ? { estado: estados[valor] || "" } : {}) } }));
    };
    async function preencherEnderecoPorCep() {
        setErroCep(""); setBuscandoCep(true);
        try {
            const dadosEndereco = await buscarCep(endereco.cep);
            setForm(atual => ({ ...atual, endereco: { ...atual.endereco, ...dadosEndereco } }));
        } catch (error) { setErroCep(error.message); }
        finally { setBuscandoCep(false); }
    }
    const foto = previaFoto || urlImagem(perfil?.imagem || usuario?.foto);
    if (!usuario?.id) return <p className="p-10">Faça login para editar seu perfil.</p>;
    if (!perfil) return <p role={erro ? "alert" : "status"} className="p-10">{erro || "Carregando seus dados..."}</p>;
    return <div data-tema={tema} className="configuracoes-perfil min-h-screen bg-[#F8F7FE] px-4 py-8 sm:px-8 lg:py-12">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-8">
            <form onSubmit={salvar} className="rounded-2xl bg-white p-5 sm:p-7">
                <h1 className="mb-3 text-xl font-bold text-[#252B35]">Dados Pessoais</h1>
                <div className="relative mb-14 h-44 rounded-xl bg-linear-to-r from-[#12823F] via-[#008536] to-[#8447E8] sm:h-48">
                    <button type="button" disabled={salvando} onClick={() => arquivoRef.current?.click()} className="absolute right-3 top-3 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-[#724BC2]">Alterar foto</button>
                    <div className="absolute -bottom-9 left-3 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#EEE8FA] text-[#724BC2]">
                        {foto && !fotoErro ? <img src={foto} onError={() => setFotoErro(true)} alt={`Foto de ${perfil.nome}`} className="h-full w-full object-cover" /> : <UserRound size={48} aria-hidden="true" />}
                    </div>
                </div>
                <input ref={arquivoRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={selecionarFoto} aria-label="Selecionar foto de perfil" className="hidden" disabled={salvando} />
                {arquivoFoto && <p role="status" className="mb-5 text-sm text-[#724BC2]">{arquivoFoto.name} <button type="button" disabled={salvando} onClick={() => { setArquivoFoto(null); setPreviaFoto(""); setFotoEnviada(""); setFotoErro(false); }} className="underline">Cancelar foto</button></p>}
                <p className="mb-5 text-xs text-gray-500">Foto em JPG, PNG ou WebP, até 5 MB.</p>
                <div className="grid gap-7 md:grid-cols-2 md:gap-10">
                    <div className="space-y-5">
                        <Campo titulo="Nome Completo" name="nome" autoComplete="name" value={nome} onChange={e => setNome(e.target.value)} minLength={2} maxLength={255} required />
                        <fieldset><legend className="mb-2 text-sm font-semibold text-[#303640]">Localização</legend>
                            <div className="grid grid-cols-[100px_1fr] gap-3"><label className="text-sm">UF<select className={campo} value={endereco.sigla || ""} onChange={alterarEndereco("sigla")}><option value="">UF</option>{UFS.map(uf => <option key={uf}>{uf}</option>)}</select></label><Campo titulo="Cidade" maxLength={100} value={endereco.cidade || ""} onChange={alterarEndereco("cidade")} /></div>
                            <div className="mt-3 grid grid-cols-2 gap-3"><label className="block text-sm font-semibold text-[#303640]">CEP<div className="mt-1 flex gap-2"><input className={campo} autoComplete="postal-code" inputMode="numeric" maxLength={9} value={endereco.cep || ""} onChange={alterarEndereco("cep")} /><button type="button" onClick={preencherEnderecoPorCep} disabled={buscandoCep || String(endereco.cep || "").replace(/\D/g, "").length !== 8} className="shrink-0 rounded-lg bg-[#724BC2] px-3 text-xs font-semibold text-white disabled:opacity-50">{buscandoCep ? "Buscando..." : "Buscar CEP"}</button></div></label><Campo titulo="Bairro" maxLength={100} value={endereco.bairro || ""} onChange={alterarEndereco("bairro")} /></div>
                            {erroCep && <p role="alert" className="mt-2 text-xs text-red-600">{erroCep}</p>}
                            <div className="mt-3 grid grid-cols-[1fr_100px] gap-3"><Campo titulo="Rua" autoComplete="address-line1" maxLength={100} value={endereco.rua || ""} onChange={alterarEndereco("rua")} /><Campo titulo="Número" maxLength={10} value={endereco.numero || ""} onChange={alterarEndereco("numero")} /></div>
                            <div className="mt-3"><Campo titulo="Complemento" autoComplete="address-line2" maxLength={50} value={endereco.complemento || ""} onChange={alterarEndereco("complemento")} /></div>
                        </fieldset>
                        <Campo titulo="Telefone" type="tel" autoComplete="tel" value={form.telefone} onChange={alterar("telefone")} required />
                    </div>
                    <div className="space-y-5">
                        <Campo titulo="E-mail" type="email" value={form.email} onChange={alterar("email")} required />
                        <Campo titulo="Confirmar E-mail" type="email" value={form.confirmar_email} onChange={alterar("confirmar_email")} required />
                        <Campo titulo="Senha atual" type="password" autoComplete="current-password" value={form.senha_atual} onChange={alterar("senha_atual")} placeholder="Obrigatória ao alterar e-mail ou senha" />
                        <Campo titulo="Nova senha" type="password" autoComplete="new-password" minLength={8} maxLength={50} value={form.senha} onChange={alterar("senha")} placeholder="Deixe vazio para manter a senha" />
                        <Campo titulo="Confirmar nova senha" type="password" autoComplete="new-password" value={form.confirmar_senha} onChange={alterar("confirmar_senha")} />
                    </div>
                </div>
                <p className="mt-6 text-xs leading-relaxed text-gray-500">Para cadastrar ou alterar o endereço, preencha CEP, UF, cidade, bairro, rua e número. A nova senha deve ter de 8 a 50 caracteres, com letras maiúsculas, minúsculas e números.</p>
                {erro && <p role="alert" className="mt-4 text-sm text-red-600">{erro}</p>}
                {mensagem && <p role="status" className="mt-4 text-sm text-[#724BC2]">{mensagem}</p>}
                <div className="mt-8 flex flex-wrap justify-end gap-4">
                    <button type="button" disabled={salvando} onClick={() => { setNome(perfil.nome); setErro(""); setMensagem(""); onNavegar("perfil"); }} className="rounded-lg px-3 py-2 text-sm text-gray-600">Descartar</button>
                    <button disabled={salvando || nome.trim().length < 2} className="flex items-center gap-2 rounded-lg bg-[#724BC2] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"><Save size={16} />{enviandoFoto ? "Enviando foto..." : salvando ? "Salvando..." : "Salvar Alterações"}</button>
                </div>
            </form>
            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                <section className="rounded-2xl bg-white p-6"><h2 className="mb-6 text-base font-bold text-[#303640]">Tema do Site</h2><fieldset className="space-y-4"><legend className="sr-only">Selecione o tema</legend>{[["claro", "Tema Claro"], ["escuro", "Tema Escuro"]].map(([valor, label]) => <label key={valor} className="flex cursor-pointer items-center justify-between rounded-xl bg-[#F8F7FD] px-4 py-3 text-sm text-[#724BC2]">{label}<input type="radio" name="tema" value={valor} checked={tema === valor} onChange={() => onAlterarTema(valor)} className="h-5 w-5 accent-[#724BC2]" /></label>)}</fieldset><p className="mt-4 text-xs text-gray-500">Sua preferência é aplicada ao site e salva neste navegador.</p></section>
                <div className="flex flex-col gap-5">
                    <details className="group rounded-2xl border border-[#EAE4F4] bg-white p-5 shadow-sm">
                        <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl bg-[#F8F7FD] p-4 text-sm font-semibold text-[#724BC2] marker:hidden focus-visible:outline-2 focus-visible:outline-[#724BC2]">
                            <FileText size={19} aria-hidden="true" />
                            <span className="flex-1">Termos e condições de uso da plataforma</span>
                            <span className="text-xs text-[#796D91] group-open:hidden">Ver resumo</span>
                            <span className="hidden text-xs text-[#796D91] group-open:inline">Ocultar</span>
                        </summary>
                        <div className="space-y-4 px-1 pb-1 pt-5 text-sm leading-relaxed text-[#4E4A56]">
                            <p>O EcoWayer conecta pessoas interessadas em reutilização e reciclagem. Para participar, mantenha seus dados verdadeiros e use a plataforma com responsabilidade.</p>
                            <ul className="list-disc space-y-2 pl-5">
                                <li>Você é responsável pelos anúncios, imagens, mensagens e negociações que publicar.</li>
                                <li>Proteja suas credenciais e comunique qualquer uso indevido da sua conta.</li>
                                <li>Conteúdos que violem os termos podem ser removidos, e contas podem ser bloqueadas em casos de abuso, fraude ou risco à comunidade.</li>
                            </ul>
                            <p className="text-xs text-[#796D91]">Resumo dos Termos de Serviço, atualizados em 16 de novembro de 2026. Consulte o documento completo para ler todas as condições.</p>
                            <div className="flex flex-wrap gap-3 border-t border-[#EEE9F5] pt-4">
                                <a href="/termos.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#724BC2] px-4 py-2.5 font-semibold text-white transition hover:bg-[#5D3B9D]">Ler termos completos <ExternalLink size={15} aria-hidden="true" /></a>
                                <a href="/privacidade.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[#DCD2EE] px-4 py-2.5 font-semibold text-[#724BC2] transition hover:bg-[#F8F7FD]">Política de privacidade <ExternalLink size={15} aria-hidden="true" /></a>
                            </div>
                        </div>
                    </details>
                    <section className="rounded-2xl bg-white p-5"><div className="flex flex-col gap-5 rounded-xl bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="flex items-center gap-2 text-sm font-bold text-red-500"><AlertTriangle size={18} />Desativar conta</h2><p className="mt-2 max-w-md text-xs leading-relaxed text-red-400">Sua conta sera desativada. Para reativa-la, entre em contato com o suporte.</p></div><button type="button" onClick={() => setConfirmarDesativacao(true)} className="shrink-0 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white">Desativar Conta</button></div></section>
                </div>
            </div>
        </div>
        {confirmarDesativacao && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><section role="dialog" aria-modal="true" aria-labelledby="titulo-desativar-conta" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-start justify-between gap-4"><div><h2 id="titulo-desativar-conta" className="text-lg font-bold text-gray-900">Desativar sua conta?</h2><p className="mt-3 text-sm leading-relaxed text-gray-600">Você será desconectado e não poderá entrar enquanto a conta estiver desativada. Para reativá-la, entre em contato com o suporte.</p></div><button type="button" aria-label="Fechar" disabled={desativando} onClick={() => setConfirmarDesativacao(false)} className="rounded-full p-1 text-gray-500"><X size={20} /></button></div><div className="mt-6 flex justify-end gap-3"><button type="button" disabled={desativando} onClick={() => setConfirmarDesativacao(false)} className="rounded-lg px-4 py-2 text-sm text-gray-600">Cancelar</button><button type="button" disabled={desativando} onClick={confirmarDesativarConta} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{desativando ? "Desativando..." : "Confirmar desativação"}</button></div></section></div>}
    </div>;
}
