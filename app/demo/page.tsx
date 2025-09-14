"use client";

import { cn } from "@/lib/shadcn.utils";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    LifestyleWidget?: {
      init: () => void;
      load: (sku: string, containerId: string) => void;
    };
  }
}

interface Product {
  sku: string;
  name: string;
  description: string;
}

const mockProducts: Product[] = [
  {
    sku: "ABC123",
    name: "Premium Wireless Headphones",
    description: "High-quality audio with noise cancellation",
  },
  {
    sku: "DEF456",
    name: "Smart Fitness Watch",
    description: "Track your health and fitness goals",
  },
  {
    sku: "JKL012",
    name: "Minimalist Laptop Bag",
    description: "Stylish protection for your devices",
  },
];

export default function DemoPage() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  const initializeWidgets = () => {
    if (window.LifestyleWidget) {
      mockProducts.forEach((product) => {
        const container = document.getElementById(
          `lifestyle-widget-${product.sku}`
        );
        if (container) {
          window.LifestyleWidget?.load(
            product.sku,
            `lifestyle-widget-${product.sku}`
          );
        }
      });
    }
  };

  useEffect(() => {
    if (scriptLoaded) {
      setTimeout(initializeWidgets, 100);
    }
  }, [scriptLoaded]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Script
        src="/widget.js"
        strategy="lazyOnload"
        onLoad={() => {
          setScriptLoaded(true);
          setScriptError(false);
        }}
        onError={() => {
          setScriptError(true);
          setScriptLoaded(false);
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium text-zinc-900 mb-2">
              Widget Demo
            </h1>
            <p className="text-zinc-600">
              Experience the lifestyle widget with sample products
            </p>
          </div>
          <Link
            href="/"
            className={cn(
              "inline-flex items-center px-4 py-2 text-sm font-medium",
              "text-white bg-zinc-900 border border-zinc-900 rounded-md",
              "hover:bg-zinc-800 transition-colors"
            )}
          >
            Back to Dashboard
          </Link>
        </div>

        {scriptError && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-8">
            Error: Failed to load widget script
          </div>
        )}

        <div className="mb-8 bg-white rounded-lg border border-zinc-200 p-6">
          <h2 className="text-lg font-medium text-zinc-900 mb-4">
            About This Demo
          </h2>
          <p className="text-zinc-600 mb-4">
            This demonstration shows how the lifestyle widget integrates with
            different products. Each widget displays lifestyle images related to
            the specific product SKU.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProducts.map((product) => (
            <div
              key={product.sku}
              className="bg-white rounded-lg border border-zinc-200 overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-200">
                <h3 className="text-lg font-medium text-zinc-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-sm text-zinc-600 mb-2">
                  {product.description}
                </p>
                <p className="text-xs font-mono text-zinc-500">
                  SKU: {product.sku}
                </p>
              </div>

              <div className="p-6">
                <div
                  id={`lifestyle-widget-${product.sku}`}
                  data-lifestyle-widget
                  data-sku={product.sku}
                  data-api-url={
                    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
                  }
                  className="lifestyle-widget-container"
                  style={{ maxWidth: "100%", margin: "0", padding: "0" }}
                >
                  <div className="lifestyle-widget-loading text-center py-8 text-zinc-600">
                    {scriptLoaded
                      ? "Loading lifestyle images..."
                      : "Loading widget..."}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg border border-zinc-200 p-6">
          <h2 className="text-lg font-medium text-zinc-900 mb-4">
            Integration Instructions
          </h2>
          <div className="space-y-4 text-sm text-zinc-600">
            <div className="text-center">
              <h3 className="font-medium text-zinc-900 mb-2">
                Shopify Integration
              </h3>
              <p className="mb-4">
                To integrate this widget into your Shopify store, follow the
                instructions in the SHOPIFY_INTEGRATION.md file.
              </p>
              <a
                href={process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center justify-center px-6 py-3 text-base",
                  "text-blue-800 bg-white border border-blue-800 rounded-md",
                  "hover:bg-blue-900 hover:text-white transition-colors"
                )}
              >
                View live demo (password required)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
