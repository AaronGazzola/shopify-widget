import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sku_id, event_type, session_id } = body

    if (!sku_id || !event_type || !session_id) {
      return NextResponse.json({
        error: 'sku_id, event_type, and session_id are required'
      }, { status: 400 })
    }

    const sku = await prisma.sku.findUnique({
      where: { id: sku_id }
    })

    if (!sku) {
      return NextResponse.json({ error: 'SKU not found' }, { status: 404 })
    }

    const event = await prisma.event.create({
      data: {
        sku_id,
        event_type,
        session_id
      }
    })

    const jsonResponse = NextResponse.json({ success: true, event_id: event.id })
    jsonResponse.headers.set('Access-Control-Allow-Origin', '*')
    jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    return jsonResponse
  } catch (error) {
    console.log(JSON.stringify({ error: 'Failed to create event' }))
    const errorResponse = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    errorResponse.headers.set('Access-Control-Allow-Origin', '*')
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    return errorResponse
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}