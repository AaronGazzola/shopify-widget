import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const skus = await prisma.sku.findMany({
      include: {
        events: {
          where: {
            createdAt: {
              gte: startDate
            }
          }
        },
        likes: {
          where: {
            createdAt: {
              gte: startDate
            }
          }
        },
        _count: {
          select: {
            events: {
              where: {
                createdAt: {
                  gte: startDate
                }
              }
            },
            likes: {
              where: {
                createdAt: {
                  gte: startDate
                }
              }
            }
          }
        }
      }
    })

    const skuPerformance = skus.map(sku => {
      const viewEvents = sku.events.filter(event => event.event_type === 'view')
      const likeEvents = sku.events.filter(event => event.event_type === 'like')

      const views = viewEvents.length
      const likes = sku._count.likes
      const ctr = views > 0 ? (likes / views * 100).toFixed(2) : '0.00'

      return {
        sku: sku.sku_code,
        product_name: sku.product_name,
        views,
        likes,
        ctr: parseFloat(ctr)
      }
    })

    return NextResponse.json({
      sku_performance: skuPerformance.sort((a, b) => b.views - a.views)
    })
  } catch (error) {
    console.log(JSON.stringify({ error: 'Failed to fetch analytics' }))
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}