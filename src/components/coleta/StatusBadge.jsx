// Cor e texto de cada status (vem direto do banco: ativo | inativo)
const ESTILOS = {
  ativo: { texto: "Ativo", classe: "bg-green-500 text-white" },
  inativo: { texto: "Inativo", classe: "bg-red-500 text-white" },
  manutencao: { texto: "Manutenção", classe: "bg-orange-400 text-white" },
  cheio: { texto: "Cheio", classe: "bg-red-500 text-white" },
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