import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa'; 
import Swal from "sweetalert2";
import { useEffect, useState } from 'react';
import {request} from '../../Service/axios_helper';
import Select from "react-select";
// eslint-disable-next-line no-unused-vars
const MySwal = withReactContent(Swal);
import withReactContent from 'sweetalert2-react-content'
import Cookies from 'js-cookie';

const FicheReparationTech = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isViewMode = sessionStorage.getItem('FicheTechIsViewMode');
  const [reparation, setReparation] = useState({});
  const reparationId = location.state?.reparation?.id;
  const [pieces, setPieces] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [selectedRows, setSelectedRows] = useState([{ pieceId: null, quantite: 0, prixTTC: 0, montantTTC: 0 }]);
  const [description, setDescription] = useState('');
  const [effectuePar, setEffectuePar] = useState('');
  const [dureeMainOeuvre, setDureeMainOeuvre] = useState('');
  const isDisabled = isViewMode !== "Update";
  const [piecesUtilises, setPiecesUtilises] = useState([]);


  useEffect(() => {
    const storedData = sessionStorage.getItem(`reparation-${reparationId}`);
    if (storedData) {
      setReparation(JSON.parse(storedData));
    } else if (location.state?.reparation) {
      setReparation(location.state.reparation);
      sessionStorage.setItem(
        `reparation-${reparationId}`,
        JSON.stringify(location.state.reparation)
      );
    } else {
      //
    }
  }, [reparationId, location.state]);

  useEffect(() => {
    const fetchPieces = async () => {
      try {
        const token = sessionStorage.getItem('token') || Cookies.get('token');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await request("get", "/tech/pieces-with-technicians", null, headers);
        setPieces(response.data.pieces);
        setTechniciens(response.data.techniciens);
      } catch (error) {
        console.log(error);
        toast.error("Erreur lors de la récupération des pieces.");
      }
    };

    fetchPieces();
  }, []);

  useEffect(() => {
    if (reparation.id) {
      fetchPiecesUtilisees();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reparation.id]);
  
  const fetchPiecesUtilisees = async () => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await request("get", `/tech/getPiecesByReparationId?id=${reparation.id}`, null, headers);
      setPiecesUtilises(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de la récupération des pièces utilisées.");
    }
  };

  const addPiecesRow = () => {
    setSelectedRows([...selectedRows, { pieceId: null, quantite: 0, prixTTC: 0, montantTTC: 0 }]);
  };

  const handlePieceChange = (index, pieceId) => {
    const piece = pieces.find((p) => p.id === parseInt(pieceId));
    const updatedRows = [...selectedRows];
    updatedRows[index] = {
      ...updatedRows[index],
      pieceId: piece.id,
      prixTTC: piece.prixVenteTTC,
    };
    setSelectedRows(updatedRows);
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedRows = [...selectedRows];
    updatedRows[index] = {
      ...updatedRows[index],
      quantite: parseInt(quantity),
      montantTTC: updatedRows[index].prixTTC * parseInt(quantity),
    };
    setSelectedRows(updatedRows);
  };

  const handleDeletePiece = (index) => {
    const updatedRows = [...selectedRows];
    updatedRows.splice(index, 1); 
    setSelectedRows(updatedRows);
  };
  
  const handleModifier = () => {
    const newSelectedPiecesUtilise = [];
    for (let i = 0; i < selectedRows.length; i++) {
      const row = selectedRows[i];
      if (!row.pieceId) {
        toast.error("Erreur : Certaines pièces n'ont pas d'ID valide.");
        return;
      }
      if (row.quantite <= 0) {
        toast.error("Erreur : La quantité de certaines pièces est invalide (doit être supérieure à 0).");
        return;
      }
  
      const piece = pieces.find(p => p.id === row.pieceId);
      if (piece) {
        if (row.quantite > piece.quantiteStock) {
          toast.error(`Erreur : La quantité demandée pour la pièce ${piece.nom} dépasse le stock disponible (${piece.quantiteStock}).`);
          return;
        }
  
        newSelectedPiecesUtilise.push({ 
          piece: { id: piece.id }, 
          reparation: { id: reparation.id }, 
          qte: row.quantite 
        });
      }
    }

    const isValid = validateForm();

    if (!isValid) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }
  
    Swal.fire({
      title: "Confirmer la finalisation",
      text: "Êtes-vous sûr de vouloir finaliser cette réparation ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui, finaliser",
      cancelButtonText: "Non, garder",
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          "description": description,
          "dateFinReparation": new Date(),
          "idTechnicien": effectuePar,
          "idReparation": reparation.id,
          "dureeMainOeuvre": dureeMainOeuvre,
          "piecesUtilisees": newSelectedPiecesUtilise,
        };
        const token = sessionStorage.getItem('token') || Cookies.get('token');
        const headers = { Authorization: `Bearer ${token}` };
  
        // eslint-disable-next-line no-unused-vars
        const response = request("put", "/tech/finaliserReparation", data, headers).then(() => {
          toast.success("Réparation finalisée avec succès !", {
            autoClose: 1300,
          });
          setTimeout(() => {
            navigate("/dashboard");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 1350);
        }).catch(() => {
          toast.error("Erreur lors de la finalisation.");
        });
      }
    });
  };
    
  const handleRetourner = () => {
    Swal.fire({
      title: "Confirmer la retour",
      text: "Êtes-vous sûr de vouloir retourner cette action ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, retourne",
      cancelButtonText: "Non, garder",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem(`reparation-${reparationId}`);
        setTimeout(()=>{
          navigate("/dashboard");
          window.scrollTo({ top: 0, behavior: "smooth" });
        },500);
      }
    });
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  
  const handleEffectueParChange = (event) => {
    setEffectuePar(event.target.value);
  };
  
  
  const handleDureeMainOeuvreChange = (event) => {
    setDureeMainOeuvre(event.target.value);
  }; 

  const validateForm = () => {
    if (!description) return false;
    if (!dureeMainOeuvre) return false;
    if (!effectuePar) return false;
  
    return true;
  };


  return (
        <>
          <div className="container -mt-12 scale-90  mx-auto p-4 bg-gray-200 border border-black w-[250mm]">
            
            <h2 className="text-center text-2xl font-semibold bg-blue-600 text-black p-1 mt-3 mb-12">Fiche de Réparation</h2>

            <div className="flex justify-between mb-4">
              <div className="w-[48%]">
                <p>Numéro de Fiche: N° {reparation?.demandeReparation?.id}</p>
              </div>
              <div className="w-[48%]">
                <p>Date de Création: {reparation?.demandeReparation?.dateDepot}</p>
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <div className="w-[48%]">
                <table className="w-full border p-10 border-gray-600 table-auto bg-white border-collapse mb-4">
                  <thead>
                    <tr>
                      <td colSpan="2" className="bg-blue-600 border-b border-black text-black font-semibold text-lg text-center p-2">Coordonnées Client</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-none text-lg p-2">Nom: </td>
                      <td className="border-none p-2 "><input disabled type="text" value={reparation?.demandeReparation?.client.nom || ''} className=" text-lg  w-full" /></td>
                    </tr>
                    <tr>
                      <td className="border-none text-lg p-2">Adresse: </td>
                      <td className="border-none p-2"><input disabled type="text" value={reparation?.demandeReparation?.client.adresse || ''} className=" text-lg  w-full"/></td>
                    </tr>
                    <tr>
                      <td className="border-none text-lg p-2">Tél. Portable: </td>
                      <td className="border-none p-2"><input disabled type="text" value={reparation?.demandeReparation?.client.telephone || ''} className=" text-lg   w-full" /></td>
                    </tr>
                    <tr>
                      <td className="border-none text-lg p-2">Email:</td>
                      <td className="border-none p-2"><input disabled  type="text" value={reparation?.demandeReparation?.client.email || ''} className=" text-lg   w-full" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="w-[48%]">
                <table className="w-full table-auto border border-gray-600 bg-white border-collapse mb-4">
                  <thead className="">
                    <tr>
                      <td colSpan="2" className="bg-blue-600 border-b border-black text-black font-semibold text-lg text-center p-2">Matériel</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-none text-lg p-2">Modele :</td>
                      <td className="border-none p-2"><input disabled type="text" value={reparation?.demandeReparation?.appareil?.modele || ''} className=" border-gray-900 text-lg  w-full"   /></td>
                    </tr>
                    <tr>
                      <td className="border-none text-lg p-2">Marque :</td>
                      <td className="border-none p-2"><input disabled type="text" value={reparation?.demandeReparation?.appareil?.marque || ''} className=" border-gray-900 text-lg  w-full"  /></td>
                    </tr>
                    <tr>
                      <td className="border-none text-lg p-2">N° Serie :</td>
                      <td className="border-none p-2"><input disabled type="text" value={reparation?.demandeReparation?.appareil?.numeroSerie || ''} className=" border-gray-900 text-lg  w-full"  /></td>
                    </tr>
                    <tr>
                      <td className="border-none text-lg p-2">Désignation :</td>
                      <td className="border-none p-2"><input disabled type="text" value={reparation?.demandeReparation?.appareil?.designation || ''} className=" border-gray-900 text-lg  w-full"  /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <table className="w-full table-auto border border-gray-900 bg-white border-collapse mb-6">
          <thead>
            <tr>
              <td colSpan="2" className="bg-blue-600 border-b border-black text-black font-semibold text-lg text-center p-2">Observation(s)</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="2" className="border border-gray-900 p-2">
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input disabled checked type="checkbox" className="mr-2" /> À facturer
                  </label>
                  <label className="flex items-center">
                    <input disabled type="checkbox" className="mr-2" /> Garantie
                  </label>
                  <label  className="flex items-center">
                    <input disabled type="checkbox" className="mr-2" /> Sous-contrat
                  </label>
                  <label  className="flex items-center">
                    <input disabled type="checkbox" className="mr-2" /> Gratuit
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="border border-gray-900 p-2">
              Date prévue de remise : <input value={reparation?.demandeReparation?.datePrevueRemise || ''} disabled type="date" className="w-36 text-lg border-b border-gray-600 px-2 py-1"  /> , sinon téléphoner.
              </td>
            </tr>
          </tbody>
            </table>

            <table id="travaux-demandes-table" className="w-full table-auto border border-gray-900 bg-white border-collapse mb-6">
              <thead>
                <tr>
                  <td colSpan="2" className="bg-blue-600 border-b border-black text-black font-semibold text-lg text-center p-2">Travaux demandés par le client</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="2" className="border border-gray-900 p-2">
                    <div className="flex justify-between">
                      <div className="w-[65%]">
                        <textarea value={reparation?.demandeReparation?.symptomesPanne || ''} disabled  className="w-full max-h-36 min-h-36 p-2 text-xl border border-gray-600"></textarea>
                      </div>
                      <div className="w-[30%] flex flex-col justify-center">
                        <p>Signature client:</p>
                        <div className="border border-gray-600 h-28"></div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="page-break"></div>
            
            <table id="work-table" className="w-full border border-gray-900 table-auto bg-white border-collapse mb-6">
              <thead>
                <tr>
                  <td colSpan="5" className="bg-blue-600 border-b border-black text-black font-semibold text-lg text-center p-2">Travaux effectués</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 w-1/3  p-2">Description</td>
                  <td className="border border-gray-800  p-2">Durée main d&apos;oeuvre (H)</td>
                  <td className="border border-gray-800  p-2">Effectué par</td>
                  <td className="border border-gray-800  p-2">Total réparation</td>
                </tr>
              </thead>
              <tbody>
                {
                  isDisabled ?(
                    <tr>
                    <td className="border border-gray-800 p-1">
                      <input 
                        type="text"
                        value={reparation?.description || "Description de piece"}
                        disabled={isDisabled}
                        className="w-full text-lg  p-2"
                      />
                    </td>
                    <td className="border border-gray-800 p-1">
                      <input
                        type="number"
                        value={reparation?.dureeMainOeuvre || "0"}
                        disabled={isDisabled}
                        className="w-full text-lg  p-2"
                      />
                    </td>
                    <td className="border border-gray-800 p-1">
                      <input
                        type="text"
                        value={
                          reparation?.technicien?.nom && reparation?.technicien?.prenom
                            ? `${reparation.technicien.nom} ${reparation.technicien.prenom}`
                            : "Non sélectionné"
                        }
                        disabled={isDisabled}
                        className="w-full text-lg p-2"
                      />
                    </td>
                    <td className="border border-gray-800 p-1">
                      <input
                        type="text"
                        readOnly
                        value={reparation?.dureeMainOeuvre * 15 + "  TND"}
                        className="w-full text-lg  p-2"
                      />
                    </td>
                  </tr>
                  ) : (
                    <tr>
                    <td className="border border-gray-800 p-1">
                      <input 
                        type="text"
                        value={description}
                        disabled={isDisabled}
                        required
                        onChange={handleDescriptionChange}
                        className="w-full text-lg  p-2"
                        placeholder="Description ..."
                      />
                    </td>
                    <td className="border border-gray-800 p-1">
                      <input
                        type="number"
                        value={dureeMainOeuvre}
                        disabled={isDisabled}
                        required
                        onChange={handleDureeMainOeuvreChange}
                        className="w-full text-lg  p-2"
                        placeholder="Durée (heures) ..."
                      />
                    </td>
                    <td className="border border-gray-800 p-1">
                          <select
                            value={effectuePar}
                            onChange={handleEffectueParChange}
                            className="text-lg w-full py-2 "
                            disabled={isDisabled}
                          >
                            <option value="">Sélectionner un technicien</option>
                            {techniciens.length > 0 ? (
                              techniciens.map((technicien) => (
                                <option key={technicien.id} value={technicien.id}>
                                  {technicien.nom}
                                </option>
                              ))
                            ) : (
                              <option value="" disabled>
                                Aucun technicien disponible
                              </option>
                            )}
                          </select>
                    </td>
                    <td className="border border-gray-800 p-1">
                      <input
                        type="text"
                        readOnly
                        value={dureeMainOeuvre * 15 + "  TND"}
                        className="w-full text-lg  p-2"
                      />
                    </td>
                  </tr>
                  )
                }
              </tbody>
            </table>

            <table id="fourniture-table" className="w-full border border-gray-900 table-auto bg-white border-collapse mb-6">
              <thead>
                <tr>
                <td colSpan="5" className="bg-blue-600 border-b border-black text-black font-semibold text-lg text-center p-2">
                  <div className='flex justify-between items-center'>
                    <span className="flex-grow text-center -mr-12">Pièces utilisées</span>
                    {isViewMode === "Update" && (
                      <button className="bg-gray-950 hover:bg-gray-700 text-white px-3.5 py-1 rounded-xl shadow" onClick={addPiecesRow}>+</button>
                    )}
                  </div>
                </td>
                </tr>
                <tr>
                  <td className="border border-gray-800 text-center p-2">Pièces - Désignations</td>
                  <td className="border border-gray-800  p-2">Prix TTC</td>
                  <td className="border border-gray-800  p-2">Quantite</td>
                  <td className="border border-gray-800  p-2">Montant TTC</td>
                </tr>
              </thead>
              <tbody>
                    {
                      isDisabled ? (
                        piecesUtilises.map((piece, index) => (
                          <tr key={index}>
                            <td className="border flex border-gray-800 px-4 py-2 w-[100%]">{ piece?.nom }</td>
                            <td className="border border-gray-900 px-4 py-2">{ piece?.prixVenteTTC?.toFixed(2)} DT</td>
                            <td className="border border-gray-900 px-4 py-2 w-[12%]">{ piece?.reparationPieces[0]?.qte }</td>
                            <td className="border border-gray-900 px-4 py-2">{ (piece?.reparationPieces[0]?.qte * piece?.prixVenteTTC).toFixed(2) } DT</td>
                          </tr>
                        ))
                      ) : (
                        selectedRows.map((row, index) => (
                          <tr key={index}>
                            <td className="border flex border-gray-800 px-4 py-2 w-[100%]">
                              <button
                                onClick={() => handleDeletePiece(index)}
                                className="text-red-500 mr-4 hover:text-red-700"
                              >
                                <FaTrash />
                              </button>
                              <Select
                                  value={pieces
                                    .map((piece) => ({ value: piece.id, label: piece.nom }))
                                    .find((option) => option.value === row.pieceId) || null}
                                onChange={(selectedOption) => handlePieceChange(index, selectedOption.value)}
                                options={pieces.map((piece) => ({ value: piece.id, label: piece.nom }))}
                                isDisabled={isDisabled}
                                placeholder="Choisir une pièce"
                                className="w-full"
                              />
                            </td>
                            <td className="border border-gray-900 px-4 py-2">
                              {row.prixTTC ? row.prixTTC.toFixed(2) : "N/A"} DT
                            </td>
                            <td className="border border-gray-900 px-4 py-2 w-[12%]">
                              <input
                                type="number"
                                min="0"
                                required
                                disabled={isDisabled}
                                placeholder="Qte ..."
                                value={row.quantite || ""}
                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                                className="w-full px-2 py-1"
                              />
                            </td>
                            <td className="border border-gray-900 px-4 py-2">
                              {row.montantTTC ? row.montantTTC.toFixed(2) : "0.00"} DT
                            </td>
                          </tr>
                        ))
                      )
                    }
              </tbody>
            </table>
            
            
            <div className="totals flex justify-between">
          <div className="stamp w-[340px] border border-gray-900 p-5 text-center align-top bg-white h-40">
            <p>Cachet de lentreprise</p>
          </div>
          <div className="stamp w-[340px] border border-gray-900 p-5 text-center align-top bg-white h-40">
            <p>Signature de client</p>
          </div>

          </div>
            <p className="notes text-xs italic mt-2">Note: Nos conditions de réparation et tarifaire affichés vous sont applicables.</p>
          </div>
            {
              isViewMode== "Update" ? (
                <div className="flex relative gap-8 -top-10 -ml-2 mb-4 items-center justify-center">
                  <button onClick={handleModifier}  className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
                  Enregistrer
                </button>
                <button  onClick={handleRetourner} className="bg-gray-800 text-white px-6 py-2 rounded shadow hover:bg-blue-600">
                    Annuler
                </button>
              </div>
              ) :(
                <div className="flex relative items-center mr-12 justify-center -top-14  mb-4 ">
                  <button onClick={handleRetourner}  className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
                  Retourner
                </button>
              </div>
              )
            }
           
       <ToastContainer />
    </>
  );
};

export default FicheReparationTech;
