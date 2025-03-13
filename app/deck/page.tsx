"use client"

import { useEffect } from "react"

const MusicPage = () => {
  useEffect(() => {
    window.location.href = "/deck.pdf"
  }, [])
  return <div></div>
}

export default MusicPage
