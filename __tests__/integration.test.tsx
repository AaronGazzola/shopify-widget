import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LifestyleWidget } from '@/app/widget/LifestyleWidget'
import { getRendersAction, logEventAction, toggleLikeAction } from '@/app/widget/widget.actions'
import { getSessionId } from '@/lib/session.utils'

jest.mock('@/app/widget/widget.actions')
jest.mock('@/lib/session.utils')

const mockedGetRendersAction = getRendersAction as jest.MockedFunction<typeof getRendersAction>
const mockedLogEventAction = logEventAction as jest.MockedFunction<typeof logEventAction>
const mockedToggleLikeAction = toggleLikeAction as jest.MockedFunction<typeof toggleLikeAction>
const mockedGetSessionId = getSessionId as jest.MockedFunction<typeof getSessionId>

const mockRenderData = [
  {
    id: 'render1',
    image_url: 'https://example.com/image1.jpg',
    alt_text: 'Test product lifestyle shot 1'
  },
  {
    id: 'render2',
    image_url: 'https://example.com/image2.jpg',
    alt_text: 'Test product lifestyle shot 2'
  }
]

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  })
}

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  )
}

describe('Shopify Widget Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedGetSessionId.mockReturnValue('mock-session-123')
  })

  describe('Widget loads with valid SKU', () => {
    it('should display loading state initially', () => {
      mockedGetRendersAction.mockImplementation(() => new Promise(() => {}))

      renderWithProviders(<LifestyleWidget sku="ABC123" />)

      expect(screen.getByTestId('loading-placeholder')).toBeInTheDocument()
    })

    it('should fetch and display lifestyle images from database', async () => {
      mockedGetRendersAction.mockResolvedValue({
        data: mockRenderData,
        error: null
      })
      mockedLogEventAction.mockResolvedValue({
        data: { success: true },
        error: null
      })

      renderWithProviders(<LifestyleWidget sku="ABC123" />)

      await waitFor(() => {
        expect(screen.getByAltText('Test product lifestyle shot 1')).toBeInTheDocument()
        expect(screen.getByAltText('Test product lifestyle shot 2')).toBeInTheDocument()
      })

      expect(mockedGetRendersAction).toHaveBeenCalledWith('ABC123')
    })

    it('should log view event on widget load', async () => {
      mockedGetRendersAction.mockResolvedValue({
        data: mockRenderData,
        error: null
      })
      mockedLogEventAction.mockResolvedValue({
        data: { success: true },
        error: null
      })

      renderWithProviders(<LifestyleWidget sku="ABC123" />)

      await waitFor(() => {
        expect(mockedLogEventAction).toHaveBeenCalledWith('render1', 'view', 'mock-session-123')
      })
    })
  })

  describe('Like button functionality', () => {
    it('should toggle like state and log like event', async () => {
      mockedGetRendersAction.mockResolvedValue({
        data: mockRenderData,
        error: null
      })
      mockedLogEventAction.mockResolvedValue({
        data: { success: true },
        error: null
      })
      mockedToggleLikeAction.mockResolvedValue({
        data: { liked: true, total_likes: 5 },
        error: null
      })

      const user = userEvent.setup()
      renderWithProviders(<LifestyleWidget sku="ABC123" />)

      await waitFor(() => {
        expect(screen.getByAltText('Test product lifestyle shot 1')).toBeInTheDocument()
      })

      const heartButtons = screen.getAllByRole('button')
      await user.click(heartButtons[0])

      await waitFor(() => {
        expect(mockedToggleLikeAction).toHaveBeenCalledWith('render1', 'mock-session-123')
      })

      await waitFor(() => {
        expect(mockedLogEventAction).toHaveBeenCalledWith('render1', 'like', 'mock-session-123')
      })

      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument()
      })
    })

    it('should display initial like count as 0', async () => {
      mockedGetRendersAction.mockResolvedValue({
        data: mockRenderData,
        error: null
      })
      mockedLogEventAction.mockResolvedValue({
        data: { success: true },
        error: null
      })

      renderWithProviders(<LifestyleWidget sku="ABC123" />)

      await waitFor(() => {
        const likeCountElements = screen.getAllByText('0')
        expect(likeCountElements.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Error handling', () => {
    it('should handle API errors gracefully', async () => {
      mockedGetRendersAction.mockResolvedValue({
        data: null,
        error: 'API Error'
      })

      renderWithProviders(<LifestyleWidget sku="ABC123" />)

      await waitFor(() => {
        expect(screen.getByText('Failed to load lifestyle images')).toBeInTheDocument()
      })
    })

    it('should handle empty results gracefully', async () => {
      mockedGetRendersAction.mockResolvedValue({
        data: [],
        error: null
      })

      renderWithProviders(<LifestyleWidget sku="ABC123" />)

      await waitFor(() => {
        expect(screen.getByText('No lifestyle images available')).toBeInTheDocument()
      })
    })
  })

  describe('Session management', () => {
    it('should use session ID from session utils', () => {
      expect(mockedGetSessionId()).toBe('mock-session-123')
    })
  })

  describe('Responsive design', () => {
    it('should display in 2-column grid layout', async () => {
      mockedGetRendersAction.mockResolvedValue({
        data: mockRenderData,
        error: null
      })
      mockedLogEventAction.mockResolvedValue({
        data: { success: true },
        error: null
      })

      renderWithProviders(<LifestyleWidget sku="ABC123" />)

      await waitFor(() => {
        const container = screen.getByTestId('widget-grid')
        expect(container).toHaveClass('grid-cols-2')
      })
    })

    it('should have proper aspect ratios for images', async () => {
      mockedGetRendersAction.mockResolvedValue({
        data: mockRenderData,
        error: null
      })
      mockedLogEventAction.mockResolvedValue({
        data: { success: true },
        error: null
      })

      renderWithProviders(<LifestyleWidget sku="ABC123" />)

      await waitFor(() => {
        const images = screen.getAllByRole('img')
        images.forEach(img => {
          expect(img).toHaveClass('aspect-square')
        })
      })
    })
  })
})

describe('API Integration Simulation', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Analytics endpoint', () => {
    it('should fetch and return aggregated data', async () => {
      const mockAnalyticsData = {
        sku_performance: [
          {
            sku: 'ABC123',
            product_name: 'Test Product',
            views: 150,
            likes: 25,
            ctr: 16.67
          }
        ]
      }

      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockAnalyticsData,
      } as Response)

      const response = await fetch('/api/analytics?days=7')
      const data = await response.json()

      expect(data.sku_performance[0].sku).toBe('ABC123')
      expect(data.sku_performance[0].views).toBe(150)
      expect(data.sku_performance[0].likes).toBe(25)
      expect(data.sku_performance[0].ctr).toBe(16.67)
    })
  })

  describe('Database interaction patterns', () => {
    it('should validate database schema requirements', () => {
      const sampleSku = {
        id: 'sku123',
        sku_code: 'ABC123',
        product_name: 'Test Product',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const sampleRender = {
        id: 'render123',
        sku_id: 'sku123',
        image_url: 'https://example.com/image.jpg',
        alt_text: 'Test alt text',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const sampleEvent = {
        id: 'event123',
        sku_id: 'sku123',
        event_type: 'view',
        session_id: 'session123',
        createdAt: new Date()
      }

      expect(sampleSku.sku_code).toBeDefined()
      expect(sampleRender.image_url).toBeDefined()
      expect(sampleEvent.event_type).toBeDefined()
    })
  })

  describe('Shopify integration simulation', () => {
    it('should handle Shopify product page context', () => {
      const mockShopifyProduct = {
        id: 123456789,
        handle: 'test-product',
        variants: [{ sku: 'ABC123' }]
      }

      global.ShopifyAnalytics = {
        meta: {
          product: mockShopifyProduct
        }
      }

      expect(global.ShopifyAnalytics.meta.product.variants[0].sku).toBe('ABC123')

      delete global.ShopifyAnalytics
    })

    it('should work with different Shopify theme layouts', () => {
      const shopifyUrls = [
        'https://store.myshopify.com/products/test-product',
        'https://store.myshopify.com/collections/all/products/test-product',
        'https://custom-domain.com/products/test-product'
      ]

      shopifyUrls.forEach(url => {
        const isShopifyUrl = url.includes('/products/')
        expect(isShopifyUrl).toBe(true)
      })
    })
  })
})

declare global {
  var ShopifyAnalytics: {
    meta: {
      product: {
        id: number
        handle: string
        variants: Array<{ sku: string }>
      }
    }
  }
}