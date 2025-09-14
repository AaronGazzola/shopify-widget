import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sku_ids = searchParams.get('sku_ids')
    const session_id = searchParams.get('session_id')

    if (!sku_ids || !session_id) {
      return NextResponse.json({
        error: 'sku_ids and session_id are required'
      }, { status: 400 })
    }

    const skuIdArray = sku_ids.split(',')

    const likes = await prisma.like.findMany({
      where: {
        sku_id: { in: skuIdArray },
        session_id
      }
    })

    const likeCounts = await prisma.like.groupBy({
      by: ['sku_id'],
      where: {
        sku_id: { in: skuIdArray }
      },
      _count: {
        id: true
      }
    })

    const likeStates: Record<string, { liked: boolean; total: number }> = {}

    skuIdArray.forEach(skuId => {
      const userLike = likes.find(like => like.sku_id === skuId)
      const totalCount = likeCounts.find(count => count.sku_id === skuId)?._count.id || 0

      likeStates[skuId] = {
        liked: !!userLike,
        total: totalCount
      }
    })

    const jsonResponse = NextResponse.json(likeStates)
    jsonResponse.headers.set('Access-Control-Allow-Origin', '*')
    jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    return jsonResponse
  } catch (error) {
    console.log(JSON.stringify({ error: 'Failed to fetch like states' }))
    const errorResponse = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    errorResponse.headers.set('Access-Control-Allow-Origin', '*')
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    return errorResponse
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sku_id, session_id } = body

    if (!sku_id || !session_id) {
      return NextResponse.json({
        error: 'sku_id and session_id are required'
      }, { status: 400 })
    }

    const sku = await prisma.sku.findUnique({
      where: { id: sku_id }
    })

    if (!sku) {
      return NextResponse.json({ error: 'SKU not found' }, { status: 404 })
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        sku_id_session_id: {
          sku_id,
          session_id
        }
      }
    })

    let liked = false

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      })
    } else {
      await prisma.like.create({
        data: {
          sku_id,
          session_id
        }
      })
      liked = true
    }

    const totalLikes = await prisma.like.count({
      where: { sku_id }
    })

    const jsonResponse = NextResponse.json({ liked, total_likes: totalLikes })
    jsonResponse.headers.set('Access-Control-Allow-Origin', '*')
    jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    return jsonResponse
  } catch (error) {
    console.log(JSON.stringify({ error: 'Failed to toggle like' }))
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