import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const response = NextResponse.next()

  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')

  try {
    const { searchParams } = new URL(request.url)
    const sku = searchParams.get('sku')

    if (!sku) {
      return NextResponse.json({ error: 'SKU parameter is required' }, { status: 400 })
    }

    const skuRecord = await prisma.sku.findUnique({
      where: { sku_code: sku },
      include: {
        renders: {
          where: { is_active: true },
          take: 2,
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!skuRecord) {
      return NextResponse.json({ error: 'SKU not found' }, { status: 404 })
    }

    const renders = skuRecord.renders.map(render => ({
      id: render.id,
      image_url: render.image_url,
      alt_text: render.alt_text || `${skuRecord.product_name} lifestyle image`
    }))

    const jsonResponse = NextResponse.json(renders)
    jsonResponse.headers.set('Access-Control-Allow-Origin', '*')
    jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    return jsonResponse
  } catch (error) {
    console.log(JSON.stringify({ error: 'Failed to fetch renders' }))
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