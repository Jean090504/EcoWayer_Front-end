import { useState } from "react";
import TelaHome from "./pages/telaHome.jsx";
import CriarConta from "./pages/criarConta.jsx";

export default function App() {
    const [mostrarCriarConta, setMostrarCriarConta] = useState(false);

    return (
        <div className="relative min-h-screen">
            <TelaHome
                onAbrirCriarConta={() => setMostrarCriarConta(true)}
            />

            {mostrarCriarConta && (
                <CriarConta
                    onClose={() => setMostrarCriarConta(false)}
                />
            )}
        </div>
    );
}