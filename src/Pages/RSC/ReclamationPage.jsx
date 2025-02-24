import Reclamation from "../../Components/Reclamation/Reclamation";
import DefaultLayout from "../../layouts/DefaultLayout";

export default function ReclamationPage() {
  return (
    <DefaultLayout>
        <div className="ml-64 pt-48 p-6  space-y-6 bg-[#f4f7fe] dark:bg-gray-900 h-screen">
            <Reclamation></Reclamation>
        </div>
    </DefaultLayout>
  )
}
