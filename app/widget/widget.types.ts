export interface Render {
  id: string
  image_url: string
  alt_text: string
}

export interface LikeResponse {
  liked: boolean
  total_likes: number
}

export interface WidgetState {
  renders: Render[]
  isLoading: boolean
  error: string | null
  setRenders: (renders: Render[]) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export interface LifestyleWidgetProps {
  sku: string
  className?: string
}