import React, { useState } from 'react';
import { X, Star, CheckCircle2 } from 'lucide-react';
import { Order } from '../types';

interface ReviewModalProps {
  order: Order | null;
  onClose: () => void;
  onSubmitReview: (data: {
    orderId: string;
    orderNumber: number;
    customerName: string;
    rating: number;
    comment: string;
  }) => Promise<void>;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  order,
  onClose,
  onSubmitReview
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmitReview({
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      rating,
      comment
    });
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0F2B38] text-[#0B2B3A] dark:text-[#E6F1EF] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#C5DAD6] dark:border-[#1E4252] text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold">Obrigado pela Avaliação!</h3>
            <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
              Sua opinião ajuda nossa equipe a manter a qualidade e o carinho da cozinha caiçara.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <span className="font-serif text-3xl text-[#E8A33D]">Θάλασσα</span>
              <h3 className="font-serif text-xl font-bold">Como foi sua experiência?</h3>
              <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                Avaliação do Pedido #{order.orderNumber}
              </p>
            </div>

            {/* Interactive Stars */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'text-[#E8A33D] fill-[#E8A33D]'
                        : 'text-gray-300 dark:text-gray-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Comment */}
            <div className="text-left space-y-1">
              <label htmlFor="review-comment" className="text-xs font-semibold text-[#4F6B75] dark:text-[#93B0B8]">
                Conte para nós o que achou:
              </label>
              <textarea
                id="review-comment"
                rows={3}
                required
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="O ponto do peixe estava perfeito, o atendimento foi rápido..."
                className="w-full p-3 rounded-xl text-xs sm:text-sm bg-white dark:bg-[#081C26] border border-[#C5DAD6] dark:border-[#1E4252] focus:outline-none focus:ring-2 focus:ring-[#1F7A8C]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#E8A33D] hover:bg-[#F3B353] text-[#0B2B3A] font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
