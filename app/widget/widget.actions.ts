"use server"

import { ActionResponse, getActionResponse } from '@/lib/action.utils'
import { Render, LikeResponse } from './widget.types'

export const getRendersAction = async (sku: string): Promise<ActionResponse<Render[]>> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/renders?sku=${sku}`)

    if (!response.ok) {
      throw new Error('Failed to fetch renders')
    }

    const data = await response.json()
    return getActionResponse({ data })
  } catch (error) {
    return getActionResponse({ error })
  }
}

export const logEventAction = async (
  sku_id: string,
  event_type: string,
  session_id: string
): Promise<ActionResponse<{ success: boolean }>> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sku_id, event_type, session_id })
    })

    if (!response.ok) {
      throw new Error('Failed to log event')
    }

    const data = await response.json()
    return getActionResponse({ data })
  } catch (error) {
    return getActionResponse({ error })
  }
}

export const toggleLikeAction = async (
  sku_id: string,
  session_id: string
): Promise<ActionResponse<LikeResponse>> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/likes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sku_id, session_id })
    })

    if (!response.ok) {
      throw new Error('Failed to toggle like')
    }

    const data = await response.json()
    return getActionResponse({ data })
  } catch (error) {
    return getActionResponse({ error })
  }
}

export const getLikeStatesAction = async (
  sku_ids: string[],
  session_id: string
): Promise<ActionResponse<Record<string, { liked: boolean; total: number }>>> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/likes?sku_ids=${sku_ids.join(',')}&session_id=${session_id}`)

    if (!response.ok) {
      throw new Error('Failed to fetch like states')
    }

    const data = await response.json()
    return getActionResponse({ data })
  } catch (error) {
    return getActionResponse({ error })
  }
}