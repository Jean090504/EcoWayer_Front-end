import { useRef, useState } from "react";

import Mesa from "../../assets/icons/img/mesa.png";
import Garrafas from "../../assets/icons/img/garrafas.png";
import Sofa from "../../assets/icons/img/sofa.png";
import Papelao from "../../assets/icons/img/papelao.png";
import Poltrona from "../../assets/icons/img/poltrona.png";
import Telefone from "../../assets/icons/img/telefone.png";
import Geladeira from "../../assets/icons/img/geladeira.png";

const produtos = [
  {
    id: 1,
    nome: "Mesa semi nova...",
    preco: "R$ 170,00",
    imagem: Mesa,
    avaliacao: "4.9",
    distancia: "2.4 km",
  },
  {
    id: 2,
    nome: "Fardo de PET limpo - garrafas",
    preco: "R$ 64,00",
    imagem: Garrafas,
    avaliacao: "4.7",
    distancia: "1.1 km",
  },
  {
    id: 3,
    nome: "Sofá semi novo - confortável",
    preco: "R$ 45,00",
    imagem: Sofa,
    avaliacao: "4.8",
    distancia: "4.0 km",
  },
  {
    id: 4,
    nome: "Papelão prensado - 50 kg",
    preco: "R$ 45,00",
    imagem: Papelao,
    avaliacao: "4.8",
    distancia: "4.0 km",
  },
  {
    id: 5,
    nome: "Poltrona cor creme nova",
    preco: "R$ 45,00",
    imagem: Poltrona,
    avaliacao: "4.8",
    distancia: "4.0 km",
  },
  {
    id: 6,
    nome: "Celular usado - modelo antigo",
    preco: "R$ 45,00",
    imagem: Telefone,
    avaliacao: "4.8",
    distancia: "4.0 km",
  },
  {
    id: 7,
    nome: "Geladeira nova - branca",
    preco: "R$ 45,00",
    imagem: Geladeira,
    avaliacao: "4.8",
    distancia: "4.0 km",
  },
];

export default function Destaques() {
  const carrosselRef = useRef(null);
  const [favoritos, setFavoritos] = useState([]);

  function moverCarrossel(direcao) {
    if (!carrosselRef.current) return;

    carrosselRef.current.scrollBy({
      left: direcao * 400,
      behavior: "smooth",
    });
  }

  function alternarFavorito(id) {
    setFavoritos((atuais) =>
      atuais.includes(id)
        ? atuais.filter((item) => item !== id)
        : [...atuais, id]
    );
  }

  return (
    <section className="w-full min-w-0 py-4">
      {/* Cabeçalho */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">
          Anúncios em destaques
        </h2>

        {/* Botões de navegação */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => moverCarrossel(-1)}
            aria-label="Ver anúncios anteriores"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path
                d="m15 18-6-6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => moverCarrossel(1)}
            aria-label="Ver próximos anúncios"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path
                d="m9 18 6-6-6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Carrossel de anúncios */}
      <div
        ref={carrosselRef}
        className="w-full min-w-0 flex snap-x snap-mandatory gap-3 overflow-x-auto p-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {produtos.map((produto) => {
          const favoritado = favoritos.includes(produto.id);

          return (
            <article
              key={produto.id}
              className="w-[180px] min-w-[180px] shrink-0 snap-start overflow-hidden rounded-xl border border-gray-100 bg-white p-2.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* Imagem do produto */}
              <div className="relative h-[156px] w-full overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />

                {/* Favoritos */}
                <button
                  type="button"
                  onClick={() => alternarFavorito(produto.id)}
                  aria-label={
                    favoritado
                      ? "Remover dos favoritos"
                      : "Adicionar aos favoritos"
                  }
                  aria-pressed={favoritado}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={favoritado ? "#724BC2" : "none"}
                    stroke={favoritado ? "#724BC2" : "#374151"}
                    strokeWidth="1.8"
                    className="h-4 w-4"
                  >
                    <path
                      d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Informações do anúncio */}
              <div className="px-0.5 pt-2">
                <h3
                  title={produto.nome}
                  className="truncate text-xs font-semibold leading-5 text-gray-800"
                >
                  {produto.nome}
                </h3>

                <p className="truncate text-sm font-bold leading-5 text-[#58A24D]">
                  {produto.preco}
                </p>

                {/* Avaliação e distância */}
                <div className="mt-1 flex items-center gap-1 text-[10px] leading-4 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#F5B82E"
                    className="h-3.5 w-3.5 shrink-0"
                  >
                    <path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.5Z" />
                  </svg>

                  <span>{produto.avaliacao}</span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="ml-1 h-3.5 w-3.5 shrink-0"
                  >
                    <path
                      d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>

                  <span className="truncate">{produto.distancia}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}