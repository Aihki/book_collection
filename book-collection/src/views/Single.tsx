import { MediaItemWithOwner } from "@sharedTypes/DBTypes";
import { useLocation } from "react-router-dom";
import { NavigateFunction, useNavigate } from "react-router-dom";
import Review from "../components/Review";
import Likes from "../components/Like";
import Rating from "../components/Rating";
import Status from "../components/Status";


const Single = () => {
  const { state } = useLocation();
  const book: MediaItemWithOwner = state;
  const navigate: NavigateFunction = useNavigate();
  return (
    <>
      <div className="single-book">
        <div className="grid grid-cols-6 sm:grid-cols-1">
            <img className="w-52 h-72 sm:hidden " src={book.thumbnail} alt={book.title} />
            <div className="hidden sm:block sm:bg-center sm:bg-cover sm:bg-no-repeat sm:h-56 sm:w-full sm:mt-0"   style={{ backgroundImage: `url(${book.filename})` }}></div>
          <div className="col-span-5  m-0 text-xl leading-4 p-3.5">
            <h3>{book.title}</h3>
            <p>{book.description}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row sm:flex-col">
        <div className="single-book-side mb-4 sm:mb-0 sm:mr-4">
          <div className="rounded-2xl p-4 sm:flex sm:mb-6 sm:overflow-x-auto sm:whitespace-nowrap ">
            <div>
            <p className="text-l font-bold pb-1 pr-3">Series Name</p>
            <p className="text-base pr-5">{book.series_name}</p>
            </div>
            <div>
            <p className="text-l font-bold pb-1 pr-3">Satus</p>
            <Status book={book} />
            </div>
            <div>
            <p className="text-l font-bold pb-1 pr-3">Genre</p>
            <p className="text-base pr-5">{book.book_genre}</p>
            </div>
            <div>
            <p className="text-l font-bold pb-1 pr-3">Likes</p>
              <Likes book={book} />
            </div>
            <div>
            <p className="text-l font-bold pb-1 pr-3">Rating</p>
            <Rating book={book} />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full">
           <Review book={book} />
            </div>
      </div>
      <div className="flex items-center justify-center">
  <button
    className="m-3 w-3/5 rounded-md flex items-center justify-center bg-slate-700 p-3"
    onClick={() => {
      navigate(-1);
    }}
  >
    return
  </button>
</div>
    </>
  );
};
export default Single;
