import BlurryEntranceFaster from "./BlurryEntranceFaster"

const LandingWhileLoading = () => {
  return (
    <div className="p-6 py-20 max-w-7xl mx-auto w-full flex items-center justify-center fixed inset-0 bg-white">
      <BlurryEntranceFaster>
        <img
          src="/images/toucan-meow.png"
          alt="Toucan Meow"
          className="w-80 md:w-full max-w-lg"
        />
      </BlurryEntranceFaster>
    </div>
  )
}

export default LandingWhileLoading
