"use client" // Indica que este es un Client Component

import React, { useEffect, useRef } from "react"
import Matter, {
  Engine,
  Render,
  World,
  Bodies,
  Mouse,
  MouseConstraint,
} from "matter-js"
import dynamic from "next/dynamic"

// Create the component first, then wrap it with dynamic
const BallGameComponent: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)

  useEffect(() => {
    if (!sceneRef.current) return

    // Crear el motor y el renderizador
    const engine = Engine.create()
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 330,
        height: 420,
        wireframes: false,
        background: "#f0f0f0",
      },
    })

    engineRef.current = engine
    renderRef.current = render

    // Crear el suelo
    const ground = Bodies.rectangle(190, 410, 390, 60, {
      isStatic: true,
      render: {
        fillStyle: "#333",
      },
    })

    // Crear varias bolas
    const balls = Array.from({ length: 5 }, (_, i) => {
      return Bodies.circle(100 + i * 150, 50, 30, {
        restitution: 0.7,
        friction: 0.1,
        render: {
          fillStyle: `hsl(${i * 60}, 70%, 50%)`,
        },
      })
    })

    // Añadir control del mouse
    const mouse = Mouse.create(render.canvas)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    })

    // Añadir todos los cuerpos al mundo
    World.add(engine.world, [ground, ...balls, mouseConstraint])

    // Usar requestAnimationFrame para el loop de animación
    let frameId: number

    const animate = () => {
      Engine.update(engine, 1000 / 60) // 60 FPS
      Render.world(render)
      frameId = requestAnimationFrame(animate)
    }

    // Iniciar la animación
    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId)
      Render.stop(render)
      World.clear(engine.world, false)
      Engine.clear(engine)
      render.canvas.remove()
    }
  }, [])

  return (
    <div
      ref={sceneRef}
      style={{
        width: "330px",
        height: "420px",
        margin: "0 auto",
      }}
    />
  )
}

// Correctly use dynamic to import the component
const BallGame = dynamic(() => Promise.resolve(BallGameComponent), {
  ssr: false,
})

export default BallGame
