'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface IErrorComponentProps {
  error: { message?: string; stack?: string }
  reset: () => void
}

export default function ErrorComponent({ error, reset }: IErrorComponentProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-lg border border-red-200 dark:border-red-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-700 dark:text-red-400">Something Went Wrong</CardTitle>
        </CardHeader>

        <CardContent>
          <Alert variant="destructive" className="mb-4 dark:bg-red-900/30 dark:text-red-300">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error?.message || 'An unexpected error occurred.'}</AlertDescription>
          </Alert>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md text-xs font-mono overflow-auto max-h-32 text-gray-700 dark:text-gray-200">
            {error?.stack ? <pre>{error.stack}</pre> : <p className="text-gray-500 dark:text-gray-400 text-center">No additional error details available.</p>}
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => reset?.()}>
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
