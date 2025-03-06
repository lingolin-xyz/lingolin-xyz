"use client"

import NewPlayground from "./NewPlayground"
import DragToTranscribe from "./DragToTranscribe"
import { User } from "@privy-io/react-auth"

const PlaygroundAndDragImage = ({ user }: { user: User }) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-8">
      <div className="md:w-1/2 w-full p-2">
        <NewPlayground />
      </div>
      <div className="md:w-1/2 w-full p-2">
        <DragToTranscribe user={user} />
      </div>
    </div>
  )
}

export default PlaygroundAndDragImage
