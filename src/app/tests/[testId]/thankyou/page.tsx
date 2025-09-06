
'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl max-w-md w-full p-8 text-center border border-gray-200">
        {/* Icon */}
        <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          🎉 Test Submitted!
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Thank you for completing the test. Your answers have been successfully submitted. You can view your results once they are processed.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/tests')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Go to Tests
          </button>

          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Home
          </button>
        </div>

        {/* Footer */}
        <p className="text-gray-400 text-sm mt-6">
          Need help? Contact support@example.com
        </p>
      </div>
    </div>
  );
}
