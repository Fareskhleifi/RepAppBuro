import { useState, useRef , useEffect} from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {request} from '../../Service/axios_helper'
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAuth } from '../../contextHook/AuthContext';

const localizer = momentLocalizer(moment);
const MySwal = withReactContent(Swal);

export default function Calendrier() {

  const {user} = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [dateDebut, setDateDebut] = useState(Date);
  const [dateFin, setDateFin] = useState(Date);
  const [typeConge, setTypeConge] = useState('ANNUEL');
  const [commentaire, setCommentaire] = useState('');
  const formRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [demandeConge, setDemandeConge] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showDetails, setShowDetails] = useState(true);

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // eslint-disable-next-line no-unused-vars
  const subtractDays = (date, days) => {
      const result = new Date(date);
      result.setDate(result.getDate() - days);
      return result;
  };

  useEffect(() => {
    fetchConges();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchConges = async () => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const path = user.role == "TECHNICIEN" ? `/tech/getAllConge/${user.idUser}` : user.role == "RSC" ? `/rsc/getAllConge/${user.idUser}` : "/direction/getAllDemandeDeConge"
      const response = await request("get", path ,null,headers);
      const formattedConges = response.data.map((conge) => ({
        id : conge.id,
        title: conge.statut == 'EN_ATTENTE' ? `Demande d'un congé ${conge.typeConge}`  : `Congé ${conge.typeConge}` ,
        start: new Date(conge.dateDebut),
        end: new Date(conge.dateFin),
        color: conge.statut == 'EN_ATTENTE' ? '#daca09' : conge.statut === 'ACCEPTEE' ? '#28a745' : '#e73333',
        statut : conge.statut,
        typeConge : conge.typeConge,
        commentaire : conge.commentaire,
        utilisateur : conge.utilisateur,
      }));
      setDemandeConge(formattedConges);
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de la récupération des demandes.");
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setDateDebut(addDays(start,1));
    setDateFin(end);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    MySwal.fire({
      title: 'Confirmer la demande de conge',
      text: "Êtes-vous sûr de vouloir demnader cette conge ?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Oui, confirmer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        handleSave();
      }
    });
  };

  const handleSave = async ()=>{ 
    if (commentaire.trim()=="" || dateDebut =="" || dateFin=="" || user.idUser == null ) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (dateDebut < new Date) {
      toast.error("Impossible de créer un congé avec une date passée!");
      return;
    }

    if (dateDebut > dateFin) {
      toast.error("la date de fin de conge doit etre superieure a la date de debut!");
      return;
    }

    const newConge = {
      utilisateur : {id : user.idUser},
      dateDebut: dateDebut.toISOString().split('T')[0],
      dateFin: dateFin.toISOString().split('T')[0],
      commentaire : commentaire,
      typeConge: typeConge,
    };
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      if(user.role == "RSC"){
        await request("post", '/rsc/creerDemandeConge', newConge, headers);
      }
      if(user.role == "TECHNICIEN"){
        await request("post", '/tech/creerDemandeConge', newConge, headers);
      }
      fetchConges()
      setShowForm(false);
      toast.success('Demande de congé envoyée avec succès.');
      resetForm();
    } catch (error) {
      toast.error("Erreur lors de la demande de conge.");
      console.error("Erreur:", error);
    }
  }

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setDateDebut('');
    setDateFin('');
    setTypeConge('ANNUEL');
    setCommentaire('');
  };

  // const handleSearch = (e) => {
  //   const searchTerm = e.target.value.toLowerCase();
  //   setFilteredEvents(searchTerm ? events.filter(event =>
  //     event.title.toLowerCase().includes(searchTerm)
  //   ) : events);
  // };

  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      if(user.role == "RSC"){
        await request("delete", `/rsc/annulerConge/${id}`, null, headers);
      }
      if(user.role == "TECHNICIEN"){
        await request("delete", `/tech/annulerConge/${id}`, null, headers);
      }
      fetchConges()
      setSelectedEvent(null);
      toast.success('Congé supprimé avec succès.', { autoClose: 1500 });
    } catch (error) {
      toast.error("Erreur lors de la suppression de congé.");
      console.error("Erreur:", error);
    }
  };

  const handleActionSupprime = (id)=>{
   MySwal.fire({
      title: 'Confirmer la suppression',
      text: "Êtes-vous sûr de vouloir supprimer cette conge ?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
      }
    });
  }

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };

  const eventStyleGetter = (event) => {
    const backgroundColor = event.color || 'blue';
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  const handleEdit = () => {
    setDateDebut(selectedEvent.start);
    setDateFin(selectedEvent.end);
    setTypeConge(selectedEvent.typeConge || 'ANNUEL');
    setCommentaire(selectedEvent.commentaire);
    setShowDetails(false);
    setIsEditing(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    MySwal.fire({
      title: 'Confirmer la modification',
      text: "Êtes-vous sûr de vouloir modifier cette conge ?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Oui, confirmer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        Update();
      }
    });
  };

  const Update = async()=>{
    const congeData = {
      id : selectedEvent.id,
      utilisateur : { id : user.idUser},
      dateDebut: dateDebut,
      dateFin: dateFin,
      typeConge: typeConge,
      commentaire : commentaire,
      statut : selectedEvent.statut,
    };
    try{
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      if(user.role == "RSC"){
        await request("put", `/rsc/updateConge`, congeData, headers);
      }
      if(user.role == "TECHNICIEN"){
        await request("put", `/tech/updateConge`, congeData, headers);
      }
      setIsEditing(false);
      setSelectedEvent(null);
      fetchConges()
      toast.success('Congé mis à jour avec succès.', { autoClose: 1500 });
    } catch (error) {
      toast.error("Erreur lors de la modification de congé.");
      console.error("Erreur:", error);
    }
  }

  return (
    <div className="container h-full mx-auto p-4">
      <ToastContainer />
      { 
        user.role != "DIRECTION" && (
            <div className="flex mb-4 items-center">
            <button
              onClick={() => {setShowForm(true);setSelectedEvent(null);setIsEditing(false);}}
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Demande de Congé
            </button>
            
            {/* {!showForm && (
              <input
                type="text"
                placeholder="Rechercher par nom de client"
                // onChange={handleSearch}
                className="ml-4 block w-64 border border-gray-300 rounded-md p-2"
              />
            )} */}
          </div>)
      }
      {showForm && user.role != "DIRECTION" ? (
        <div ref={formRef} className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-2">Demande de Congé</h2>
          <form onSubmit={handleSubmit}>
            <label className="block mb-4">
              <span className="text-gray-700">Date de Début</span>
              <input
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={moment(dateDebut).format('YYYY-MM-DD')}
                onChange={(e) => setDateDebut(new Date(e.target.value))}
                required
              />
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">Date de Fin</span>
              <input
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={moment(dateFin).format('YYYY-MM-DD')}
                onChange={(e) => setDateFin(new Date(e.target.value))}
                required
              />
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">Type de congé</span>
              <select
                value={typeConge}
                onChange={(e) => setTypeConge(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="ANNUEL">Congé Annuel</option>
                <option value="MALADIE">Congé Maladie</option>
              </select>
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">Commentaire</span>
              <textarea
                className="mt-1 min-h-10 block w-full border border-gray-300 rounded-md p-2"
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                required
              />
            </label>
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Envoyer
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="mt-4 ml-4 bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600"
            >
              Annuler
            </button>
          </form>
        </div>
      ) : !isEditing && !selectedEvent ? (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <Calendar
            localizer={localizer}
            events={demandeConge}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={user.role != "DIRECTION" ? handleSelectSlot : ""}
            onSelectEvent={handleEventSelect}
            eventPropGetter={eventStyleGetter}
            style={{ height: 600 }}
          />
        </div>
      ) : null}

      {selectedEvent && showDetails &&  (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-2">Détails du Congé</h2>
          <p><strong>Titre:</strong> {selectedEvent.title}</p>
          {
            user.role == "DIRECTION" && (
                <p><strong>Travailleur:</strong> {selectedEvent.utilisateur.prenom+" "+selectedEvent.utilisateur.nom}</p>
            )
          }
          <p><strong>Date de Début:</strong> {moment(selectedEvent.start).format('LLL')}</p>
          <p><strong>Date de Fin:</strong> {moment(selectedEvent.end).format('LLL')}</p>
          <p><strong>Statut:</strong> <span className={`font-semibold ${selectedEvent.statut==='EN_ATTENTE' ? 'text-yellow-600' : selectedEvent.statut==='ACCEPTEE' ? 'text-green-600' : 'text-red-600'} `}>{selectedEvent.statut}</span></p>
          <p><strong>Commenatire :</strong> {selectedEvent.commentaire}</p>
          <div className="flex mt-4">
            {
              selectedEvent.statut =="EN_ATTENTE" && user.role != "DIRECTION" &&(
                <> 
                  <button
                    onClick={() => handleActionSupprime(selectedEvent.id)}
                    className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                  <button
                    onClick={handleEdit}
                    className="ml-4 mr-4 bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600"
                  >
                    Modifier
                  </button>
                </>
              )
            }
            <button
              onClick={() => {setSelectedEvent(null);setIsEditing(false);}}
              className=" bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-500"
            >
              Retourner à la calendrier
            </button>
          </div>
        </div>
      )}

      {isEditing && user.role != "DIRECTION" && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-2">Modifier le Rendez-vous</h2>
          <form onSubmit={handleUpdate}>
            <label className="block mb-4">
              <span className="text-gray-700">Date de Début</span>
              <input
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={moment(dateDebut).format('YYYY-MM-DD')}
                onChange={(e) => setDateDebut(new Date(e.target.value))}
                required
              />
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">Date de Fin</span>
              <input
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={moment(dateFin).format('YYYY-MM-DD')}
                onChange={(e) => setDateFin(new Date(e.target.value))}
                required
              />
            </label>

             <label className="block mb-4">
              <span className="text-gray-700">Type de congé</span>
              <select
                value={typeConge}
                onChange={(e) => setTypeConge(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="ANNUEL">Congé Annuel</option>
                <option value="MALADIE">Congé Maladie</option>
              </select>
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">Commentaire</span>
              <textarea
                className="mt-1 min-h-10 block w-full border border-gray-300 rounded-md p-2"
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                required
              />
            </label>
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Mettre à jour
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setSelectedEvent(null);
              }}
              className="mt-4 ml-4 bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-500"
            >
              Annuler
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
