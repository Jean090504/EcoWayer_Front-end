import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { apiFetch } from "../services/api.js";

const inputClass = "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#7548C8] focus:ring-2 focus:ring-[#7548C8]/20";

export default function Login({ onClose, onAbrirCriarConta, onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function concluirLogin(retorno, fallback = {}) {
        sessionStorage.setItem("ecowayer_token", retorno.token);
        const perfil = await apiFetch("/users/me");
        onLoginSuccess(perfil.usuario || fallback);
    }

    async function entrar(corpo) {
        setCarregando(true);
        setErro("");
        try {
            const retorno = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify(corpo) });
            await concluirLogin(retorno, { ...retorno.usuario, email });
        } catch (error) { sessionStorage.removeItem("ecowayer_token"); setErro(error.message || "Não foi possível entrar."); }
        finally { setCarregando(false); }
    }

    async function google(corpo) {
        setCarregando(true);
        setErro("");
        try {
            const retorno = await apiFetch("/auth/google", { method: "POST", body: JSON.stringify(corpo) });
            if (!retorno.token) throw new Error("A conta precisa concluir o cadastro antes de entrar.");
            await concluirLogin(retorno, retorno.usuario || {});
        } catch (error) { sessionStorage.removeItem("ecowayer_token"); setErro(error.message || "Não foi possível entrar com o Google."); }
        finally { setCarregando(false); }
    }

    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
        <div className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
            <button type="button" onClick={onClose} className="absolute right-5 top-4 text-xl text-red-500" aria-label="Fechar">×</button>
            <h2 className="mb-6 text-3xl font-extrabold text-[#7548C8]">Login</h2>
            <form onSubmit={(event) => { event.preventDefault(); entrar({ login: email, senha }); }} className="space-y-4">
                <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" autoComplete="email" required />
                <input className={inputClass} type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha" autoComplete="current-password" required />
                {erro && <p role="alert" className="text-center text-sm text-red-600">{erro}</p>}
                <button disabled={carregando} className="h-11 w-full rounded-xl bg-[#7548C8] font-bold text-white disabled:opacity-60">{carregando ? "Entrando..." : "Entrar"}</button>
            </form>
            <div className="my-5 flex items-center gap-3 text-sm text-slate-400"><span className="h-px flex-1 bg-slate-200" />ou<span className="h-px flex-1 bg-slate-200" /></div>
            <div className="flex justify-center"><GoogleLogin onSuccess={(response) => google({ credential: response.credential })} onError={() => setErro("Falha no login com Google.")} /></div>
            <button type="button" onClick={onAbrirCriarConta} className="mt-6 w-full text-sm font-semibold text-[#399B43] hover:underline">Criar uma conta</button>
        </div>
    </div>;
}
