
export default function Footer() {
    return (
        <footer className="flex items-center w-full bg-white text-gray-600">

            {/* Parte superior do footer */}
            <div className="max-w-[1280px] mx-auto px-6 pt-14 pb-8">

                {/* Colunas de informações */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Coluna 1: EcoWayer */}
                    <div>
                        <h2 className="text-xl font-bold text-green-700 mb-4">
                            Ecowayer
                        </h2>

                        <p className="text-sm leading-5">
                            Plataforma de economia circular orientada a
                            impacto positivo, compensação ecológica e
                            rastreabilidade urbana.
                        </p>
                    </div>

                    {/* Coluna 2: Ecossistema */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">
                            Ecossistema
                        </h3>

                        <ul className="flex flex-col gap-2 text-xs">
                            <li>
                                <a href="#" className="hover:text-green-700">
                                    Diretório de EcoPontos
                                </a>
                            </li>

                            <li>
                                <a href="#" className="hover:text-green-700">
                                    Calculadora de Carbono
                                </a>
                            </li>

                            <li>
                                <a href="#" className="hover:text-green-700">
                                    Calculadora de Pegada
                                </a>
                            </li>

                            <li>
                                <a href="#" className="hover:text-green-700">
                                    Clube de Recompensas
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Coluna 3: Transparência */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">
                            Transparência
                        </h3>

                        <ul className="flex flex-col gap-2 text-xs">
                            <li>
                                <a href="#" className="hover:text-green-700">
                                    Relatórios ESG
                                </a>
                            </li>

                            <li>
                                <a href="#" className="hover:text-green-700">
                                    Termos de Uso Circular
                                </a>
                            </li>

                            <li>
                                <a href="#" className="hover:text-green-700">
                                    Privacidade de Dados
                                </a>
                            </li>

                            <li>
                                <a href="#" className="hover:text-green-700">
                                    Auditoria de Resíduos
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Coluna 4: Suporte */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">
                            Suporte & Comunidade
                        </h3>

                        <ul className="flex flex-col gap-2 text-xs">
                            <li>
                                <a href="#" className="hover:text-green-700">
                                    Central de Ajuda
                                </a>
                            </li>

                            <li>
                                <a href="#" className="hover:text-green-700">
                                    Canal de Denúncias
                                </a>
                            </li>

                            <li>
                                <a href="#" className="hover:text-green-700">
                                    Parcerias Municipais
                                </a>
                            </li>

                            <li>
                                <a href="#" className="hover:text-green-700">
                                    Status do Sistema
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Linha divisória */}
                <div className="border-t border-gray-200 mt-8 pt-8">

                    {/* Parte inferior do footer */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-xs">

                        {/* Direitos autorais */}
                        <p className="text-center">
                            © 2026 Ecowayer Tecnologia Ambiental S.A.
                            Todos os direitos reservados.
                        </p>

                        {/* Links legais */}
                        <nav className="flex items-center gap-6  ">
                            <a href="#" className="hover:text-green-700">
                                Termos Gerais
                            </a>

                            <a href="#" className="hover:text-green-700">
                                Privacidade
                            </a>

                            <a href="#" className="hover:text-green-700">
                                Segurança
                            </a>
                        </nav>

                    </div>

                </div>

            </div>

        </footer>
    );
}
