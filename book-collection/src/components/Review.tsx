import {useEffect, useRef} from 'react';
import {useForm} from '../hooks/formHooks';
import {useReviewtStore} from '../store';
import { useReview } from '../hooks/graphQLHooks';
import { MediaItemWithOwner } from '@sharedTypes/DBTypes';
import { useUserContext } from '../hooks/contexHooks';



const Review = ({item}: {item: MediaItemWithOwner}) => {
  const {review, setReview} = useReviewtStore();
  const {user} = useUserContext();
  const formRef = useRef<HTMLFormElement>(null);
  const { postReview, getReviewByBookId} = useReview();

  const initValues = {review_text: ''};

  const doReview = async () => {
    const token = localStorage.getItem('token');
    if (!user || !token) {
      return;
    }
    try {
      await postReview(inputs.review_text,item.book_id, token);
      console.log('postReview')
      await getReview();
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error('postReview failed', error);
    }
  };

  const {handleSubmit, handleInputChange, inputs} = useForm(
    doReview,
    initValues,
  );

  const getReview = async () => {
    try {
      const review = await getReviewByBookId(item.book_id);
      setReview(review);
      console.log('review',review)
    } catch (error) {
      console.error('getReview  failed', error);
      setReview([]);
    }
  };

  useEffect(() => {
    getReview();
  }, []);

  return (
    <>
{user && (
        <>
          <h3 className="text-xl">Add Review</h3>
          <form onSubmit={handleSubmit} ref={formRef}>
            <div className="flex w-4/5">
              <label className="w-1/3 p-6 text-end" htmlFor="review">
              Review
              </label>
              <input
                className="m-3 w-2/3 rounded-md border border-slate-500 p-3 text-slate-950"
                name="review_text"
                type="text"
                id="review"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex w-4/5 justify-end">
              <button
                className="m-3 w-1/3 rounded-md bg-slate-700 p-3"
                type="submit"
              >
                Post
              </button>
            </div>
          </form>
        </>
    )}

{review.length > 0 && (
  <>
    <h3 className="text-xl text-center">Review</h3>
    <ul>
      {review.map((rew) => (
        <li key={rew.review_id}>
          <div className="rounded-md border border-slate-200 bg-slate-800 p-3 text-slate-100 text-center">
            <span className="font-bold text-slate-200">
              On{' '}
              {new Date(rew.created_at!).toLocaleDateString('fi-FI')}{' '}
            </span>
            <span className="font-bold text-slate-200">
              {rew.username} wrote:
            </span>
            <span className="ml-2">{rew.review_text}</span>
          </div>
        </li>
      ))}
    </ul>
  </>
)}

    </>
  );
};

export default Review;


