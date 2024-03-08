import { MediaItemWithOwner } from "@sharedTypes/DBTypes";
import { useUserContext } from "../hooks/contexHooks";
import { useRating } from "../hooks/graphQLHooks";
import { useRatingStore } from "../store";
import { useEffect } from "react";




const Star = ({ filled, onClick }: { filled: boolean, onClick: () => void }) => (
  <span onClick={onClick}>{filled ? '⭐' : '☆'}</span>
);

const Rating = ({book}: {book: MediaItemWithOwner})  => {
  const {user} = useUserContext();
  const {rating, setRating} = useRatingStore();
  const {postRating, getRatingByBookId} = useRating();


  const doRating = async (rating: number) => {
    const token = localStorage.getItem('token');
    if (!user || !token) {
      return;
    }
    try {
      await postRating(rating, book.book_id, token);
      await getRating();
    } catch (error) {
      console.error('postRating failed', error);
    }
  };

  const getRating = async () => {
    try {
      const rating = await getRatingByBookId(book.book_id);
      setRating(rating);
    } catch (error) {
      setRating([]);
      console.error('getRating  failed', error);
    }
  };

  useEffect(() => {
    getRating();
  }, []);

  return (
        <>
        <div className="flex">
          {[1, 2, 3, 4, 5].map(value => (
            <Star
              key={value}
              filled={rating && rating.length > 0 && value <= (rating[0]?.rating_value ?? 0)}
              onClick={() => {
                if (user?.user_id === book.owner.user_id) {
                  doRating(value);
              }
              }
            }
            />
          ))}
        </div>
      </>
  );
};

export default Rating;
