import {useEffect, useRef} from 'react';
import {useForm} from '../hooks/formHooks';
import {useReviewtStore} from '../store';
import { useReview } from '../hooks/graphQLHooks';
import { MediaItemWithOwner } from '@sharedTypes/DBTypes';
import { useUserContext } from '../hooks/contexHooks';



const Review = ({book}: {book: MediaItemWithOwner}) => {
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
      await postReview(inputs.review_text,book.book_id, token);
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
      const review = await getReviewByBookId(book.book_id);
      console.log('review', review);
      setReview(review);
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
    <h3 className="text-l font-bold pb-1 pr-3">Review</h3>
    <div className="p-4 w-11/12 bg-neutral-600 rounded-md">
  {review.length > 0 ? (
    <div className="flex flex-col items-center">
      <div className="rounded-md border border-slate-200 bg-slate-800 p-3 text-slate-100 text-center overflow-auto break-words max-w-2xl sm:max-w-sm xs:max-w-xs">
        <span className="font-bold text-slate-200">
          On{' '}
          {new Date(Number(review[0].created_at)).toLocaleDateString('fi-FI')}
        </span>
        <span className="font-bold text-slate-200">
          {review[0].username} wrote:
        </span>
        <span className="ml-2">{review[0].review_text}</span>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center border-2  border-slate-200 bg-slate-800 p-3 text-slate-100 rounded-md">
      <p>There is no review.</p>
    </div>
  )}
  {user?.user_id === book.owner.user_id && review.length === 0 && (
    <>
      <h3 className="text-xl">Add Review</h3>
      <form onSubmit={handleSubmit} ref={formRef} className="mx-auto">
        <div className="flex">
          <input
            className="m-3 rounded-md border border-slate-500 p-3 text-slate-950 w-full"
            name="review_text"
            type="text"
            id="review"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex justify-center">
          <button
            className="m-3 rounded-md bg-cyan-600 p-3 font-bold"
            type="submit"
          >
            Post
          </button>
        </div>
      </form>
    </>
  )}
</div>
  </>
  );
};

export default Review;


