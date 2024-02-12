import {Link} from 'react-router-dom';
import { MediaItemWithOwner} from '@sharedTypes/DBTypes';

const FeedRow = (props: {item: MediaItemWithOwner}) => {
  const {item} = props;
  return (
    <Link to="/single" state={item}>
      <div className="feed-container">
        <div className="feed-item">
          <div className="feed-item-row">
            <span
              className="feed-item-image"
              style={{backgroundImage: `url(${item.thumbnail})`}}
            ></span>
            <div className="feed-item-info">
              <p className="feed-item-title">{item.title}</p>
              <p className="feed-item-description">{item.series_name}</p>
              <p className="feed-item-owner">{item.owner.username}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeedRow;
