'use client'

import { useState, useEffect, useRef } from 'react'

type BusinessImage = {
  id: string
  url: string
  position: number
}

export default function ImageUploader({ businessId }: { businessId: string }) {
  const [images, setImages] = useState<BusinessImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadImages()
  }, [businessId])

  const loadImages = async () => {
    const res = await fetch(`/api/admin/images?businessId=${businessId}`)
    const data = await res.json()
    setImages(data.images || [])
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    setError('')
    setUploading(true)

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed')
        continue
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Max file size is 5MB')
        continue
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('businessId', businessId)
      formData.append('action', 'upload')

      const res = await fetch('/api/admin/images', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      }
    }

    await loadImages()
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDelete = async (img: BusinessImage) => {
    if (!confirm('Delete this image?')) return

    const formData = new FormData()
    formData.append('action', 'delete')
    formData.append('imageId', img.id)
    formData.append('url', img.url)

    await fetch('/api/admin/images', { method: 'POST', body: formData })
    await loadImages()
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-500 font-medium">
          Images ({images.length}/10)
        </p>
        <label className={`text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
          uploading || images.length >= 10
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
        }`}>
          {uploading ? 'Uploading...' : '+ Add images'}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={uploading || images.length >= 10}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

      {images.length > 0 ? (
        <div className="grid grid-cols-5 gap-2">
          {images.map(img => (
            <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleDelete(img)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-gray-400 text-center py-4 bg-gray-50 rounded-lg">
          No images yet
        </div>
      )}
    </div>
  )
}
