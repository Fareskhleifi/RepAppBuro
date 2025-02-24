import Calendrier from "../../Components/Calendrier/Calendrier";
import DefaultLayout from "../../layouts/DefaultLayout";

export default function CalendrierPage() {
  return (
    <DefaultLayout>
        <div className="ml-64 pt-24 p-6 mt-10 space-y-6 bg-[#f4f7fe] dark:bg-gray-900 h-full">
            <Calendrier></Calendrier>
        </div>
    </DefaultLayout>
  )
}
