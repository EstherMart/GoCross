"use client";

import { useState } from "react";
import { grupoDe } from "@/lib/formato";
import type { DecisaoLote } from "@/lib/remessa";
import { FilaTitulos, RemessaFinal } from "./FilaTitulos";
import { Orquestracao } from "./Orquestracao";

type Aba = "excecoes" | "agentes" | "remessa";

export function AbasLote({ decisoes }: { decisoes: DecisaoLote[] }) {
  const [aba, setAba] = useState<Aba>("agentes");
  const liberados = decisoes.filter((d) => grupoDe(d.acao) === "liberado");
  const abas: { id: Aba; rotulo: string }[] = [
    { id: "agentes", rotulo: "Agentes trabalhando" },
    { id: "excecoes", rotulo: `Exceções (${decisoes.length - liberados.length})` },
    { id: "remessa", rotulo: `Remessa final (${liberados.length})` },
  ];

  return (
    <>
      <nav className="abas" role="tablist">
        {abas.map((a) => (
          <button key={a.id} role="tab" aria-selected={aba === a.id} className={`aba ${aba === a.id ? "ativa" : ""}`} onClick={() => setAba(a.id)}>
            {a.rotulo}
          </button>
        ))}
      </nav>
      {aba === "excecoes" && <FilaTitulos decisoes={decisoes} />}
      {aba === "agentes" && <Orquestracao decisoes={decisoes} />}
      {aba === "remessa" && <RemessaFinal liberados={liberados} />}
    </>
  );
}
