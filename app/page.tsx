import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shopify AI Lifestyle Widget Demo
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Showcase lifestyle images with interactive like functionality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Widget Demo</h2>
            <p className="text-gray-600 mb-4">
              Experience the lifestyle widget with sample products. Note: You'll need to set up the database and add sample data first.
            </p>
            <Link
              href="/demo"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              View Widget Demo
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
            <p className="text-gray-600 mb-4">
              View performance metrics and interaction analytics for your lifestyle images.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Set up your Supabase project and get the connection details</li>
            <li>Update your .env file with the Supabase credentials</li>
            <li>Run <code className="bg-gray-100 px-2 py-1 rounded">npx prisma db push</code> to create the database schema</li>
            <li>Add sample data to test the widget functionality</li>
            <li>Test the widget demo and dashboard</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
