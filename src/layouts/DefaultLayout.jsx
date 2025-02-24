import {  useState,useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar/Sidebar";
import DashboardHeader from "../Components/Header/DashboardHeader ";

// eslint-disable-next-line react/prop-types
export default function DefaultLayout({children}) {

    const [darkMode, setDarkMode] = useState(() => {
      return sessionStorage.getItem("darkMode") === "true";
    });

    const location = useLocation();

    const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      sessionStorage.setItem("darkMode", newMode);
      document.body.classList.toggle("dark", newMode);
      return newMode;
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const getPageTitle = (path) => {
    switch (path) {
      case "/dashboard":
        return "Tableau de bord";
      case "/fich":
        return "Fiche de réparation";
      case "/clients":
        return "Clients";
      case "/facture":
        return "Facture";
      case "/archive":
        return "Archive";
      case "/parametre":
        return "Paramètres";
      case "/notification":
        return "Notifications";
      case "/calendrier":
        return "Calendrier";
      case "/reclamation":
          return "Reclamations";
      case "/archive-factures":
        return "Archive de Factures";
      case "/archive-fiches":
          return "Archive de Fiches de Réparations";
      case "/repair-history":
          return "Historique de réparation";
      case "/pending-repairs":
        return "Appareils en attente";
      case "/products":
          return "Pièces";
      case "/produits-stock":
        return "Pièces en stock";
      case "/produits-demandees":
          return "Pièces demandées";
      case "/Travailleurs-rsc":
          return "Responsables SC";
      case "/Travailleurs-tech":
          return "Techniciens";
      case "/statistics":
          return "Statistiques";
      case "/facture-page":
        return "Facture";
      case '/fiche-tech':
        return 'Modification de la fiche de réparation';
      case '/fiche-rsc':
        return 'Modification de la fiche'
      case '/demande-conge':
        return 'Demandes des congées'
      case '/Pieces-demandees':
        return 'Demandes des Pièces de rechange'
      default:
        return "Page";
    }
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className={`flex ${darkMode ? 'dark' : ''}`}>
    <Sidebar />
    <div className="flex-1 bg-gray-100 dark:bg-gray-900">
      <DashboardHeader onToggleDarkMode={toggleDarkMode} isDarkMode={darkMode} pageTitle={pageTitle}  />
      <main>{children}</main>
    </div>
  </div>
  )
}
