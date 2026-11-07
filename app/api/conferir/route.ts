import { NextResponse } from "next/server";
import { decidir } from "@/lib/motor";
import { tituloPorId } from "@/lib/dados";
import { casoDe } from "@/lib/remessa";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!tituloPorId(id)) return NextResponse.json({ erro: "título não encontrado" }, { status: 404 });
  return NextResponse.json(casoDe(await decidir(id)));
}
