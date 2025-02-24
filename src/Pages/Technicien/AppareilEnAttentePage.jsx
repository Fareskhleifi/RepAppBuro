import ViewAllAppareil from "../../Components/Tables/Technicien/Tables View/ViewAllAppareil";
import DefaultLayout from "../../layouts/DefaultLayout";

export default function AppareilEnAttentePage() {
  return (
    <DefaultLayout>
      <div className="ml-64 pt-24 p-6 mt-6 space-y-6 bg-[#f4f7fe] dark:bg-gray-900 h-full">
        <ViewAllAppareil></ViewAllAppareil>
      </div>
    </DefaultLayout>
  )
}
