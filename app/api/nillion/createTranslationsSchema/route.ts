import { createSchema } from "@/lib/nillion/createSchema"
import { NextResponse } from "next/server"
export async function POST(req: Request) {
  await createSchema("translations")

  return new NextResponse("Schema created!!", { status: 200 })
}
