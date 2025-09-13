export interface ActionResponse<T = any> {
  data?: T
  error?: string
}

export const getActionResponse = <T>({
  data,
  error,
}: {
  data?: T
  error?: any
}): ActionResponse<T> => {
  if (error) {
    console.log(JSON.stringify({ error: error.message || 'Unknown error' }))
    return { error: error.message || 'Unknown error' }
  }
  return { data }
}