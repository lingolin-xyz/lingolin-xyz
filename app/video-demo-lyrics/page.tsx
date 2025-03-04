import { Noto_Sans } from "next/font/google"

import BlurryEntrance from "@/components/BlurryEntrance"
import { MarkdownRendererPlain } from "@/components/MarkdownRendererPlain"
import AudioPlayer from "@/components/AudioPlayer"

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const VideoDemoLyrics = () => {
  return (
    <BlurryEntrance>
      <div className={notoSans.className}>
        <div className="flex flex-col gap-4 text-3xl font-semibold max-w-4xl mx-auto w-full bg-orange-100/60 rounded-2xl p-6 my-6 md:px-14 md:py-8">
          <div>
            <div>
              <div className="space-y-8">
                <div className="flex flex-col gap-2">
                  <div>I&apos;m working on a Chrome extension</div>
                  <div>(Estoy trabajando en una extensión de Chrome)</div>
                </div>
                <div className="flex flex-col gap-2">
                  <div>To use it, you select the text and press the "T"</div>
                  <div>(Para usarla, selecciona el texto y pulsa "T")</div>
                </div>
                <div className="flex flex-col gap-2">
                  <div>It&apos;s so easy and fast, just wait and see</div>
                  <div>(Es tan fácil y rápida, solo espera y verás)</div>
                </div>
                <div className="flex flex-col gap-2">
                  <div>Now you can read the world effortlessly</div>
                  <div>(Ahora puedes leer el mundo sin esfuerzo)</div>
                </div>

                <div className="flex flex-col gap-2">
                  <div>I found a post in German, what does it mean?</div>
                  <div>
                    (Ich habe einen Beitrag auf Deutsch gefunden, was bedeutet
                    das?)
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div>With one click, it&apos;s now so clear to me</div>
                  <div>(Mit einem Klick ist es jetzt so klar für mich!)</div>
                </div>
                <div className="flex flex-col gap-2">
                  <div>A tweet in French? That&apos;s no mystery</div>
                  <div>
                    (Un tweet en français? Ce n&apos;est plus un mystère!)
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div>Now I know what they&apos;re saying everywhere</div>
                  <div>
                    (Maintenant, je sais ce qu&apos;ils disent partout!)
                  </div>
                </div>
                <div>[Chorus] Lingolin, Lingolin, let the words begin!</div>
                <div>(Lingolin, Lingolin, que les mots commencent!)</div>

                <div>No more borders, just tap and win</div>
                <div>(もう国境はないよ, タップするだけで勝ち!)</div>

                <div>From Tokyo streets to the Paris scene</div>
                <div>(Dari jalanan Tokyo ke suasana Paris!)</div>

                <div>Understand the world with Lingolin!</div>
                <div>(¡Entiende el mundo con Lingolin!)</div>

                <div>[Verse 3] A menu in Japan? I need some help!</div>
                <div>(日本のメニュー？助けが必要だ！)</div>

                <div>Now I know it&apos;s ramen, not something else</div>
                <div>(今はラーメンだとわかる、他のものじゃない！)</div>

                <div>A review in Indonesian, what do they say?</div>
                <div>
                  (Sebuah ulasan dalam bahasa Indonesia, apa yang mereka
                  katakan?)
                </div>

                <div>It&apos;s five stars! I&apos;ll eat there today</div>
                <div>(Bintang lima! Aku akan makan di sana hari ini!)</div>

                <div>Emails in languages I don&apos;t understand?</div>
                <div>(E-mails in Fremdsprachen? Ich verstehe sie nicht!)</div>

                <div>Lingolin translates them just like that!</div>
                <div>(Lingolin übersetzt sie einfach so!)</div>

                <div>From Berlin, Jakarta, Tokyo, and Spain</div>
                <div>(De Berlin, Jakarta, Tokyo y España)</div>

                <div>Now every language feels the same</div>
                <div>(Jetzt fühlt sich jede Sprache gleich an!)</div>

                <div>[Chorus] Lingolin, Lingolin, let the words begin!</div>
                <div>(Lingolin, Lingolin, que les mots commencent!)</div>

                <div>No more borders, just tap and win</div>
                <div>(もう国境はないよ, タップするだけで勝ち!)</div>

                <div>From Tokyo streets to the Paris scene</div>
                <div>(Dari jalanan Tokyo ke suasana Paris!)</div>

                <div>Understand the world with Lingolin!</div>
                <div>(¡Entiende el mundo con Lingolin!)</div>

                <div>[Outro] Now I&apos;m reading books in any tongue</div>
                <div>(Ahora leo libros en cualquier lengua)</div>

                <div>Learning a language has never been this fun</div>
                <div>(Aprender idiomas nunca fue tan divertido!)</div>

                <div>Just one key, and I can see</div>
                <div>(Solo una tecla, y puedo ver)</div>

                <div>The world in perfect harmony!</div>
                <div>(¡El mundo en perfecta armonía!)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BlurryEntrance>
  )
}

export default VideoDemoLyrics
