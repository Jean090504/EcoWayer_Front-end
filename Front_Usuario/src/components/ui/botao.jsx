export default function BotaoHeader({ children, onClick, className }) {
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
