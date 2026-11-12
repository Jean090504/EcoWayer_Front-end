// Cor e texto de cada status (vem direto do banco: ativo | inativo)
const ESTILOS = {
  ativo: { texto: "Ativo", classe: "bg-[#eaf6ec] text-[#4da558]" },
  inativo: { texto: "Inativo", classe: "bg-[#fcebec] text-[#c9363d]" },
  manutencao: { texto: "Manutenção", classe: "bg-[#fff5e6] text-[#b7791f]" },
  cheio: { texto: "Cheio", classe: "bg-[#fcebec] text-[#c9363d]" },
};

export default function StatusBadge({ status }) {
  const chave = String(status ?? "").toLowerCase();
  const estilo = ESTILOS[chave] ?? { texto: status || "—", classe: "bg-gray-400 text-white" };

  return (
    <span className={`inline-block rounded-md px-3 py-1 text-xs font-semibold ${estilo.classe}`}>
      {estilo.texto}
    </span>
  );
}
