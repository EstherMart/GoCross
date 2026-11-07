import { NextResponse } from "next/server";
import { processarLote } from "@/lib/remessa";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const lote = new URL(req.url).searchParams.get("lote") ?? "RM20261103-MER";
  return NextResponse.json(await processarLote(lote));
}
