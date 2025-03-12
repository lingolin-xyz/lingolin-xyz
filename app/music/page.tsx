"use client"

import { SPOTIFY_ALBUM_URL } from "@/lib/constants"
import { useEffect } from "react"

const MusicPage = () => {
  useEffect(() => {
    window.location.href = SPOTIFY_ALBUM_URL
  }, [])
  return <div></div>
}

export default MusicPage
