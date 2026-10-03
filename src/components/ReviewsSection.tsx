import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReviewsSection: React.FC = () => {
  const { reviews, addReview } = useApp();
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  const approvedReviews = reviews.filter((r) => r.status === 'approved');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    addReview({
      name: name.trim(),
      rating,
      comment: comment.trim(),
      verifiedOrder: true,
    });

    setSubmittedFeedback(true);
    setTimeout(() => {
      setIsSubmitOpen(false);
      setSubmittedFeedback(false);
      setName('');
      setComment('');
      setRating(5);
    }, 1500);
  };

  return (
    <section className="py-20 bg-[#FFFDF8] border-y border-[#E9DDC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#68705A] font-semibold mb-2">
              COMMUNITY VOICES
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#24364B] tracking-tight">
              Words From The Rooftop
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#765D49] max-w-lg">
              Reflections and stories shared by diners enjoying evenings on our 5th-floor terrace in Jamnagar.
            </p>
          </div>

          <button
            onClick={() => setIsSubmitOpen(true)}
            className="mt-4 md:mt-0 px-5 py-2.5 bg-[#24364B] hover:bg-[#68705A] text-[#FFFDF8] rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer self-start"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#B99568]" />
            <span>Leave A Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#F7F2E8] border border-[#E9DDC9] p-6 rounded-sm shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-3 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-[#24364B] leading-relaxed italic font-serif">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author footer */}
              <div className="mt-5 pt-3 border-t border-[#E9DDC9]/70 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#24364B]">{rev.name}</div>
                  <div className="text-[10px] text-[#765D49]">{rev.date}</div>
                </div>

                {rev.verifiedOrder && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Diner</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Review Modal */}
        {isSubmitOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FFFDF8] border border-[#B99568] max-w-md w-full p-6 rounded-sm shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#E9DDC9]">
                <h4 className="font-serif text-xl font-bold text-[#24364B]">
                  Share Your Rooftop Experience
                </h4>
                <button
                  onClick={() => setIsSubmitOpen(false)}
                  className="text-gray-400 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submittedFeedback ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                  <p className="font-serif text-lg font-bold text-[#24364B]">
                    Thank you for your review!
                  </p>
                  <p className="text-xs text-[#765D49] mt-1">
                    Your kind feedback has been recorded for the team.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#24364B] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priyank Patel"
                      className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#24364B] mb-1">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#24364B] mb-1">
                      Your Comments *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you love about the food, chai, or rooftop evening?"
                      className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#24364B] hover:bg-[#68705A] text-white font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
