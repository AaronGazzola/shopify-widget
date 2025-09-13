import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
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

    return NextResponse.json(renders)
  } catch (error) {
    console.log(JSON.stringify({ error: 'Failed to fetch renders' }))
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}