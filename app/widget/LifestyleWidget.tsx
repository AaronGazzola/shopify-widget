"use client"

import { useEffect, useState } from 'react'
import { cn } from '@/lib/shadcn.utils'
import { useGetRenders, useLogEvent, useToggleLike } from './widget.hooks'
import { useWidgetStore } from './widget.stores'
import { LifestyleWidgetProps } from './widget.types'
import { HeartIcon } from './HeartIcon'
import { getSessionId } from '@/lib/session.utils'

export const LifestyleWidget = ({ sku, className }: LifestyleWidgetProps) => {
  const { renders, isLoading, error } = useWidgetStore()
  const [likes, setLikes] = useState<Record<string, { liked: boolean; total: number }>>({})

  const { data: rendersData } = useGetRenders(sku)
  const logEventMutation = useLogEvent()
  const toggleLikeMutation = useToggleLike()

  useEffect(() => {
    if (rendersData?.length) {
      logEventMutation.mutate({ sku_id: rendersData[0].id, event_type: 'view' })
    }
  }, [rendersData])

  const handleLike = async (renderId: string) => {
    try {
      const result = await toggleLikeMutation.mutateAsync(renderId)
      if (result) {
        setLikes(prev => ({
          ...prev,
          [renderId]: {
            liked: result.liked,
            total: result.total_likes
          }
        }))

        logEventMutation.mutate({ sku_id: renderId, event_type: 'like' })
      }
    } catch (error) {
      console.log(JSON.stringify({ error: 'Failed to toggle like' }))
    }
  }

  if (isLoading) {
    return (
      <div className={cn("w-full max-w-md mx-auto p-4", className)} data-testid="loading-placeholder">
        <div className="grid grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("w-full max-w-md mx-auto p-4", className)}>
        <div className="text-center text-red-500 text-sm">
          Failed to load lifestyle images
        </div>
      </div>
    )
  }

  if (!renders.length) {
    return (
      <div className={cn("w-full max-w-md mx-auto p-4", className)}>
        <div className="text-center text-gray-500 text-sm">
          No lifestyle images available
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full max-w-md mx-auto p-4", className)}>
      <div className="grid grid-cols-2 gap-4" data-testid="widget-grid">
        {renders.map((render) => (
          <div key={render.id} className="relative group">
            <img
              src={render.image_url}
              alt={render.alt_text}
              className="w-full aspect-square object-cover rounded-lg"
              loading="lazy"
            />
            <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-2">
              <div className="flex items-center gap-1">
                <HeartIcon
                  filled={likes[render.id]?.liked || false}
                  className={cn(
                    "w-5 h-5",
                    likes[render.id]?.liked ? "text-red-500" : "text-gray-600 hover:text-red-500"
                  )}
                  onClick={() => handleLike(render.id)}
                />
                <span className="text-xs text-gray-600">
                  {likes[render.id]?.total || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}