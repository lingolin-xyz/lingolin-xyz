import HugeTitle from "@/components/HugeTitle"
import Title from "@/components/Title"
import { getAllTranslations } from "@/lib/nillion/utils"

const TranslationsPage = async () => {
  const translations = await getAllTranslations()
  return (
    <div className="flex flex-col gap-3 py-8 max-w-6xl mx-auto items-center justify-center">
      <Title>Translations ({translations.length})</Title>

      <div className="flex flex-col gap-3 bg-yellow-100 max-w-3xl p-4 rounded-xl mx-auto">
        <div className="flex items-center gap-3 justify-center">
          <div className="w-24 px-2 font-bold">From</div>
          <div className="w-24 px-2 font-bold">To</div>
          <div className="w-60 px-2 font-bold">Message</div>
          <div className="w-60 px-2 font-bold">Translation</div>
        </div>

        {translations.map((translation: any) => (
          <div
            key={translation._id}
            className="flex items-center gap-3 justify-center"
          >
            <div className="w-24 px-2 hello">{translation.fromLanguage}</div>
            <div className="w-24 px-2 hello">{translation.toLanguage}</div>
            <div className="w-60 px-2 hello">{translation.message}</div>
            <div className="w-60 px-2 hello">{translation.translation}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TranslationsPage
