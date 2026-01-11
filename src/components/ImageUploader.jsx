import { useRef } from 'react'
import { Camera, Upload, RefreshCw, Image as ImageIcon } from 'lucide-react'
import { Button } from './ui/button'

export default function ImageUploader({ onImageSelect, preview }) {
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onImageSelect(file)
  }

  return (
    <div className="space-y-4">
      {!preview ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-green-300 p-8 text-center shadow-sm">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-10 h-10 text-green-600" />
          </div>

          <p className="text-gray-600 mb-6 text-lg">
            Choose a clear photo of your guava leaf or fruit
          </p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => cameraInputRef.current.click()}
              className="h-14 text-lg bg-green-600 hover:bg-green-700 rounded-2xl"
            >
              <Camera className="w-6 h-6 mr-3" />
              Take Photo
            </Button>

            <Button
              variant="outline"
              onClick={() => fileInputRef.current.click()}
              className="h-14 text-lg border-2 border-green-600 text-green-700 rounded-2xl"
            >
              <Upload className="w-6 h-6 mr-3" />
              Choose from Gallery
            </Button>
          </div>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative">
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-4 border-white">
            <img src={preview} alt="Selected" className="w-full h-64 object-cover" />
          </div>

          <Button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-4 right-4 bg-white text-green-700 rounded-full shadow-lg px-4"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Change
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      <p className="text-center text-sm text-gray-500">
        📸 Tip: Use good lighting for better results
      </p>
    </div>
  )
}
