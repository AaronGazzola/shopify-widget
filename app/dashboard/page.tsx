"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

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

export default function DashboardPage() {
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-block text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Performance metrics for lifestyle widget interactions
          </p>
        </div>

        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Time Range</h2>
            <div className="flex gap-4">
              {[7, 30, 90].map((dayOption) => (
                <button
                  key={dayOption}
                  onClick={() => handleDaysChange(dayOption)}
                  className={`px-4 py-2 rounded ${
                    days === dayOption
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Last {dayOption} days
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            Error: {error}
          </div>
        )}

        {analytics && !loading && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">SKU Performance</h2>
            {analytics.sku_performance.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No data available for the selected time period.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">SKU</th>
                      <th className="px-4 py-2 text-left">Product Name</th>
                      <th className="px-4 py-2 text-right">Views</th>
                      <th className="px-4 py-2 text-right">Likes</th>
                      <th className="px-4 py-2 text-right">CTR (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.sku_performance.map((sku, index) => (
                      <tr key={sku.sku} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 font-mono text-sm">{sku.sku}</td>
                        <td className="px-4 py-2">{sku.product_name}</td>
                        <td className="px-4 py-2 text-right">{sku.views}</td>
                        <td className="px-4 py-2 text-right">{sku.likes}</td>
                        <td className="px-4 py-2 text-right">{sku.ctr.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Metrics Explained</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Views:</strong> Number of times the widget was loaded and viewed</li>
            <li><strong>Likes:</strong> Total number of likes received on lifestyle images</li>
            <li><strong>CTR (Click-Through Rate):</strong> Percentage of views that resulted in likes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}