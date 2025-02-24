/* eslint-disable react-refresh/only-export-components */
import React from 'react';


const Dashboard = React.lazy(() => import('../Pages/DashboardPrincipale/Dashboard'));
const FicheDashboard = React.lazy(() => import('../Pages/RSC/FicheDashboard'));
const ClientDashboard = React.lazy(() => import('../Pages/RSC/ClientDashboard'));
const FactureDashboard = React.lazy(() => import('../Pages/RSC/FactureDashbaord'));
const ParametrePage = React.lazy(() => import('../Pages/RSC/ParametrePage'));
const NotificationPage = React.lazy(() => import('../Pages/RSC/NotificationPage'));
const CalendrierPage = React.lazy(() => import('../Pages/RSC/CalendrierPage'));
const ReclamationPage = React.lazy(() => import('../Pages/RSC/ReclamationPage'));
const ArchiveDeFacture = React.lazy(() => import('../Pages/RSC/Archive/ArchiveDeFacture'));
const ArchiveDefiche = React.lazy(() => import('../Pages/RSC/Archive/ArchiveDeFiche'));
const AppareilEnAttentePage = React.lazy(() => import('../Pages/Technicien/AppareilEnAttentePage'));
const HistroquieDeReparationPage = React.lazy(() => import('../Pages/Technicien/HistroquieDeReparationPage'));
const ProduitsEnStocks = React.lazy(() => import('../Pages/Technicien/ProduitsEnStock'));
const ProduitsDemandees = React.lazy(() => import('../Pages/Technicien/ProduitsDemandees'));
const TravailleursTechPage = React.lazy(() => import('../Pages/Direction/TravailleursTechPage'));
const StatistiquePage = React.lazy(() => import('../Pages/Direction/statistiquePage'));
const TravailleursRSCPage = React.lazy(() => import('../Pages/Direction/TravailleursRSCPage'));
const FacturePage = React.lazy(() => import('../Pages/RSC/FacturePage'));
const ModifierfichePage = React.lazy(() => import('../Pages/Technicien/ModifierFichePage'));
const ModifierfichePageRsc = React.lazy(() => import('../Pages/RSC/ModifierFichePageRsc'));
const VoirFacture = React.lazy(() => import('../Pages/RSC/VoirFacturePage'));
const DemandeCongePage = React.lazy(() => import('../Pages/Direction/DemandeCongePage'));
const PiecesDemandees = React.lazy(() => import('../Pages/Direction/PiecesDemandeesPage'));



const routes = [
  { path: '/dashboard', element: <Dashboard exact />, allowedRoles: ['RSC', 'TECHNICIEN', 'DIRECTION'] },
  { path: '/fich', element: <FicheDashboard />, allowedRoles: ['RSC','DIRECTION'] },
  { path: '/clients', element: <ClientDashboard /> ,allowedRoles: ['RSC','DIRECTION']},
  { path: '/facture', element: <FactureDashboard /> ,allowedRoles: ['RSC','DIRECTION']},
  { path: '/parametre', element: <ParametrePage /> ,allowedRoles: ['RSC', 'TECHNICIEN', 'DIRECTION']},
  { path: '/notification', element: <NotificationPage /> ,allowedRoles: ['RSC', 'TECHNICIEN', 'DIRECTION']},
  { path: '/calendrier', element: <CalendrierPage />,allowedRoles: ['RSC', 'TECHNICIEN', 'DIRECTION'] },
  { path: '/reclamation', element: <ReclamationPage />,allowedRoles: ['RSC', 'TECHNICIEN', 'DIRECTION'] },
  { path: '/archive-factures', element: <ArchiveDeFacture />,allowedRoles: ['RSC', 'DIRECTION']},
  { path: '/archive-fiches', element: <ArchiveDefiche /> ,allowedRoles: ['RSC', 'DIRECTION']},
  { path: '/pending-repairs', element: <AppareilEnAttentePage /> , allowedRoles: ['TECHNICIEN'] },
  { path: '/produits-stock', element: <ProduitsEnStocks /> , allowedRoles: ['TECHNICIEN','DIRECTION']},
  { path: '/produits-demandees', element: <ProduitsDemandees /> , allowedRoles: ['TECHNICIEN']},
  { path: '/repair-history', element: <HistroquieDeReparationPage />, allowedRoles: ['TECHNICIEN'] },
  { path: '/Travailleurs-tech', element: <TravailleursTechPage /> ,allowedRoles: ['DIRECTION'] },
  { path: '/Travailleurs-rsc', element: <TravailleursRSCPage /> ,allowedRoles: ['DIRECTION'] },
  { path: '/statistics', element: <StatistiquePage />  ,allowedRoles: ['DIRECTION']},
  { path: '/demande-conge', element: <DemandeCongePage />  ,allowedRoles: ['DIRECTION']},
  { path: '/Pieces-demandees', element: <PiecesDemandees />  ,allowedRoles: ['DIRECTION']},
  { path: '/facture-page', element: <FacturePage /> ,allowedRoles: ['RSC']},
  { path: '/fiche-tech', element: <ModifierfichePage /> , allowedRoles: ['TECHNICIEN']},
  { path: '/fiche-rsc', element: <ModifierfichePageRsc /> ,allowedRoles: ['RSC','DIRECTION']},
  { path: '/voir-facture', element: <VoirFacture /> ,allowedRoles: ['RSC','DIRECTION']},
];

export default routes;
