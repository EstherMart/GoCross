"use client";

import { useState, type ReactNode } from "react";

type Aba = { id: string; rotulo: string; conteudo: ReactNode };

// Abas ocultas ficam montadas (hidden), para a orquestração não reiniciar ao trocar.
export function Abas({ abas }: { abas: Aba[] }) {
  const [ativa, setAtiva] = useState(abas[0]?.id);
  return (
    <>
      <div className="abas" role="tablist">
        {abas.map((a) => (
          <button key={a.id} type="button" role="tab" aria-selected={ativa === a.id} className={ativa === a.id ? "on" : ""} onClick={() => setAtiva(a.id)}>
            {a.rotulo}
          </button>
        ))}
      </div>
      {abas.map((a) => (
        <div key={a.id} role="tabpanel" hidden={ativa !== a.id}>{a.conteudo}</div>
      ))}
    </>
  );
}
