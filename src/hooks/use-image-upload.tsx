import { useState } from 'react'

interface UploadResponse {
  imageUrl: string
  fileName: string
  remotePath?: string
}

interface UseImageUploadOptions {
  apiUrl?: string
  remotePath?: string
  onSuccess?: (data: UploadResponse) => void
  onError?: (error: Error) => void
}

/**
 * Hook for uploading and managing images through the backend API
 *
 * All images are uploaded and served through the backend, which:
 * - Handles Azure authentication
 * - Proxies images from Azure storage
 * - Prevents direct access to Azure blob URLs
 */
export function useImageUpload(options: UseImageUploadOptions = {}) {
  const {
    apiUrl = 'http://localhost:3000',
    remotePath,
    onSuccess,
    onError,
  } = options

  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

  /**
   * Upload an image file to Azure storage through the backend
   */
  const uploadImage = async (file: File, customRemotePath?: string) => {
    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      if (customRemotePath || remotePath) {
        formData.append('remotePath', customRemotePath || remotePath || '')
      }

      const response = await fetch(`${apiUrl}/api/images/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const data: UploadResponse = await response.json()

      // Convert relative URL to absolute URL
      const fullImageUrl = data.imageUrl.startsWith('http')
        ? data.imageUrl
        : `${apiUrl}${data.imageUrl}`

      setUploadedImageUrl(fullImageUrl)

      if (onSuccess) {
        onSuccess({ ...data, imageUrl: fullImageUrl })
      }

      return { ...data, imageUrl: fullImageUrl }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Upload failed')
      setError(error.message)

      if (onError) {
        onError(error)
      }

      throw error
    } finally {
      setUploading(false)
    }
  }

  /**
   * Get the full URL for viewing an image through the backend
   * This ensures all image requests go through the authenticated backend
   */
  const getImageUrl = (fileName: string, path?: string): string => {
    const imagePath = path ? `${path}/${fileName}` : fileName
    return `${apiUrl}/api/images/view/${imagePath}`
  }

  /**
   * Reset the upload state
   */
  const reset = () => {
    setUploadedImageUrl(null)
    setError(null)
    setUploading(false)
  }

  return {
    uploadImage,
    getImageUrl,
    reset,
    uploading,
    error,
    uploadedImageUrl,
  }
}
