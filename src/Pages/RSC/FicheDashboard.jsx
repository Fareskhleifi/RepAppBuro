/* eslint-disable no-unused-vars */
import Etiquette from "../../Components/etiquette/Etiquette";
import FicheReparation from "../../Components/fiche/FicheReparation";
import ViewAllFich from "../../Components/Tables/Tables View/ViewAllFich";
import DefaultLayout from "../../layouts/DefaultLayout";
import { useLocation } from 'react-router-dom';

export default function FicheDashboard() {

  const location = useLocation();
  const { param } = location.state || {};
  return (
    <DefaultLayout>
      <div className="ml-64 pt-24 p-6 mt-6 space-y-6 bg-[#f4f7fe] dark:bg-gray-900 h-full">
        <ViewAllFich showListClient={param}></ViewAllFich>
      </div>
    </DefaultLayout>
  )
}
