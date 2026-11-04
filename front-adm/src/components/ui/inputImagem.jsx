export default function InputImagem({ accept = "image/*", onChange, className = "hidden" }) {
  return (
    <input
      type = "file"
      accept = {accept}
      onChange = {(e) => onChange?.(e.target.files[0])}
      className = {className}
    />
  )
}