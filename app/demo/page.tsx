"use client"

import { LifestyleWidget } from "@/app/widget/LifestyleWidget"
import Link from "next/link"
import { cn } from "@/lib/shadcn.utils"

export default function DemoPage() {
  const sampleSkus = ["ABC123", "DEF456", "JKL012"]

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium text-zinc-900 mb-2">
              Widget Demo
            </h1>
            <p className="text-zinc-600">
              Test the lifestyle widget with sample SKUs
            </p>
          </div>
          <Link
            href="/"
            className={cn(
              "inline-flex items-center px-4 py-2 text-sm font-medium",
              "text-zinc-700 bg-white border border-zinc-300 rounded-md",
              "hover:bg-zinc-50 transition-colors"
            )}
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sampleSkus.map((sku) => (
            <div key={sku} className="bg-white rounded-lg border border-zinc-200 p-6">
              <h3 className="text-lg font-medium text-zinc-900 mb-4 text-center">
                Product SKU: {sku}
              </h3>
              <LifestyleWidget sku={sku} />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-zinc-200 p-6">
          <h2 className="text-lg font-medium text-zinc-900 mb-4">How it works</h2>
          <ul className="space-y-2 text-sm text-zinc-600">
            <li><span className="font-medium text-zinc-900">•</span> Each widget fetches 2 lifestyle images for the given SKU</li>
            <li><span className="font-medium text-zinc-900">•</span> Users can like images with the heart icon</li>
            <li><span className="font-medium text-zinc-900">•</span> Like counts are displayed and persist across sessions</li>
            <li><span className="font-medium text-zinc-900">•</span> View and like events are tracked in the database</li>
            <li><span className="font-medium text-zinc-900">•</span> Images are displayed in a responsive 2-column grid</li>
          </ul>
        </div>
      </div>
    </div>
  )
}