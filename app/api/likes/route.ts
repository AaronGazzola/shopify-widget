import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

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

    return NextResponse.json({ liked, total_likes: totalLikes })
  } catch (error) {
    console.log(JSON.stringify({ error: 'Failed to toggle like' }))
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}