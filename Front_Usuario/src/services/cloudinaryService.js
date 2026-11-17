const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export function validarFoto(arquivo) {
    if (!arquivo || !['image/jpeg', 'image/png', 'image/webp'].includes(arquivo.type)) {
        throw new Error('Selecione uma imagem JPG, PNG ou WebP.');
    }
    if (arquivo.size === 0 || arquivo.size > 5 * 1024 * 1024) {
        throw new Error('A imagem deve ter até 5 MB e não pode estar vazia.');
    }
}

export async function uploadFoto(arquivo) {
    validarFoto(arquivo);
    if (!CLOUD_NAME || !UPLOAD_PRESET) throw new Error('O envio de fotos não está configurado.');
    const body = new FormData();
    body.append('file', arquivo);
    body.append('upload_preset', UPLOAD_PRESET);
    let resposta;
    try {
        resposta = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST', body, signal: AbortSignal.timeout(60000)
        });
    } catch {
        throw new Error('Não foi possível enviar a foto. Verifique sua conexão e tente novamente.');
    }
    const dados = await resposta.json().catch(() => ({}));
    if (!resposta.ok) throw new Error(dados.error?.message || 'Não foi possível enviar a foto ao Cloudinary.');
    if (!dados.secure_url?.startsWith('https://res.cloudinary.com/')) throw new Error('O Cloudinary não retornou uma URL válida para a foto.');
    return dados.secure_url;
}
