import {Link} from 'react-router-dom';
import { MediaItemWithOwner} from '@sharedTypes/DBTypes';


const FeedRow = (props: {item: MediaItemWithOwner}) => {
  const {item} = props;

  return (
      <Link to="/single" state={item}>
        <div className="mb-5 min-w-0 ">
          <div className="bg-gray-900 rounded-md text-lg overflow-hidden relative grid grid-cols-12 sm:grid-cols-5">
            <div className="">
                <img
                  className="bg-cover bg-no-repeat bg-center w-20 h-28"
                  src={item.filename}
                  alt={item.title}
                />
              </div>
              <div className="p-1 px-4 pr-3 col-span-11 sm:col-span-4">
                <p className="text-base">{item.title}</p>
                <p className="text-base">{item.series_name}</p>
                <p className="pb-0 text-base">{item.owner.username}</p>
              </div>
            </div>
          </div>
      </Link>
  );
};

export default FeedRow;
