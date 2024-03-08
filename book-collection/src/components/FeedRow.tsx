import { Link } from 'react-router-dom';
import { MediaItemWithOwner } from '@sharedTypes/DBTypes';


const FeedRow = (props: { book: MediaItemWithOwner }) => {
  const { book } = props;



  return (
    <Link to="/single" state={book}>
      <div className="mb-5 min-w-0 max-w-2xl mx-auto">
        <div className="bg-gray-900 rounded-md text-lg overflow-hidden relative flex flex-col">
          <div className="w-full">
          <div className="block bg-no-repeat bg-top bg-cover h-56 w-full mt-0" style={{ backgroundImage: `url(${book.filename})` }}></div>
            {/* <img
              className="object-contain bg-no-repeat bg-center"
              src={item.filename}
              alt={item.title}
            /> */}
          </div>
          <div className="p-1 px-4 pr-3 w-full">
            <p className="text-base">{book.title}</p>
            <p className="text-base">{book.series_name}</p>
            <p className="pb-0 text-base">{book.owner.username}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeedRow;
