import "./globals.css";

import { Grandstander } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import NoiseLayer from "@/components/NoiseLayer";
import Header from "@/components/Header";
import PrivyProviders from "@/components/auth/PrivyProviders";

const grandstander = Grandstander({
  subsets: ["latin"],
  variable: "--font-grandstander",
});

export const generateMetadata = async () => {
  const ogImage = `https://lingolin.xyz/thumbnail.png`;

  const images = [ogImage];

  const appName = "lingolin";
  const theTitle = `Lingolin`;
  const theDescription = "world word web";

  return {
    title: theTitle,
    description: theDescription,
    applicationName: appName,
    referrer: "origin-when-cross-origin",
    keywords: ["ai", "agents", "onchain", "culture"],
    authors: [{ name: "Javi", url: "https://lingolin.xyz" }],
    creator: "@hellolingolin",
    publisher: "@hellolingolin",
    metadataBase: new URL("https://lingolin.xyz"),
    openGraph: {
      images: images,
      title: theTitle,
      description: theDescription,
      url: `https://lingolin.xyz`,
      siteName: appName,
      locale: "en_US",
      type: "website",
    },
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${grandstander.className} ${grandstander.variable} antialiased selection:bg-emerald-300 selection:text-black`}
      >
        <div className="max-w-7xl mx-auto">
          <NoiseLayer />
          <PrivyProviders>
            <div className="p-4 max-w-7xl mx-auto">
              <Header />
              {children}
            </div>
          </PrivyProviders>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
