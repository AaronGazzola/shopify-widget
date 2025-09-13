"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useWidgetStore } from './widget.stores'
import { getRendersAction, logEventAction, toggleLikeAction } from './widget.actions'
import { getSessionId } from '@/lib/session.utils'

export const useGetRenders = (sku: string) => {
  const { setRenders, setIsLoading, setError } = useWidgetStore()

  return useQuery({
    queryKey: ['renders', sku],
    queryFn: async () => {
      setIsLoading(true)
      setError(null)

      const { data, error } = await getRendersAction(sku)

      if (error) {
        setError(error)
        setIsLoading(false)
        throw new Error(error)
      }

      setRenders(data || [])
      setIsLoading(false)
      return data
    },
    enabled: !!sku,
    staleTime: 1000 * 60 * 5
  })
}

export const useLogEvent = () => {
  return useMutation({
    mutationFn: async ({ sku_id, event_type }: { sku_id: string; event_type: string }) => {
      const session_id = getSessionId()
      const { data, error } = await logEventAction(sku_id, event_type, session_id)

      if (error) throw new Error(error)
      return data
    }
  })
}

export const useToggleLike = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (sku_id: string) => {
      const session_id = getSessionId()
      const { data, error } = await toggleLikeAction(sku_id, session_id)

      if (error) throw new Error(error)
      return data
    },
    onSuccess: (data, sku_id) => {
      queryClient.invalidateQueries({ queryKey: ['likes', sku_id] })
    }
  })
}