export default function BotaoHeader({ children, onClick, className }) {
    // Botões do header (meus anúncios, criar anúncio, login, criar conta) 
    // são todos iguais, então criei esse componente pra não repetir código
    return (
        <button
            type = "button"
            onClick = {onClick}
            className = {className}
        >
            {children}
        </button>
    );
}
