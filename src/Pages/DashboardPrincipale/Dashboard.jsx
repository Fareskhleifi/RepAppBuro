import { useAuth } from "../../contextHook/AuthContext";
import DashboardContentRSC from "../../Components/DashboardContent/DashboardContentRSC";
import DashboardContentTech from "../../Components/DashboardContent/DashboardContentTech";
import DashboardContentDR from "../../Components/DashboardContent/DashboardContentDR";
import DefaultLayout from "../../layouts/DefaultLayout";

export default function Dashboard() {
  const { role } = useAuth();

  const renderDashboardContent = () => {
    switch (role) {
      case 'RSC':
        return <DashboardContentRSC />;
      case 'TECHNICIEN':
        return <DashboardContentTech />;
      case 'DIRECTION':
        return <DashboardContentDR />;
      default:
        return <div className="ml-64 pt-24 p-6 mt-6 space-y-6 bg-[#f4f7fe] dark:bg-gray-900 h-full">Rôle inconnu ou accès non autorisé.</div>;
    }
  };

  return (
    <DefaultLayout>
      {renderDashboardContent()}
    </DefaultLayout>
  );
}




// import { useState } from 'react';

// const panneOptions = [
//   'Problème de démarrage',
//   'Écran bleu',
//   'Surchauffe',
//   'Lenteur système',
//   'Problème de connexion Wi-Fi',
//   'Problème de son',
//   'Clavier ne fonctionne pas',
//   'Problème de charge',
//   'Erreur disque dur',
//   'Perte de données',
//   'Virus ou malware',
//   'Mise à jour impossible',
//   'Problème de caméra',
//   'Problème USB',
//   'Imprimante non reconnue',
//   'Autre' // Ajout de l'option "Autre"
// ];

// const Dashboard = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedPannes, setSelectedPannes] = useState([]);
//   const [otherPanne, setOtherPanne] = useState(''); // État pour la panne personnalisée
//   const [isOtherSelected, setIsOtherSelected] = useState(false); // État pour afficher la textarea
//   const [showFullList, setShowFullList] = useState(false); // État pour afficher la liste complète

//   const filteredPannes = panneOptions.filter((panne) =>
//     panne.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const addPanne = (panne) => {
//     if (panne === 'Autre') {
//       setIsOtherSelected(true); // Affiche la textarea si "Autre" est sélectionné
//     } else {
//       setIsOtherSelected(false);
//       if (!selectedPannes.includes(panne)) {
//         setSelectedPannes([...selectedPannes, panne]);
//       }
//     }
//     setSearchTerm(''); // Réinitialise l'entrée de recherche après la sélection
//     setShowFullList(false); // Masque la liste après la sélection
//   };

//   const removePanne = (panneToRemove) => {
//     setSelectedPannes(selectedPannes.filter((panne) => panne !== panneToRemove));
//   };

//   return (
//     <div className="w-full max-w-md mx-auto">
//       <label className="block text-gray-700 text-lg font-bold mb-2">
//         Fiche de Réparation
//       </label>
//       <div className="relative">
//         <input
//           type="text"
//           placeholder="Rechercher une panne..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           onClick={() => setShowFullList(!showFullList)}
//           className="absolute inset-y-0 right-2 my-auto text-blue-600 underline focus:outline-none"
//         >
//           {showFullList ? 'Masquer' : 'Afficher'}
//         </button>

//         {(filteredPannes.length > 0 && searchTerm) || showFullList ? (
//           <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md max-h-48 overflow-y-auto z-10 shadow-lg">
//             {(showFullList ? panneOptions : filteredPannes).map((panne, index) => (
//               <div
//                 key={index}
//                 onClick={() => addPanne(panne)}
//                 className="px-4 py-2 cursor-pointer hover:bg-blue-100 transition"
//               >
//                 {panne}
//               </div>
//             ))}
//           </div>
//         ) : null}
//       </div>

//       <div className="mt-4">
//         {selectedPannes.length > 0 && (
//           <div className="flex flex-wrap gap-2">
//             {selectedPannes.map((panne, index) => (
//               <div
//                 key={index}
//                 className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-full"
//               >
//                 <span>{panne}</span>
//                 <button
//                   onClick={() => removePanne(panne)}
//                   className="ml-2 h-4 w-4 cursor-pointer"
//                 >
//                   Supp
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//         {isOtherSelected && (
//           <div className="mt-4">
//             <label className="block text-gray-700 text-sm mb-1">
//               Veuillez spécifier la panne
//             </label>
//             <textarea
//               value={otherPanne}
//               onChange={(e) => setOtherPanne(e.target.value)}
//               placeholder="Décrivez la panne"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         )}
//       </div>

//       <button
//         type="button"
//         className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition"
//       >
//         Soumettre la Fiche de Réparation
//       </button>
//     </div>
//   );
// };

// export default Dashboard;


