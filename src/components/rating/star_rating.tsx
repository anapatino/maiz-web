import { useState } from 'react';
import { Rating } from '@/domain/rating';
import { RatingRequest } from '../../data/repository/rating_request';

interface StarRatingProps {
  name: string;
  phone: number;
  onClose: () => void;
}

const StarRating: React.FC<StarRatingProps> = ({ name, phone, onClose }) => {
  const [rating, setRating] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [ratingEnabled, setRatingEnabled] = useState<boolean>(true);

  const handleRating = async (rate: number) => {
    setRating(rate);
    setRatingEnabled(false); // Deshabilitar la selección de estrellas después de elegir una
    await submitRating(rate);
  };

  const submitRating = async (rate: number) => {
    const newRating: Rating = {
      name,  // Usa el valor del prop name
      rating: rate,
      phone,  // Usa el valor del prop phone
    };
    try {
      await RatingRequest.addRating(newRating);
      setSubmitted(true);
    } catch (error) {
      console.error('Error adding rating: ', error);
    }
  };

  const handleCloseModal = () => {
    setSubmitted(false);
    setRating(0);
    onClose();
  };

  return (
    <main className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className='bg-white w-[450px] rounded-lg p-5 max-phone:w-[275px] relative'>
        {submitted &&
          <button onClick={handleCloseModal} className="text-black absolute text-3xl top-1 right-3 z-40">
            &times;
          </button>
        }
        <h1 className="text-3xl font-bold text-black justify-center text-center">
          Satisfaction Survey
        </h1>
        <p className="mt-3 text-2xl font-semibold text-black max-phone:text-xl justify-center text-center">
          How satisfied are you with our service?
        </p>
        <div className="flex flex-col items-center">
          <div className="flex space-x-2 pt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                disabled={!ratingEnabled || rating !== 0} // Deshabilitar si no está habilitado o si ya se ha seleccionado una calificación
                className={`text-3xl ${rating >= star ? 'text-[#FCCC00]' : 'text-gray-400'}`}
              >
                ★
              </button>
            ))}
          </div>

          {submitted && <p className="mt-4 font-semibold text-[#FCCC00]">Thank you for your feedback!</p>}

        </div>
      </div>
    </main>
  );
};

export default StarRating;
