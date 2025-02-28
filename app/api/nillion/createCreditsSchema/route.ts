import { createSchema } from "@/lib/nillion/createSchema"
import { NextResponse } from "next/server"
export async function POST() {
  await createSchema("credits")
  return new NextResponse("Schema created!!", { status: 200 })
}
