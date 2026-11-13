const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploadImagem(arquivo) {
  const formData = new FormData()
  formData.append("file", arquivo)
  formData.append("upload_preset", UPLOAD_PRESET)

  const resposta = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  )
  const dados = await resposta.json()

  if (!resposta.ok) throw new Error(dados.error?.message || "Erro ao enviar imagem")

  return dados.secure_url
}
