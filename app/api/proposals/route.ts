import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const {
      name,
      email,
      phone,
      cpf,
      proposedPrice,
      paymentMethod,
      hasTradeIn,
      tradeInBrand,
      tradeInModel,
      tradeInYear,
      tradeInMileage,
      message,
      vehicleName,
      vehiclePrice,
      vehicleSlug,
    } = data

    // Insert proposal into database
    await sql`
      INSERT INTO proposals (
        name, email, phone, cpf, proposed_price, payment_method,
        has_trade_in, trade_in_brand, trade_in_model, trade_in_year, trade_in_mileage,
        message, vehicle_name, vehicle_price, vehicle_slug, status, created_at
      ) VALUES (
        ${name}, ${email}, ${phone}, ${cpf}, ${Number(proposedPrice)}, ${paymentMethod},
        ${hasTradeIn}, ${tradeInBrand || null}, ${tradeInModel || null}, ${tradeInYear || null}, ${tradeInMileage || null},
        ${message || null}, ${vehicleName}, ${Number(vehiclePrice)}, ${vehicleSlug}, 'pending', NOW()
      )
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating proposal:", error)
    return NextResponse.json({ error: "Failed to create proposal" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const proposals = await sql`
      SELECT * FROM proposals ORDER BY created_at DESC
    `
    return NextResponse.json(proposals)
  } catch (error) {
    console.error("Error fetching proposals:", error)
    return NextResponse.json({ error: "Failed to fetch proposals" }, { status: 500 })
  }
}
