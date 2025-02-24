/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState,useEffect } from 'react';
import {request} from '../../Service/axios_helper';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from '../../contextHook/AuthContext';
import Cookies from 'js-cookie'; 
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

const Avatar = ({ src, alt, fallback }) => {
  return (
    <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
      {src ? (
        <img className="w-full h-full object-cover" src={src} alt={alt || "Avatar"} />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-300 text-gray-600">
          {fallback || alt?.charAt(0) || "U"}
        </div>
      )}
    </div>
  );
};

const AvatarImage = (props) => {
  return <img {...props} className="w-full h-full object-cover" />;
};

const AvatarFallback = ({ children, ...props }) => {
  return (
    <div {...props} className="flex items-center justify-center w-full h-full bg-gray-300 text-gray-600">
      {children}
    </div>
  );
};

const Button = ({ children, variant = 'default', className = '', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...props}
    />
  );
};

const Label = ({ children, className = '', ...props }) => {
  return (
    <label className={`block text-sm font-medium text-gray-700 ${className}`} {...props}>
      {children}
    </label>
  );
};

const Separator = ({ className = '' }) => {
  return <hr className={`border-t border-gray-200 my-4 ${className}`} />;
};

const Page3 = () => {

  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userDetails, setUserDetails] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
  });
  const [avatar, setAvatar] = useState("/placeholder.svg?height=100&width=100");

  useEffect(() => {
    fetchClients();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClients = async () => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await request("get", `/AllUsers/getUserById/${user.idUser}`, null, headers);
      setUserDetails(response.data);
    } catch (error) {
      toast.error("Erreur lors de la récupération du informations.");
    }
  };

  const handleSubmit = async (e) => {
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas !");
      return;
    }
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const Data = {
        userId : user.idUser,
        oldPassword : currentPassword,
        newPassword : newPassword,
      }
      const response = await request("post", "/AllUsers/changerMotDePasse",Data ,headers);
      if (response.status === 200) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        toast.success("Mot de passe mis à jour avec succès !");
      } else {
        toast.error("Une erreur est survenue, veuillez réessayer.");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du mot de passe !");
    }
  };

  const handleChangePassword = (e)=>{
    e.preventDefault();
    MySwal.fire({
      title: 'Confirmer la changement',
      text: "Êtes-vous sûr de vouloir changer votre mot de passe ?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Oui, confirmer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmit();
      }
    });
  }

  const handleSubmitUserDetails = async () => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const newData = {
        userId : user.idUser,
        nom : userDetails.nom,
        prenom : userDetails.prenom,
        email : userDetails.email,
        telephone : userDetails.telephone,
      }
      const response = await request("post", "/AllUsers/updateUserDetails",newData ,headers);
      if (response.status === 200) {
        toast.success("Les informations ont été mises à jour avec succès !");
      } else {
        toast.error("Une erreur est survenue, veuillez réessayer.");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du informations !");
    }
  };

  const handleChangeUserDetails = (e)=>{
    e.preventDefault();
    MySwal.fire({
      title: 'Confirmer la changement',
      text: "Êtes-vous sûr de vouloir changer votre infos ?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Oui, confirmer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmitUserDetails();
      }
    });
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [id]: value,
    }));
  };

  return (
    <div className="flex min-h-screen bg-[#f4f7fe]">
      <main className="flex-1 p-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Your Avatar</h2>
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatar} alt="User avatar" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" className="mr-2" onClick={() => setAvatar("/placeholder.svg?height=100&width=100")}>Télécharger</Button>
              <Button variant="outline" onClick={() => setAvatar("")}>Supprimer</Button>
            </div>
          </div>
          <Separator className="my-6" />
          <div className='flex gap-10 items-center'> 
            <div className='w-[50%]'>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">informations personnelles </h2>         
            <form onSubmit={handleChangeUserDetails} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex gap-5">
                  <div className="w-[50%] space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input 
                      id="nom" 
                      placeholder="Entrez le nom" 
                      value={userDetails.nom} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="w-[50%] space-y-2">
                    <Label htmlFor="prenom">Prenom</Label>
                    <Input 
                      id="prenom" 
                      placeholder="Entrez le prénom" 
                      value={userDetails.prenom} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="exemple@domaine.com" 
                    value={userDetails.email} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input 
                    id="telephone" 
                    type="tel" 
                    placeholder="Entrez le numéro" 
                    value={userDetails.telephone} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
              <Button 
                type="submit"
                className="w-full sm:w-auto" >
                Enregistrer
              </Button>
            </form>
            </div>
            <div className='w-[45%]'>
              <div className=" ">
                <div className="max-w-6xl mx-auto  ">
                  <div className="bg-white  rounded-lg overflow-hidden">
                    <div className="flex">            
                      <div className="flex-1 ">
                        <h2 className="text-xl font-semibold text-gray-900 mb-7">Mot de passe</h2>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                          <div>
                            <Label htmlFor="current-password">Mot de passe actuel*</Label>
                            <Input 
                              type="password"
                              id="current-password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)} 
                              className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="new-password">Nouveau mot de passe*</Label>
                            <Input 
                              type="password" 
                              id="new-password" 
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="mt-1" />
                          </div>
                          <div className="">
                            <Label htmlFor="confirm-password">Confirmez le mot de passe*</Label>
                            <Input
                              type="password"
                              id="confirm-password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="mt-1" />
                          </div>
                          <Button type="submit" className="bg-blue-600  hover:bg-blue-700 text-white">
                          Mettre à jour
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>         
          </div>
          <Separator className="my-6" />
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Supprimer le compte</h3>
              <p className="text-sm text-gray-500">votre compte vous perdrez toutes vos données</p>
            </div>
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">Supprimer le compte</Button>
          </div>
        </div>
      </main>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default Page3;
