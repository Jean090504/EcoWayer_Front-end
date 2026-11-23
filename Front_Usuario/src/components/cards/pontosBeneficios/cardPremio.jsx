import { useRef, useState } from "react";
import { Gift } from "lucide-react";
import { resgatarRecompensa } from "../../../services/userService";

export default function CardPremio({ catalogo, saldo, onResgatado }) {
    const dialogo = useRef(null);
    const emAndamento = useRef(false);
    const [pedido, setPedido] = useState(null);
    const [ocupado, setOcupado] = useState(false);
    const [erro, setErro] = useState("");
    const [voucher, setVoucher] = useState(null);

    function selecionar(item) {
        setPedido({ item, solicitacao: crypto.randomUUID() });
        setVoucher(null);
        setErro("");
        dialogo.current.showModal();
    }

    async function confirmar() {
        if (!pedido || emAndamento.current) return;
        emAndamento.current = true;
        setOcupado(true);
        setErro("");
        try {
            const resultado = await resgatarRecompensa(pedido.item.id, pedido.solicitacao, pedido.item.pontos_necessarios);
            setVoucher(resultado.voucher);
            onResgatado(resultado);
        } catch (error) {
            setErro(error.message || "Não foi possível resgatar o benefício.");
        } finally {
            emAndamento.current = false;
            setOcupado(false);
        }
    }

    return <section>
        <h2 className="text-2xl font-bold text-[#191C1E]">Benefícios e recompensas</h2>
        {catalogo.length === 0 ? (
            <p className="mt-5 rounded-3xl bg-white p-8 text-sm">Nenhum benefício disponível para resgate.</p>
        ) : (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {catalogo.map(item => {
                    const suficiente = saldo !== null && saldo >= Number(item.pontos_necessarios);
                    return <article key={item.id} className="flex flex-col gap-3 rounded-3xl bg-white p-6">
                        <p className="text-sm text-gray-600">{item.nome_parceiro}</p>
                        <h3 className="font-semibold">{item.beneficio}</h3>
                        <p className="mb-2 text-sm font-semibold text-[#388E3C]">{Number(item.pontos_necessarios).toLocaleString("pt-BR")} EcoPontos</p>
                        <button type="button" disabled={!suficiente || ocupado} onClick={() => selecionar(item)} className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#4CAF50] px-4 py-2.5 font-semibold text-white hover:bg-[#388E3C] disabled:opacity-60">
                            <Gift size={17} aria-hidden="true" />
                            {suficiente ? "Resgatar" : "Saldo insuficiente"}
                        </button>
                    </article>;
                })}
            </div>
        )}
        <dialog ref={dialogo} aria-labelledby="titulo-resgate" onCancel={event => { if (emAndamento.current) event.preventDefault(); }} className="m-auto w-[90vw] max-w-md rounded-3xl bg-white p-6 shadow-xl backdrop:bg-black/45">
            {voucher ? (
                <div role="status">
                    <h3 id="titulo-resgate" className="text-xl font-bold">Voucher resgatado</h3>
                    <p className="mt-2">{voucher.beneficio}</p>
                    <code className="mt-3 block break-all rounded-lg bg-green-50 p-3">{voucher.codigo}</code>
                    <button type="button" onClick={() => dialogo.current.close()} className="mt-5 rounded-full bg-[#724BC2] px-5 py-2 font-semibold text-white">Entendi</button>
                </div>
            ) : pedido && (
                <>
                    <h3 id="titulo-resgate" className="text-xl font-bold">Confirmar resgate</h3>
                    <p className="mt-2 text-sm">{pedido.item.beneficio} custa {Number(pedido.item.pontos_necessarios).toLocaleString("pt-BR")} EcoPontos.</p>
                    {erro && <p role="alert" className="mt-3 text-sm text-red-700">{erro}</p>}
                    <div className="mt-5 flex justify-end gap-2">
                        <button type="button" disabled={ocupado} onClick={() => dialogo.current.close()} className="rounded-full bg-gray-100 px-4 py-2 disabled:opacity-60">Cancelar</button>
                        <button type="button" disabled={ocupado} onClick={confirmar} className="rounded-full bg-[#4CAF50] px-4 py-2 font-semibold text-white disabled:opacity-60">{ocupado ? "Resgatando…" : "Confirmar resgate"}</button>
                    </div>
                </>
            )}
        </dialog>
    </section>;
}
