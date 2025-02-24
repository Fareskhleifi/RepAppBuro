/* eslint-disable react/prop-types */
import {
  DocumentIcon ,
  HomeIcon,
  ClipboardDocumentIcon,
  ArchiveBoxIcon,
  DocumentDuplicateIcon,
  Cog6ToothIcon,
  FolderIcon,
  WrenchIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  CalendarIcon,
  BellIcon,
  PaperAirplaneIcon,
  CubeIcon ,
  ExclamationCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contextHook/AuthContext';
// import { Button } from '@headlessui/react';

const sidebarItems = {
  RSC: [
    { label: "Tableau de bord", Icon: HomeIcon, path: "/dashboard" },
    { label: "Fiche de réparation", Icon: ClipboardDocumentIcon, path: "/fich" },
    { label: "Clients", Icon: UserGroupIcon, path: "/clients" },
    { label: "Facture", Icon: DocumentTextIcon, path: "/facture" },
    { label: "Archive", Icon: ArchiveBoxIcon, path: "#", subItems: [
        { label: "Archive des factures", Icon: DocumentDuplicateIcon, path: "/archive-factures" },
        { label: "Archive des fiches", Icon: FolderIcon, path: "/archive-fiches" }
      ]},
    { label: "Calendrier", Icon: CalendarIcon, path: "/calendrier" },
    { label: "Notifications", Icon: BellIcon, path: "/notification" },
    { label: "Réclamations", Icon: ExclamationCircleIcon, path: "/reclamation" },
    { label: "Paramètres", Icon: Cog6ToothIcon, path: "/parametre" }
  ],
  TECHNICIEN: [
    { label: "Tableau de bord", Icon: HomeIcon, path: "/dashboard" },
    { label: "Appareils en attente", Icon: WrenchIcon, path: "/pending-repairs" },
    { label: "Pièces", Icon: CubeIcon   , path: "#" , subItems: [
      { label: "Pièces en stock", Icon: CubeIcon, path: "/produits-stock" },
      { label: "Pièces demandées", Icon: PaperAirplaneIcon , path: "/produits-demandees" }
      ]},
    { label: "Historique de réparation", Icon: ArchiveBoxIcon, path: "/repair-history" },
    { label: "Calendrier", Icon: CalendarIcon, path: "/calendrier" },
    { label: "Notifications", Icon: BellIcon, path: "/notification" },
    { label: "Réclamations", Icon: ExclamationCircleIcon, path: "/reclamation" },
    { label: "Paramètres", Icon: Cog6ToothIcon, path: "/parametre" }
  ],
  DIRECTION: [
    { label: "Tableau de bord", Icon: HomeIcon, path: "/dashboard" },
    { label: "Travailleurs", Icon: UserGroupIcon, path: "#"  , subItems: [
      { label: "Techniciens", Icon: CubeIcon, path: "/Travailleurs-tech" },
      { label: "Responsables SC", Icon: PaperAirplaneIcon , path: "/Travailleurs-rsc" },
      { label: "Demandes des congées", Icon: DocumentIcon  , path: "/demande-conge" },
      ] },
    { label: "Clients", Icon: UserGroupIcon, path: "/clients" },
    { label: "Réparation", Icon: ClipboardDocumentIcon, path: "/fich"  },
    { label: "Facture", Icon: DocumentTextIcon, path: "/facture" },
    { label: "Pièces", Icon: CubeIcon, path: "", subItems: [
      { label: "Pièces en stock", Icon: CubeIcon, path: "/produits-stock" },
      { label: "Pièces demandées", Icon: DocumentIcon  , path: "/Pieces-demandees" },
      ] },
    { label: "Statistiques", Icon: ClipboardDocumentIcon, path: "/statistics" },
    { label: "Archive", Icon: ArchiveBoxIcon, path: "#", subItems: [
      { label: "Archive des factures", Icon: DocumentDuplicateIcon, path: "/archive-factures" },
      { label: "Archive des fiches", Icon: FolderIcon, path: "/archive-fiches" }
    ]},
    { label: "Calendrier", Icon: CalendarIcon, path: "/calendrier" },
    { label: "Notifications", Icon: BellIcon, path: "/notification" },
    { label: "Réclamations", Icon: ExclamationCircleIcon, path: "/reclamation" },
    { label: "Paramètres", Icon: Cog6ToothIcon, path: "/parametre" }
  ]
};

const Sidebar = () => {
  const location = useLocation();
  const { role,logout  } = useAuth();
  const items = sidebarItems[role] || [];

  const handleLogoutConfirmation = ()=>
  {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      text: "Vous serez déconnecté de votre compte.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, déconnectez-moi',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33', 
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); 
      }
    });
  }
  

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-white dark:bg-gray-800 shadow-lg flex flex-col">
      <div className="text-2xl text-center font-bold p-8 border-b border-gray-200 dark:border-gray-700">
        <span className="text-gray-800 dark:text-white">RepAppBuro</span>
      </div>
      <nav className="mt-10 space-y-2">
        {items.map((item) => (
          <Link key={item.label} to={item.path}>
            <SidebarItem Icon={item.Icon} 
             label={item.label}
             location={location}
             isActive={location.pathname === item.path || (item.subItems && item.subItems.some(subItem => location.pathname === subItem.path))} 
             subItems={item.subItems} />
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t border-gray-200 mb-2">
        <button className='w-full' onClick={handleLogoutConfirmation}>
          <SidebarItem Icon={ArrowRightOnRectangleIcon} label="Logout" />
        </button>
      </div>
    </div>
  );
};

const SidebarItem = ({ Icon, label, isActive, subItems,location  }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSubItems = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="sidebar-item">
      <div
        role="button"
        className={`flex items-center px-5 py-2 transition-all cursor-pointer ${
          isActive
            ? 'text-blue-600 dark:text-blue-400 border-r-4 border-[#422afb]'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-500'
        }`}
        onClick={subItems ? toggleSubItems : null} // Toggle if there are subItems
      >
        <Icon className="w-6 h-6" />
        <span className="ml-3.5">{label}</span>
      </div>

      {/* Show sub-items if expanded */}
      {subItems && isExpanded && (
        <div className="ml-8 space-y-1">
          {subItems.map((subItem, index) => (
            <Link 
              key={index} 
              to={subItem.path}
              className={`flex  items-center transition-all px-5 py-2 ${
                location.pathname === subItem.path 
                  ? 'text-blue-600 dark:text-blue-400 border-r-4 border-transparent' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-500'
              }`}
            >
              <subItem.Icon className="w-5 h-5" />
              <span className="ml-3">{subItem.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};



export default Sidebar;
