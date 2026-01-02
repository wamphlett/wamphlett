import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    apiUrl: process.env.NEXT_PUBLIC_API_URL, // NOT NEXT_PUBLIC
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL, // NOT NEXT_PUBLIC
  });
}