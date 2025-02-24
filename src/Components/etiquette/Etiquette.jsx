import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools } from '@fortawesome/free-solid-svg-icons';


const Etiquette = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    const qrData = `Nom de l'appareil: PC de Bureau\nNuméro de Série: ABC123456789\nDate de Dépôt: 01 Janvier 2024\nSymptôme de Panne: L'écran ne s'allume pas\nLocalisation: Bureau 101\nPropriétaire: Jean Dupont\nDate de Remise Prévue: 07 Janvier 2024`;

    QRCode.toDataURL(qrData, function (err, url) {
      if (err) console.error(err);
      setQrCodeUrl(url);
    });
  }, []);

  return (
    <div className="flex justify-center items-center  h-screen bg-white">
      <div className="flex w-[120mm] h-[70mm] border-2 border-teal-700 p-5  bg-white rounded-lg shadow-lg justify-between items-center">
        {/* Left Section */}
        <div className="flex flex-col w-8/12 leading-4 justify-between  text-xs">
          <div className="w-12 h-12  bg-teal-700 text-white flex items-center justify-center rounded-full mb-3">
          <FontAwesomeIcon icon={faTools} />
          </div>
          <div className="font-bold text-lg text-teal-700 mb-2">Appareil en Réparation</div>
          <div className="mb-1 text-gray-600">
            <span className="font-bold text-teal-700">Numéro de Série:</span> ABC123456789
          </div>
          <div className="mb-1 text-gray-600">
            <span className="font-bold text-teal-700">Date de Dépôt:</span> 01 Janvier 2024
          </div>
          <div className="mb-1 text-gray-600">
            <span className="font-bold text-teal-700">Symptôme de Panne:</span> Lécran ne sallume pas
          </div>
          <div className="mb-1 text-gray-600">
            <span className="font-bold text-teal-700">Localisation:</span> Bureau 101
          </div>
          <div className="mb-1 text-gray-600">
            <span className="font-bold text-teal-700">Propriétaire:</span> Jean Dupont
          </div>
          <div className="text-gray-600">
            <span className="font-bold text-teal-700">Date de Remise Prévue:</span> 07 Janvier 2024
          </div>
        </div>

        {/* QR Code Section */}
        <div className="w-[45mm] h-[45mm] ml-1 flex justify-center items-center">
          <img src={qrCodeUrl} alt="QR Code" className="w-full h-auto border border-gray-300 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default Etiquette;
