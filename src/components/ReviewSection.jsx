import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ReviewSection.css';

export default function ReviewSection({ propertyId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([
    { id: 1, userId: 'g2', userName: 'Carlos M.', text: 'Excelente lugar, muy limpio y ordenado.', rating: 5 },
    { id: 2, userId: 'g3', userName: 'Ana L.', text: 'Buena ubicación pero faltaban toallas.', rating: 4 }
  ]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);

  // Mock checking if the user has completed a reservation for this property
  const hasCompletedReservation = user && user.role === 'Huesped';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;

    const review = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      text: newReview,
      rating: rating
    };

    setReviews([review, ...reviews]);
    setNewReview('');
  };

  return (
    <div className="review-section glass-panel mt-xl">
      <h3 className="mb-md">Reseñas ({reviews.length})</h3>
      
      <div className="reviews-list mb-lg">
        {reviews.map(rev => (
          <div key={rev.id} className="review-item">
            <div className="review-header">
              <div className="review-avatar">{rev.userName.charAt(0)}</div>
              <div>
                <h4>{rev.userName}</h4>
                <div className="stars">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</div>
              </div>
            </div>
            <p className="review-text">{rev.text}</p>
          </div>
        ))}
      </div>

      {hasCompletedReservation ? (
        <form onSubmit={handleSubmit} className="review-form">
          <h4 className="mb-sm">Deja tu reseña</h4>
          <div className="rating-select mb-sm">
            <label>Calificación: </label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value="5">5 Estrellas - Excelente</option>
              <option value="4">4 Estrellas - Muy Bueno</option>
              <option value="3">3 Estrellas - Bueno</option>
              <option value="2">2 Estrellas - Regular</option>
              <option value="1">1 Estrella - Malo</option>
            </select>
          </div>
          <textarea 
            className="input-field textarea mb-sm" 
            placeholder="¿Cómo fue tu estancia?" 
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            required
            rows="3"
          />
          <button type="submit" className="btn-primary">Publicar Reseña</button>
        </form>
      ) : (
        <p className="text-muted"><small>Solo los huéspedes que han completado una estancia pueden dejar reseñas.</small></p>
      )}
    </div>
  );
}
