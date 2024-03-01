import { MediaItemWithOwner } from "@sharedTypes/DBTypes";
import { useLocation } from "react-router-dom";
import { NavigateFunction, useNavigate } from "react-router-dom";
import Review from "../components/Review";
import Likes from "../components/Like";
import Rating from "../components/Rating";
import Status from "../components/Status";


const Single = () => {
  const { state } = useLocation();
  const item: MediaItemWithOwner = state;
  const navigate: NavigateFunction = useNavigate();
  return (
    <>
      <div className="single-book">
        <div className="grid grid-cols-6 sm:grid-cols-1">
            <img className="w-52 h-72 sm:hidden " src={item.thumbnail} alt={item.title} />
            <div className="hidden sm:block sm:bg-center sm:bg-cover sm:bg-no-repeat sm:h-56 sm:w-full  sm:mt-0"   style={{ backgroundImage: `url(${item.filename})` }}></div>
          <div className="col-span-5  m-0 text-xl leading-4 p-3.5">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </div>
      </div>
      <div className="mt-0">
        <div className="single-book-side">
          <div className="rounded-2xl p-4 sm:flex sm:mb-6 sm:overflow-x-auto sm:whitespace-nowrap ">
            <div>
            <p className="text-l font-bold pb-1 pr-3">Series Name</p>
            <p className="text-base pr-5">{item.series_name}</p>
            </div>
            <div>
            <p className="text-l font-bold pb-1 pr-3">Satus</p>
            <Status item={item} />
            </div>
            <div>
            <p className="text-l font-bold pb-1 pr-3">Genre</p>
            <p className="text-base pr-5">{item.book_genre}</p>
            </div>
            <div>
            <p className="text-l font-bold pb-1 pr-3">Likes</p>
              <Likes item={item} />

            </div>
            <p className="text-l font-bold pb-1 pr-3">Rating</p>
            <Rating item={item} />
          </div>
        </div>
      </div>
      <button
        className="close"
        onClick={() => {
          navigate(-1);
        }}
      >
        return
      </button>
      < Review item={item} />
    </>
  );
};
export default Single;
