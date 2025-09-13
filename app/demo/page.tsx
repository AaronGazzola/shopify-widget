"use client"

import { LifestyleWidget } from "@/app/widget/LifestyleWidget"
import Link from "next/link"

export default function DemoPage() {
  const sampleSkus = ["ABC123", "DEF456", "GHI789"]

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
            Widget Demo
          </h1>
          <p className="text-lg text-gray-600">
            Test the lifestyle widget with sample SKUs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleSkus.map((sku) => (
            <div key={sku} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Product SKU: {sku}
              </h3>
              <LifestyleWidget sku={sku} />
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">How it works</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Each widget fetches 2 lifestyle images for the given SKU</li>
            <li>Users can like images with the heart icon</li>
            <li>Like counts are displayed and persist across sessions</li>
            <li>View and like events are tracked in the database</li>
            <li>Images are displayed in a responsive 2-column grid</li>
          </ul>
        </div>
      </div>
    </div>
  )
}