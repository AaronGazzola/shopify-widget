"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/shadcn.utils"

interface SkuPerformance {
  sku: string
  product_name: string
  views: number
  likes: number
  ctr: number
}

interface AnalyticsData {
  sku_performance: SkuPerformance[]
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async (daysParam: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/analytics?days=${daysParam}`)

      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(days)
  }, [days])

  const handleDaysChange = (newDays: number) => {
    setDays(newDays)
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium text-zinc-900 mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-zinc-600">
              Performance metrics for lifestyle widget interactions
            </p>
          </div>
          <Link
            href="/demo"
            className={cn(
              "inline-flex items-center px-4 py-2 text-sm font-medium",
              "text-white bg-zinc-900 border border-zinc-900 rounded-md",
              "hover:bg-zinc-800 transition-colors"
            )}
          >
            View Widget Demo
          </Link>
        </div>

        <div className="mb-8">
          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <h2 className="text-lg font-medium text-zinc-900 mb-4">Time Range</h2>
            <div className="flex gap-3">
              {[7, 30, 90].map((dayOption) => (
                <button
                  key={dayOption}
                  onClick={() => handleDaysChange(dayOption)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md border transition-colors",
                    days === dayOption
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50"
                  )}
                >
                  Last {dayOption} days
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-zinc-300 border-t-zinc-900"></div>
            <p className="mt-4 text-zinc-600">Loading analytics...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-8">
            Error: {error}
          </div>
        )}

        {analytics && !loading && (
          <div className="bg-white rounded-lg border border-zinc-200">
            <div className="px-6 py-4 border-b border-zinc-200">
              <h2 className="text-lg font-medium text-zinc-900">SKU Performance</h2>
            </div>
            <div className="p-6">
              {analytics.sku_performance.length === 0 ? (
                <p className="text-zinc-600 text-center py-12">
                  No data available for the selected time period.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="pb-3 text-sm font-medium text-zinc-700">SKU</th>
                        <th className="pb-3 text-sm font-medium text-zinc-700">Product Name</th>
                        <th className="pb-3 text-sm font-medium text-zinc-700 text-right">Views</th>
                        <th className="pb-3 text-sm font-medium text-zinc-700 text-right">Likes</th>
                        <th className="pb-3 text-sm font-medium text-zinc-700 text-right">CTR (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {analytics.sku_performance.map((sku) => (
                        <tr key={sku.sku} className="hover:bg-zinc-50">
                          <td className="py-3 text-sm font-mono text-zinc-900">{sku.sku}</td>
                          <td className="py-3 text-sm text-zinc-900">{sku.product_name}</td>
                          <td className="py-3 text-sm text-zinc-900 text-right">{sku.views}</td>
                          <td className="py-3 text-sm text-zinc-900 text-right">{sku.likes}</td>
                          <td className="py-3 text-sm text-zinc-900 text-right">{sku.ctr.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg border border-zinc-200 p-6">
          <h2 className="text-lg font-medium text-zinc-900 mb-4">Metrics Explained</h2>
          <ul className="space-y-2 text-sm text-zinc-600">
            <li><span className="font-medium text-zinc-900">Views:</span> Number of times the widget was loaded and viewed</li>
            <li><span className="font-medium text-zinc-900">Likes:</span> Total number of likes received on lifestyle images</li>
            <li><span className="font-medium text-zinc-900">CTR (Click-Through Rate):</span> Percentage of views that resulted in likes</li>
          </ul>
        </div>

      </div>
    </div>
  )
}
