"use client"

import NewPlayground from "./NewPlayground"
import DragToTranscribe from "./DragToTranscribe"

const PlaygroundAndDragImage = () => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-8">
      <div className="md:w-1/2 w-full p-2">
        <NewPlayground />
      </div>
      <div className="md:w-1/2 w-full p-2">
        <DragToTranscribe />
      </div>
    </div>
  )
}

export default PlaygroundAndDragImage
