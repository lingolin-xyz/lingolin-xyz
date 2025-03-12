"use client" // Indica que este es un Client Component

import React, { useEffect, useRef } from "react"
import Matter, {
  Engine,
  Render,
  World,
  Bodies,
  Mouse,
  MouseConstraint,
  Events,
} from "matter-js"
import dynamic from "next/dynamic"

// Create the component first, then wrap it with dynamic
const BallGameComponent: React.FC<{
  value: number
  label: false | string
  image: string
  scaleFactor: number
}> = ({ value = 1, label = false, image = "", scaleFactor = 1 }) => {
  const sceneRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)
  const ballsRef = useRef<Matter.Body[]>([])
  const prevValueRef = useRef(0)

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
        background: "#ffffff",
      },
    })

    engineRef.current = engine
    renderRef.current = render

    const THICKNESS = 13
    // Crear el suelo
    const ground = Bodies.rectangle(190, 420, 390, THICKNESS, {
      isStatic: true,
      render: {
        fillStyle: "#333",
      },
      chamfer: { radius: 6 },
    })

    // Crear paredes laterales
    const leftWall = Bodies.rectangle(0, 210, THICKNESS, 420, {
      isStatic: true,
      render: {
        fillStyle: "#333",
      },
      chamfer: { radius: 4 },
    })

    const rightWall = Bodies.rectangle(330, 210, THICKNESS, 420, {
      isStatic: true,
      render: {
        fillStyle: "#333",
      },
      chamfer: { radius: 4 },
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

    // Añadir el suelo, las paredes y el control del mouse al mundo
    World.add(engine.world, [ground, leftWall, rightWall, mouseConstraint])

    // Usar requestAnimationFrame para el loop de animación
    let frameId: number

    const animate = () => {
      Engine.update(engine, 1000 / 60) // 60 FPS
      Render.world(render)
      frameId = requestAnimationFrame(animate)
    }

    // Iniciar la animación
    animate()

    // Add custom rendering for text
    render.options.wireframes = false

    // Define a more specific type for the renderer
    interface RenderWithRenderer extends Matter.Render {
      context: CanvasRenderingContext2D
    }

    const typedRender = render as RenderWithRenderer

    // Use the render.afterRender callback instead of trying to override the renderer
    Events.on(render, "afterRender", () => {
      const context = render.context

      ballsRef.current.forEach((ball) => {
        if (ball.label) {
          const { x, y } = ball.position

          // Set text properties
          context.font = "bold 32px Grandstander"

          // Add a rounded background
          const textWidth = context.measureText(ball.label).width
          const padding = 12
          const bgHeight = 26
          const bottomPadding = 4 // Add extra padding at the bottom

          // Draw rounded background
          context.fillStyle = "#ffffffbb"
          context.beginPath()
          context.roundRect(
            x - textWidth / 2 - padding,
            y - bgHeight / 2 - bottomPadding / 2, // Shift up slightly to center text
            textWidth + padding * 2,
            bgHeight + bottomPadding, // Increase height with bottom padding
            8 // border radius
          )
          context.fill()

          // Add border to background
          context.strokeStyle = "#333"
          context.lineWidth = 2
          context.stroke()

          // Draw text
          context.fillStyle = "#000"
          context.textAlign = "center"
          context.textBaseline = "middle"
          context.fillText(ball.label, x, y)
        }
      })
    })

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId)
      Render.stop(render)
      World.clear(engine.world, false)
      Engine.clear(engine)
      render.canvas.remove()
      ballsRef.current = []
    }
  }, [])

  // Efecto para manejar cambios en el valor
  useEffect(() => {
    if (!engineRef.current) return

    const currentValue = value
    const prevValue = prevValueRef.current

    // Si el valor actual es mayor que el anterior, añadir nuevas bolas
    if (currentValue > prevValue) {
      const newBallsCount = currentValue - prevValue

      // Crear nuevas bolas
      const newBalls = Array.from({ length: newBallsCount }, (_, i) => {
        return Bodies.circle(
          150 + Math.random() * 30, // Posición X aleatoria cerca del centro
          50, // Posición Y inicial (desde arriba)
          50, // Radio
          {
            restitution: 0.7,
            friction: 0.1,
            render: {
              sprite: {
                texture: image,
                xScale: scaleFactor, // Ajusta según necesites
                yScale: scaleFactor,
              },
            },
            label: `x${label}`,
          }
        )
      })

      // Añadir las nuevas bolas al mundo
      World.add(engineRef.current.world, newBalls)

      // Actualizar la referencia de bolas
      ballsRef.current = [...ballsRef.current, ...newBalls]
    }
    // Si el valor actual es menor que el anterior, eliminar bolas
    else if (currentValue < prevValue) {
      const ballsToRemove = ballsRef.current.slice(currentValue)

      // Eliminar las bolas del mundo
      World.remove(engineRef.current.world, ballsToRemove)

      // Actualizar la referencia de bolas
      ballsRef.current = ballsRef.current.slice(0, currentValue)
    }

    // Actualizar el valor anterior
    prevValueRef.current = currentValue
  }, [value, label])

  // useEffect para que si el label cambia, se actualice el texto de las bolas
  useEffect(() => {
    if (!engineRef.current) return

    ballsRef.current.forEach((ball) => {
      ball.label = `x${label}`
    })
  }, [label])

  // useEffect para que si el image cambia, se actualice la imagen de las bolas
  useEffect(() => {
    if (!engineRef.current) return

    ballsRef.current.forEach((ball) => {
      //   ball.image = image
      if (ball.render && ball.render.sprite) {
        ball.render.sprite.texture = image
      }
    })
  }, [image])

  // useEffect para que si el scaleFactor cambia, se actualice el tamaño de las bolas
  useEffect(() => {
    if (!engineRef.current) return

    ballsRef.current.forEach((ball) => {
      if (ball.render && ball.render.sprite) {
        ball.render.sprite.xScale = scaleFactor
        ball.render.sprite.yScale = scaleFactor
      }
    })
  }, [scaleFactor])

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
