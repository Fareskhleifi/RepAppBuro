import ModifFicheReparationRsc from "../../Components/fiche/ModifFicheReparationRsc";
import DefaultLayout from "../../layouts/DefaultLayout";
import { useLocation } from "react-router-dom";

export default function HistroquieDeReparationPage() {

  const location = useLocation();
  const selectedDemande = location.state;

  return (
    <DefaultLayout>
    <div className="ml-64 pt-24 p-6 mt-6 space-y-6 bg-[#f4f7fe] dark:bg-gray-900 h-full">
        <ModifFicheReparationRsc demande={selectedDemande}></ModifFicheReparationRsc>
    </div>
  </DefaultLayout>
  )
}
