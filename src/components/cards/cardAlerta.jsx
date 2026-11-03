export default function CardAlerta({ imagem, children }) {
  return (
    <div className = "flex flex-row bg-[#FFFFFF] gap-4 items-center rounded-lg shadow-md w-full min-h-[130px] h-[15vh]">

      <div className = "w-[60px] h-[60px] bg-[#7350B9] flex items-center justify-center rounded-lg">
        <img src = {imagem} alt = "" />
      </div>

      <div className = "flex flex-col gap-1">
        {children}
      </div>

      <span className = "ml-auto bg-[#7350B9] text-white rounded-[clamp(10px,0.7vw,14px)] text-[clamp(12px,1vw,16px)] w-[clamp(105px,8vw,155px)] h-[clamp(35px,3vh,45px)] flex items-center justify-center mr-5">
        XX% certeza
      </span>

    </div>
  )
}