import Link from "next/link"

const Footer = () => {
  return (
    <div className="border-t pt-4 px-4 space-y-2 text-xs">
      <div>
        Lingolin as a project idea for the{" "}
        <Link
          className="text-indigo-500 font-semibold hover:text-indigo-400 active:opacity-60 transition-all duration-100"
          href="https://hackathon.monad.xyz/"
          target="_blank"
        >
          Monad evh/accathon
        </Link>
      </div>
      <div>
        Built by{" "}
        <Link
          className="text-indigo-500 font-semibold hover:text-indigo-400 active:opacity-60 transition-all duration-100"
          href="https://github.com/javiezpeleta"
          target="_blank"
        >
          javi
        </Link>{" "}
        &amp;{" "}
        <Link
          target="_blank"
          className="text-indigo-500 font-semibold hover:text-indigo-400 active:opacity-60 transition-all duration-100"
          href="https://github.com/0xhirugohan"
        >
          hirugohan
        </Link>{" "}
        in Feb/Mar 2025
      </div>
    </div>
  )
}

export default Footer
