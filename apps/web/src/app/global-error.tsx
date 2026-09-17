"use client";

type GlobalErrorProps = {
  reset: () => void;
};

const GlobalError = ({ reset }: GlobalErrorProps) => (
  <html lang="pt-BR">
    <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#F3F6F4", color: "#14231C" }}>
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
        <div>
          <h1 style={{ fontSize: 28, margin: "0 0 8px" }}>O FluiuAê não conseguiu abrir</h1>
          <p style={{ margin: "0 0 20px", color: "#4B5B53" }}>Algo deu errado ao carregar o app. Tente de novo em instantes.</p>
          <button
            type="button"
            onClick={reset}
            style={{ padding: "10px 18px", border: 0, borderRadius: 10, background: "#0E7A4E", color: "#FFFFFF", fontWeight: 600, cursor: "pointer" }}
          >
            Tentar de novo
          </button>
        </div>
      </main>
    </body>
  </html>
);

export default GlobalError;
