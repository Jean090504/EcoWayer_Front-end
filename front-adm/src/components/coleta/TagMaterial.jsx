// Regras de cor: se o nome do material CONTÉM a palavra-chave, usa a cor (ordem importa)
// As classes ficam escritas por extenso para o Tailwind reconhecê-las
const REGRAS = [
  { chave: "plastic", cor: "bg-blue-500" },      // Plástico / Plásticos
  { chave: "metal", cor: "bg-yellow-600" },      // Metal / Metais
  { chave: "vidro", cor: "bg-green-500" },       // Vidro / Vidros
  { chave: "papel", cor: "bg-amber-700" },       // Papel / Papelão
  { chave: "eletron", cor: "bg-purple-600" },    // Eletrônico / Eletrônicos
  { chave: "pilha", cor: "bg-sky-500" },         // Pilhas
  { chave: "bateria", cor: "bg-sky-500" },       // Baterias
  { chave: "organic", cor: "bg-lime-600" },      // Orgânico / Orgânicos
  { chave: "oleo", cor: "bg-orange-500" },       // Óleo
  { chave: "madeira", cor: "bg-stone-500" },     // Madeira
  { chave: "entulho", cor: "bg-gray-500" },      // Entulho
];

// Cores de reserva: materiais sem regra ganham sempre a mesma cor (calculada pelo nome)
const RESERVA = ["bg-pink-500", "bg-teal-500", "bg-indigo-500", "bg-rose-500", "bg-cyan-600", "bg-fuchsia-500", "bg-emerald-600"];

// Remove acentos e deixa minúsculo ("Plásticos" -> "plasticos")
const normalizar = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function corDoMaterial(nome) {
  const n = normalizar(nome);
  const regra = REGRAS.find((r) => n.includes(r.chave));
  if (regra) return regra.cor;

  // Sem regra: escolhe uma cor da reserva a partir do texto (sempre a mesma para o mesmo nome)
  const soma = [...n].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return RESERVA[soma % RESERVA.length];
}

export default function TagMaterial({ nome }) {
  return (
    // Chip pequeno com o nome do material, colorido conforme o tipo
    <span className={`rounded px-2 py-0.5 text-[10px] font-medium text-white ${corDoMaterial(nome)}`}>
      {nome}
    </span>
  );
}