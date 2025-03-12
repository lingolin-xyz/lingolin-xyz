"use client"

import BlurryEntrance from "@/components/BlurryEntrance"
import { useToast } from "@/hooks/use-toast"
import { TWITTER_LINK } from "@/lib/constants"

const Contact = () => {
  const { toast } = useToast()
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
    })
  }

  return (
    <BlurryEntrance>
      <div className="py-6 max-w-4xl font-granstander mx-auto w-full bg-yellow-50/60 rounded-xl p-6 my-6 md:px-14 md:py-8">
        <h1 className="text-3xl font-bold mb-8">Contact Us</h1>

        <p className="mb-6">
          Have questions about Lingolin? We&apos;re here to help. Choose your
          preferred way to reach us:
        </p>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Email</h2>
            <p>
              For general inquiries:{" "}
              <span
                onClick={() => copyToClipboard("hellolingolin@gmail.com")}
                className="text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                hellolingolin@gmail.com
              </span>
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Social Media</h2>
            <div className="space-y-3">
              <p>
                <span className="font-medium">
                  Twitter (Official account):{" "}
                </span>
                <a
                  href={TWITTER_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  @hellolingolin
                </a>
              </p>
              <p>
                <span className="font-medium">
                  Twitter (Accounts from the developers):{" "}
                </span>
                <a
                  href="https://twitter.com/javitoshi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  @javitoshi
                </a>{" "}
                <a
                  href="https://twitter.com/0xhirugohan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  @0xhirugohan
                </a>
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Response Time</h2>
            <p>
              We typically respond within 24-48 hours during business days. For
              faster responses, we recommend joining our Discord community where
              our team and other users are often available.
            </p>
          </div>
        </div>
      </div>
    </BlurryEntrance>
  )
}

export default Contact
