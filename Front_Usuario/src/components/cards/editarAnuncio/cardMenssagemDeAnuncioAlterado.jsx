
export default function CardMenssagemDeAnuncioAlterado() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[2px]">

            <div className="relative flex w-full max-w-[320px] flex-col items-center rounded-[12px] border border-[#E2E6EB] bg-white px-6 pb-[18px] pt-[30px] shadow-xl">

                {/* Botão fechar */}
                <button
                    type="button"
                    className="absolute right-[10px] top-[8px] flex h-5 w-5 items-center justify-center text-[#A8A8A8] transition hover:text-[#555]"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>

                {/* Ícone de sucesso */}
                <div className="mb-[18px] flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#E5F5E8]">

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="27"
                        height="27"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#399B50"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m5 12 4 4L19 6" />
                    </svg>

                </div>

                {/* Título */}
                <h2 className="mb-[15px] text-center text-[16px] font-bold leading-[19px] tracking-[-0.3px] text-[#20263A]">
                    Seu anúncio foi alterado
                    <br />
                    com sucesso!
                </h2>

                {/* Botão */}
                <button
                    type="button"
                    className="flex h-[34px] w-full items-center justify-center rounded-full bg-[#7548C8] text-[12px] font-semibold text-white transition hover:bg-[#6539B8] active:scale-[0.99]"
                >
                    Ir ao início
                </button>

            </div>

        </div>
    );
}
