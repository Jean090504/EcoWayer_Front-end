import { useEffect, useMemo, useState } from 'react'
import { MapPin, Navigation, RefreshCw, Search } from 'lucide-react'
import { apiFetch } from '../services/api.js'

const valido = ponto => ponto && Number.isFinite(Number(ponto.latitude)) && Number.isFinite(Number(ponto.longitude))
  && Math.abs(Number(ponto.latitude)) <= 90 && Math.abs(Number(ponto.longitude)) <= 180
  && (Number(ponto.latitude) !== 0 || Number(ponto.longitude) !== 0)

function enderecoTexto(ponto) {
  const e = Array.isArray(ponto.endereco) ? ponto.endereco[0] : ponto.endereco
  if (!e) return 'Endereço não informado'
  return [[e.rua, e.numero].filter(Boolean).join(', '), e.bairro,
    [e.cidade, e.sigla || e.estado].filter(Boolean).join(' - ')].filter(Boolean).join(' · ') || 'Endereço não informado'
}

function urlMapa(ponto) {
  const lat = Number(ponto.latitude), lon = Number(ponto.longitude), delta = 0.008
  const query = new URLSearchParams({ bbox: `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`,
    layer: 'mapnik', marker: `${lat},${lon}` })
  return `https://www.openstreetmap.org/export/embed.html?${query}`
}

export default function MapaEcoPontos() {
  const [pontos, setPontos] = useState([])
  const [selecionado, setSelecionado] = useState(null)
  const [busca, setBusca] = useState('')
  const [material, setMaterial] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true
    apiFetch('/ponto_coleta').then(dados => {
      if (!ativo) return
      const lista = dados.response?.ponto_coleta
      const recebidos = Array.isArray(lista) ? lista.filter(p => String(p.status).toLowerCase() === 'ativo') : []
      setPontos(recebidos)
      setSelecionado(atual => recebidos.find(p => p.id === atual)?.id ?? recebidos[0]?.id ?? null)
      setErro('')
    }).catch(error => { if (ativo) { setPontos([]); setErro(error.status === 404 ? '' : error.message) } })
      .finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [tentativa])

  const materiais = useMemo(() => [...new Set(pontos.flatMap(p =>
    (Array.isArray(p.material_aceito) ? p.material_aceito : []).map(m => m.nome).filter(Boolean)))].sort(), [pontos])
  const filtrados = useMemo(() => pontos.filter(p => {
    const texto = `${p.nome} ${p.descricao || ''} ${enderecoTexto(p)}`.toLocaleLowerCase('pt-BR')
    return texto.includes(busca.trim().toLocaleLowerCase('pt-BR')) &&
      (!material || p.material_aceito?.some(item => item.nome === material))
  }), [pontos, busca, material])
  const ponto = filtrados.find(p => p.id === selecionado) || filtrados[0]

  return <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 text-[#191C1E]">
    <h1 className="text-3xl font-bold">EcoPontos</h1>
    <p className="mt-2 text-sm text-gray-600">Consulte os pontos de coleta cadastrados e os materiais aceitos.</p>
    <div className="mt-6 flex flex-wrap gap-3">
      <label className="flex min-w-60 flex-1 items-center gap-2 rounded-xl border bg-white px-3"><Search size={18} />
        <input aria-label="Buscar EcoPonto" value={busca} onChange={e => setBusca(e.target.value)} placeholder="Nome, bairro ou cidade" className="h-11 w-full outline-none" />
      </label>
      <select aria-label="Filtrar material" value={material} onChange={e => setMaterial(e.target.value)} className="h-11 rounded-xl border bg-white px-3">
        <option value="">Todos os materiais</option>
        {materiais.map(nome => <option key={nome} value={nome}>{nome}</option>)}
      </select>
    </div>
    {erro && <div role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-red-800">{erro}
      <button type="button" onClick={() => { setCarregando(true); setTentativa(n => n + 1) }} className="ml-3 inline-flex items-center gap-1 underline"><RefreshCw size={15} /> Tentar novamente</button>
    </div>}
    {carregando ? <p role="status" className="mt-6">Carregando EcoPontos…</p> : !erro && filtrados.length === 0 && <p className="mt-6">Nenhum EcoPonto encontrado.</p>}
    {!carregando && filtrados.length > 0 && <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(280px,1fr)_minmax(0,1.5fr)]">
      <section aria-label="Lista de EcoPontos" className="max-h-[620px] space-y-3 overflow-y-auto">
        {filtrados.map(item => <button key={item.id} type="button" onClick={() => setSelecionado(item.id)}
          aria-pressed={ponto?.id === item.id} className={`w-full rounded-xl border bg-white p-4 text-left shadow-sm ${ponto?.id === item.id ? 'border-[#724BC2]' : 'border-gray-200'}`}>
          <strong className="block">{item.nome}</strong><span className="mt-1 block text-sm text-gray-600">{enderecoTexto(item)}</span>
          <span className="mt-2 block text-xs text-green-700">{item.material_aceito?.map(m => m.nome).filter(Boolean).join(', ') || 'Materiais não informados'}</span>
        </button>)}
      </section>
      <section aria-label="Localização do EcoPonto" className="overflow-hidden rounded-xl border bg-white shadow-sm">
        {valido(ponto) ? <iframe key={ponto.id} title={`Mapa de ${ponto.nome}`} src={urlMapa(ponto)} loading="lazy" className="h-[380px] w-full border-0" />
          : <div className="flex h-[380px] items-center justify-center p-6 text-center text-gray-600"><MapPin className="mr-2" /> Este ponto ainda não tem coordenadas no mapa.</div>}
        <div className="p-4"><h2 className="font-semibold">{ponto.nome}</h2><p className="mt-1 text-sm text-gray-600">{enderecoTexto(ponto)}</p>
          {ponto.descricao && <p className="mt-2 text-sm">{ponto.descricao}</p>}
          {valido(ponto) && <a className="mt-4 inline-flex items-center gap-2 font-medium text-[#724BC2] underline" target="_blank" rel="noreferrer"
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${ponto.latitude},${ponto.longitude}`)}`}><Navigation size={17} /> Traçar rota</a>}
        </div>
      </section>
    </div>}
  </main>
}
