export default function TagMaterial({ nome }) {
  return (
    <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600">
      {nome}
    </span>
  );
}
