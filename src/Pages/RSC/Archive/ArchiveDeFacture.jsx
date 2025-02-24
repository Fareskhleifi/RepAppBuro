import ArchiveFacture from "../../../Components/Tables/Archive/ArchiveFacture";
import DefaultLayout from "../../../layouts/DefaultLayout";

export default function ArchiveDeFacture() {


  return (
    <DefaultLayout>
      <div className="ml-64 pt-24 p-6 mt-6 space-y-6 bg-[#f4f7fe] dark:bg-gray-900 h-full">
        <ArchiveFacture></ArchiveFacture>
      </div>
    </DefaultLayout>
  )
}
