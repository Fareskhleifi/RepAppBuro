import { useState } from 'react';

const Reclamation = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        recipient: 'director', // Valeur par défaut
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logique pour soumettre le formulaire
        console.log('Données soumises:', formData);
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Soumettre une réclamation</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700" htmlFor="name">Nom</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700" htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700" htmlFor="subject">Sujet</label>
                    <input
                        type="text"
                        name="subject"
                        id="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full mb-5 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out"
                    />
                    <label className="block text-sm font-semibold text-gray-700" htmlFor="recipient">Destinataire</label>
                    <select
                        name="recipient"
                        id="recipient"
                        value={formData.recipient}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out"
                    >
                        <option value="director">Directeur</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700" htmlFor="message">Message</label>
                    <textarea
                        name="message"
                        id="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-4 h-32 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out"
                    />
                </div>
                
                <div className="col-span-1 sm:col-span-2">
                    <button
                        type="submit"
                        className="w-1/5 bg-gray-900 text-white font-semibold py-2.5 rounded-md shadow-md hover:bg-blue-700 transition duration-200 ease-in-out"
                    >
                        Soumettre
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Reclamation;
