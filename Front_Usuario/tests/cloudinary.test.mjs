import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const source = (await readFile(new URL('../src/services/cloudinaryService.js', import.meta.url), 'utf8'))
    .replace('import.meta.env.VITE_CLOUDINARY_CLOUD_NAME', '"teste-cloud"')
    .replace('import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET', '"teste-preset"');
const { uploadFoto, validarFoto } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const foto = () => new File(['imagem de teste'], 'foto.png', { type: 'image/png' });
test('envia arquivo e preset sem credenciais e retorna URL HTTPS', async () => {
    globalThis.fetch = async (url, options) => {
        assert.equal(url, 'https://api.cloudinary.com/v1_1/teste-cloud/image/upload');
        assert.equal(options.method, 'POST');
        assert.equal(options.body.get('upload_preset'), 'teste-preset');
        assert.equal(options.body.get('file').name, 'foto.png');
        assert.equal(options.body.has('api_key'), false);
        assert.equal(options.headers, undefined);
        return Response.json({ secure_url: 'https://res.cloudinary.com/teste-cloud/image/upload/foto.png' });
    };
    assert.match(await uploadFoto(foto()), /^https:\/\/res.cloudinary.com\//);
});
test('rejeita arquivo inválido, vazio e acima do limite antes do upload', () => {
    assert.throws(() => validarFoto(new File(['x'], 'x.svg', { type: 'image/svg+xml' })), /JPG/);
    assert.throws(() => validarFoto(new File([], 'x.png', { type: 'image/png' })), /vazia/);
    assert.throws(() => validarFoto({ type: 'image/png', size: 5 * 1024 * 1024 + 1 }), /5 MB/);
});
test('propaga erro do Cloudinary sem retornar URL', async () => {
    globalThis.fetch = async () => Response.json({ error: { message: 'Upload preset must be unsigned' } }, { status: 400 });
    await assert.rejects(uploadFoto(foto()), /unsigned/);
});
test('falha de rede mostra orientação para tentar novamente', async () => {
    globalThis.fetch = async () => { throw new Error('Failed to fetch'); };
    await assert.rejects(uploadFoto(foto()), /conexão/);
});
test('sucesso sem URL segura não pode ser salvo no perfil', async () => {
    globalThis.fetch = async () => Response.json({ url: 'http://example.com/image.png' });
    await assert.rejects(uploadFoto(foto()), /URL válida/);
});
