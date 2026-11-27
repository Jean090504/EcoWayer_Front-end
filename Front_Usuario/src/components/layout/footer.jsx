export default function Footer({ onNavegar }) {
    return <footer className="w-full bg-white text-gray-600">
        <div className="mx-auto grid w-full max-w-[1680px] gap-8 px-[clamp(16px,5vw,78px)] pb-8 pt-14 text-sm md:grid-cols-4">
            <div><h2 className="mb-4 text-xl font-bold text-green-700">Ecowayer</h2>
                <p>Plataforma de economia circular e reciclagem urbana.</p></div>
            <nav aria-label="Ecossistema" className="flex flex-col items-start gap-2">
                <h3 className="mb-1 font-semibold text-gray-800">Ecossistema</h3>
                <button type="button" onClick={() => onNavegar?.('ecopontos')} className="hover:text-green-700">Diretório de EcoPontos</button>
                <button type="button" onClick={() => onNavegar?.('pontosBeneficios')} className="hover:text-green-700">Clube de Recompensas</button>
            </nav>
            <nav aria-label="Transparência" className="flex flex-col items-start gap-2">
                <h3 className="mb-1 font-semibold text-gray-800">Transparência</h3>
                <a href="/termos.html" className="hover:text-green-700">Termos de Uso Circular</a>
                <a href="/privacidade.html" className="hover:text-green-700">Privacidade de Dados</a>
            </nav>
            <nav aria-label="Conta e suporte" className="flex flex-col items-start gap-2">
                <h3 className="mb-1 font-semibold text-gray-800">Conta e suporte</h3>
                <button type="button" onClick={() => onNavegar?.('chat')} className="hover:text-green-700">Minhas conversas</button>
                <button type="button" onClick={() => onNavegar?.('notificacoes')} className="hover:text-green-700">Notificações</button>
            </nav>
        </div>
        <div className="mx-auto max-w-[1680px] border-t border-gray-200 px-[clamp(16px,5vw,78px)] py-8 text-center text-xs">
            © 2026 Ecowayer Tecnologia Ambiental S.A. Todos os direitos reservados.
        </div>
    </footer>
}
