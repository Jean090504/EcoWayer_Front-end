import { useEffect, useRef, useState } from "react";
import {
  listarMateriais, listarCategorias, criarEndereco, excluirEndereco, criarPonto,
  buscarEnderecoExistente, geocodificar, geocodificarReverso, buscarCep,
} from "../../services/pontoColetaService.js";

const STATUS = [
  { valor: "ativo", rotulo: "Ativo", cor: "bg-green-500 text-white" },
  { valor: "inativo", rotulo: "Inativo", cor: "bg-red-500 text-white" },
];

const paraNumero = (v) => (v == null || v === "" ? NaN : Number(String(v).replace(",", ".")));
const latOk = (n) => Number.isFinite(n) && n >= -90 && n <= 90;
const lngOk = (n) => Number.isFinite(n) && n >= -180 && n <= 180;
// Caixa aproximada do Brasil: ajuda a perceber latitude/longitude invertidas
const noBrasil = (lat, lng) => lat >= -34 && lat <= 6 && lng >= -74 && lng <= -34;
const soDigitos = (v) => String(v).replace(/\D/g, "");
const formatarCep = (v) => {
  const d = soDigitos(v).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

const input =
  "w-full rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-800 outline-none focus:border-purple-600 disabled:bg-gray-50";

function Campo({ rotulo, className = "", children }) {
  return (
    <label className={`flex flex-col gap-0.5 ${className}`}>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{rotulo}</span>
      {children}
    </label>
  );
}

export default function ModalNovoPonto({ onClose, onSaved }) {
  const [dados, setDados] = useState({ nome: "", descricao: "", status: "ativo", id_categoria: "" });
  const [end, setEnd] = useState({
    rua: "", numero: "", complemento: "", bairro: "", cep: "", cidade: "", estado: "", sigla: "",
  });
  const [coords, setCoords] = useState({ lat: "", lng: "" });
  const [materiaisIds, setMateriaisIds] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [aviso, setAviso] = useState(null);
  const [erro, setErro] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Contador de requisições: ignora respostas antigas que chegam depois de uma mais nova
  const reqRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    Promise.all([listarCategorias(), listarMateriais()])
      .then(([cats, mats]) => { setCategorias(cats); setMateriais(mats); })
      .catch((e) => setErro(e.message));
    return () => clearTimeout(timerRef.current);
  }, []);

  // ESC fecha, mas não enquanto salva
  useEffect(() => {
    const aoApertar = (e) => e.key === "Escape" && !salvando && onClose();
    window.addEventListener("keydown", aoApertar);
    return () => window.removeEventListener("keydown", aoApertar);
  }, [onClose, salvando]);

  const mudarDados = (k, v) => setDados((d) => ({ ...d, [k]: v }));
  const mudarEnd = (k, v) => setEnd((e) => ({ ...e, [k]: v }));

  // CEP com 8 dígitos preenche rua, bairro, cidade, estado e sigla
  async function mudarCep(valor) {
    const cep = formatarCep(valor);
    mudarEnd("cep", cep);
    if (soDigitos(cep).length !== 8) return;
    const id = ++reqRef.current;
    try {
      const r = await buscarCep(cep);
      if (id !== reqRef.current) return;
      if (!r) return setAviso("CEP não encontrado. Preencha o endereço manualmente.");
      setEnd((e) => ({
        ...e,
        rua: r.rua || e.rua,
        bairro: r.bairro || e.bairro,
        cidade: r.cidade || e.cidade,
        estado: r.estado || e.estado,
        sigla: r.sigla || e.sigla,
      }));
      setAviso("Endereço preenchido pelo CEP. Falta só o número.");
    } catch {
      setAviso("Não consegui consultar o CEP agora. Preencha manualmente.");
    }
  }

  // ENDEREÇO -> COORDENADA (botão)
  async function coordenadaPorEndereco() {
    if (!end.rua.trim() || !end.cidade.trim()) {
      return setErro("Preencha ao menos rua e cidade para buscar as coordenadas");
    }
    setErro(null); setAviso(null); setBuscando(true);
    const id = ++reqRef.current;
    try {
      const r = await geocodificar(end);
      if (id !== reqRef.current) return;
      if (!r) return setAviso("Não encontrei coordenadas para esse endereço. Confira os dados ou digite as coordenadas.");
      setCoords({ lat: String(r.lat), lng: String(r.lng) });
      setAviso("Coordenadas preenchidas. Confira se o local está certo.");
    } catch (e) {
      setErro(e.message);
    } finally {
      if (id === reqRef.current) setBuscando(false);
    }
  }

  // COORDENADA -> ENDEREÇO (automático, com debounce, quando lat/lng são válidas)
  function mudarCoord(campo, valor) {
    const novo = { ...coords, [campo]: valor };
    setCoords(novo);
    clearTimeout(timerRef.current);
    const lat = paraNumero(novo.lat);
    const lng = paraNumero(novo.lng);
    if (!latOk(lat) || !lngOk(lng)) return;

    timerRef.current = setTimeout(async () => {
      setErro(null);
      if (!noBrasil(lat, lng)) {
        return setAviso("Essa coordenada está fora do Brasil. Latitude e longitude estão invertidas?");
      }
      setBuscando(true);
      const id = ++reqRef.current;
      try {
        const r = await geocodificarReverso(lat, lng);
        if (id !== reqRef.current) return;
        if (!r) return setAviso("Nenhum endereço encontrado nessa coordenada. Preencha manualmente.");
        // só sobrescreve o que o Mapbox achou, sem apagar o que você já digitou
        setEnd((e) => ({
          ...e,
          rua: r.rua || e.rua,
          numero: r.numero || e.numero,
          bairro: r.bairro || e.bairro,
          cep: r.cep ? formatarCep(r.cep) : e.cep,
          cidade: r.cidade || e.cidade,
          estado: r.estado || e.estado,
          sigla: r.sigla || e.sigla,
        }));
        setAviso("Endereço preenchido pelas coordenadas. Confira antes de salvar.");
      } catch (e) {
        setErro(e.message);
      } finally {
        if (id === reqRef.current) setBuscando(false);
      }
    }, 800);
  }

  const alternarMaterial = (id) =>
    setMateriaisIds((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  // Mesmas regras do controller, para o erro aparecer antes de enviar
  function validar() {
    if (!dados.nome.trim()) return "Informe o nome do ponto";
    if (dados.nome.trim().length > 100) return "O nome pode ter no máximo 100 caracteres";
    if (!dados.id_categoria) return "Escolha uma categoria";
    if (materiaisIds.length === 0) return "Selecione ao menos 1 material aceito";
    if (!end.rua.trim()) return "Informe a rua";
    if (!end.cidade.trim()) return "Informe a cidade";
    if (!end.estado.trim()) return "Informe o estado";
    if (end.sigla.length !== 2) return "Sigla do estado inválida (2 letras, ex: SP)";
    if (soDigitos(end.cep).length !== 8) return "CEP inválido (8 dígitos)";
    return null;
  }

  async function salvar() {
    const problema = validar();
    if (problema) return setErro(problema);

    setSalvando(true); setErro(null); setAviso(null);
    let idEndereco = null;
    let criouEndereco = false; // só desfaz no erro se o endereço foi criado agora
    try {
      // Sem coordenadas: tenta descobrir pelo endereço antes de desistir
      let lat = paraNumero(coords.lat);
      let lng = paraNumero(coords.lng);
      if (!latOk(lat) || !lngOk(lng)) {
        const r = await geocodificar(end);
        if (!r) throw new Error("Informe as coordenadas: não consegui achar pelo endereço");
        lat = r.lat; lng = r.lng;
      }
      if (!noBrasil(lat, lng) && !window.confirm("Essas coordenadas estão fora do Brasil. Salvar mesmo assim?")) {
        return;
      }

      // 1) Reaproveita o endereço se já existir; senão cria
      const existente = await buscarEnderecoExistente(end);
      if (existente) {
        idEndereco = existente.id;
      } else {
        idEndereco = await criarEndereco({ ...end, cep: formatarCep(end.cep) });
        criouEndereco = true;
      }

      // 2) Cria o ponto; o backend grava as tabelas intermediárias (endereço e material)
      const { id: idPonto } = await criarPonto({
        nome: dados.nome.trim(),
        descricao: dados.descricao.trim() || null,
        status: dados.status,
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lng.toFixed(6)),
        id_categoria: Number(dados.id_categoria),
        endereco: [{ id: idEndereco }],
        material_aceito: materiaisIds.map((id) => ({ id })),
      });

      // 201 com alerta: o ponto foi criado, mas os vínculos falharam (backend não devolve o id)
      if (idPonto == null) {
        await onSaved?.();
        throw new Error(
          "O ponto foi criado, mas o endereço ou os materiais não foram vinculados. Abra o ponto na lista e edite para completar."
        );
      }

      criouEndereco = false; // deu certo: nada para desfazer
      await onSaved?.(idPonto);
      onClose();
    } catch (e) {
      // Falhou depois de criar o endereço novo: apaga para não sobrar registro órfão
      if (criouEndereco && idEndereco != null) await excluirEndereco(idEndereco).catch(() => {});
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div
      onClick={() => !salvando && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-gray-900">Novo ponto de coleta</h2>
          <button onClick={onClose} disabled={salvando} className="text-xl leading-none text-gray-400 hover:text-gray-700">
            ×
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <Campo rotulo="Nome">
            <input className={input} maxLength={100} value={dados.nome} onChange={(e) => mudarDados("nome", e.target.value)} />
          </Campo>

          <Campo rotulo="Descrição (opcional)">
            <textarea className={input} rows={2} value={dados.descricao} onChange={(e) => mudarDados("descricao", e.target.value)} />
          </Campo>

          <div className="grid grid-cols-2 gap-3">
            <Campo rotulo="Categoria">
              <select className={input} value={dados.id_categoria} onChange={(e) => mudarDados("id_categoria", e.target.value)}>
                <option value="">Selecione...</option>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </Campo>

            <Campo rotulo="Status">
              <div className="flex gap-2">
                {STATUS.map((s) => (
                  <button
                    key={s.valor}
                    type="button"
                    onClick={() => mudarDados("status", s.valor)}
                    className={`rounded-md px-3 py-1 text-xs font-semibold ${
                      dados.status === s.valor ? s.cor : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {s.rotulo}
                  </button>
                ))}
              </div>
            </Campo>
          </div>

          {/* Endereço */}
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Endereço</p>
            <div className="grid grid-cols-2 gap-2">
              <Campo rotulo="CEP">
                <input className={input} inputMode="numeric" placeholder="00000-000" value={end.cep} onChange={(e) => mudarCep(e.target.value)} />
              </Campo>
              <Campo rotulo="Cidade">
                <input className={input} value={end.cidade} onChange={(e) => mudarEnd("cidade", e.target.value)} />
              </Campo>
              <Campo rotulo="Estado">
                <input className={input} maxLength={100} placeholder="São Paulo" value={end.estado} onChange={(e) => mudarEnd("estado", e.target.value)} />
              </Campo>
              <Campo rotulo="Sigla (UF)">
                <input
                  className={input}
                  maxLength={2}
                  placeholder="SP"
                  value={end.sigla}
                  onChange={(e) => mudarEnd("sigla", e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))}
                />
              </Campo>
              <Campo rotulo="Rua" className="col-span-2">
                <input className={input} value={end.rua} onChange={(e) => mudarEnd("rua", e.target.value)} />
              </Campo>
              <Campo rotulo="Número">
                <input className={input} value={end.numero} onChange={(e) => mudarEnd("numero", e.target.value)} />
              </Campo>
              <Campo rotulo="Complemento (opcional)">
                <input className={input} value={end.complemento} onChange={(e) => mudarEnd("complemento", e.target.value)} />
              </Campo>
              <Campo rotulo="Bairro" className="col-span-2">
                <input className={input} value={end.bairro} onChange={(e) => mudarEnd("bairro", e.target.value)} />
              </Campo>
            </div>
          </div>

          {/* Digitar as coordenadas preenche o endereço; o botão faz o caminho inverso */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Coordenadas</p>
              <button
                type="button"
                onClick={coordenadaPorEndereco}
                disabled={buscando || salvando}
                className="text-[11px] font-semibold text-purple-600 hover:underline disabled:opacity-50"
              >
                {buscando ? "Buscando..." : "Buscar pelo endereço"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Campo rotulo="Latitude">
                <input className={input} inputMode="decimal" placeholder="-23.5110" value={coords.lat} onChange={(e) => mudarCoord("lat", e.target.value)} />
              </Campo>
              <Campo rotulo="Longitude">
                <input className={input} inputMode="decimal" placeholder="-46.8760" value={coords.lng} onChange={(e) => mudarCoord("lng", e.target.value)} />
              </Campo>
            </div>
          </div>

          <Campo rotulo="Materiais aceitos">
            <div className="flex flex-wrap gap-1">
              {materiais.map((m) => {
                const marcado = materiaisIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => alternarMaterial(m.id)}
                    className={`rounded-md border px-3 py-1 text-xs font-semibold transition ${
                      marcado ? "border-purple-600 bg-purple-600 text-white" : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {m.nome}
                  </button>
                );
              })}
              {materiais.length === 0 && !erro && <span className="text-xs text-gray-400">Carregando...</span>}
            </div>
          </Campo>

          {aviso && <p className="rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-700">{aviso}</p>}
          {erro && <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{erro}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={salvando}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={salvando}
            className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-60"
          >
            {salvando ? "Salvando..." : "Cadastrar"}
          </button>
        </div>
      </div>
    </div>
  );
}