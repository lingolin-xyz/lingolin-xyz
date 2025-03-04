import Link from "next/link"

const Footer = () => {
  return (
    <div className="border-t p-4 space-y-2 text-xs">
      <div className="flex flex-col md:flex-row md:justify-between space-y-2 md:space-y-0">
        <div className="flex flex-col space-y-2">
          <div>
            Lingolin is a project for the{" "}
            <Link
              className="text-indigo-500 font-semibold hover:text-indigo-400 active:opacity-60 transition-all duration-100"
              href="https://hackathon.monad.xyz/"
              target="_blank"
            >
              Monad evm/accathon
            </Link>
          </div>
          <div>
            Built by{" "}
            <Link
              className="text-indigo-500 font-semibold hover:text-indigo-400 active:opacity-60 transition-all duration-100"
              href="https://x.com/javitoshi"
              target="_blank"
            >
              javi
            </Link>{" "}
            &amp;{" "}
            <Link
              target="_blank"
              className="text-indigo-500 font-semibold hover:text-indigo-400 active:opacity-60 transition-all duration-100"
              href="https://x.com/0xhirugohan"
            >
              hirugohan
            </Link>{" "}
            in Feb/Mar 2025
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <div>
              <Link
                className="text-indigo-500 font-semibold hover:text-indigo-400 active:opacity-60 transition-all duration-100"
                href="/contact"
              >
                Contact Us
              </Link>
            </div>
            <div>·</div>
            <div>
              <Link
                className="text-indigo-500 font-semibold hover:text-indigo-400 active:opacity-60 transition-all duration-100"
                href="/privacy-policy"
              >
                Privacy Policy
              </Link>
            </div>
            <div>·</div>
            <div>
              <Link
                className="text-indigo-500 font-semibold hover:text-indigo-400 active:opacity-60 transition-all duration-100"
                href="/terms-and-conditions"
              >
                Terms and Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
