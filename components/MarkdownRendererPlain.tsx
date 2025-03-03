import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  ARenderer,
  h1Renderer,
  h2Renderer,
  h3Renderer,
  liRenderer,
  pRenderer,
  ulRenderer,
  emRenderer,
  emRendererForHaikuTweets,
} from "./renderers-plane"

export const MarkdownRendererPlain = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <Markdown
      components={{
        ul: ulRenderer,
        li: liRenderer,
        h1: h1Renderer,
        h2: h2Renderer,
        h3: h3Renderer,
        p: pRenderer,
        a: ARenderer,
        em: children
          ? typeof children === "string"
            ? children.includes("haiku")
              ? emRendererForHaikuTweets
              : emRenderer
            : emRenderer
          : emRenderer,
      }}
      remarkPlugins={[remarkGfm]}
    >
      {processContent(children as string)}
    </Markdown>
  )
}

const processContent = (text: string) => {
  const textWithoutBRs = text.replace(
    /<br\/>/g,
    `

`
  )
  return textWithoutBRs.replace(
    /lens\/(\w+)/g,
    "[https://hey.xyz/u/$1](https://hey.xyz/u/$1)"
  )
}
