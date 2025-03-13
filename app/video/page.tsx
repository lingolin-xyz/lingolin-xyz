"use client"

import { useEffect } from "react"

const MusicPage = () => {
  useEffect(() => {
    window.location.href = "/videos/final-demo.mp4"
  }, [])
  return <div></div>
}

export default MusicPage
