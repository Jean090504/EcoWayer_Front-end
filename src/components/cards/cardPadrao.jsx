export default function CardPadrao({ children }) {
  return (
    <div className = "bg-[#FFFFFF] rounded-[12px] p-6 shadow-sm border border-[#F3F4F6] w-full flex flex-col">
      {children}
    </div>
  )
}