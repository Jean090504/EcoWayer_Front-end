export default function CardPadrao({ children }) {
  return (
    <div className="w-full rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgba(31,41,55,0.05)] sm:p-6">
      {children}
    </div>
  )
}
