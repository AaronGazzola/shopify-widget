import { LifestyleWidget } from './LifestyleWidget'
import { Suspense } from 'react'

interface WidgetPageProps {
  searchParams: { sku?: string; embed?: string }
}

export default function WidgetPage({ searchParams }: WidgetPageProps) {
  const sku = searchParams.sku || 'ABC123'
  const isEmbed = searchParams.embed === 'true'

  if (isEmbed) {
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>{`
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background: transparent;
            }
          `}</style>
        </head>
        <body>
          <div id="widget-root">
            <Suspense fallback={<div>Loading...</div>}>
              <LifestyleWidget sku={sku} />
            </Suspense>
          </div>

          <script>{`
            function resizeFrame() {
              const height = document.getElementById('widget-root').scrollHeight;
              if (window.parent && window.parent.postMessage) {
                window.parent.postMessage({
                  type: 'WIDGET_RESIZE',
                  height: height
                }, '*');
              }
            }

            window.addEventListener('load', resizeFrame);
            window.addEventListener('resize', resizeFrame);

            const observer = new MutationObserver(resizeFrame);
            observer.observe(document.body, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeOldValue: true
            });
          `}</script>
        </body>
      </html>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Lifestyle Widget Demo
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <LifestyleWidget sku={sku} />
        </Suspense>
      </div>
    </div>
  )
}