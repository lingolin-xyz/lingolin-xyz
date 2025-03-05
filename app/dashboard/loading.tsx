import BlurryEntrance from "@/components/BlurryEntrance"
import { ImSpinner8 } from "react-icons/im"

const Loading = () => {
  return (
    <div className="w-full py-32 flex items-center justify-center">
      <BlurryEntrance>
        <div className="w-10 h-10 bg-indigo-100 rounded-full animate-pulse flex items-center justify-center">
          <div className="animate-spin text-2xl">
            <ImSpinner8 />
          </div>
        </div>
      </BlurryEntrance>
    </div>
  )
}

export default Loading
