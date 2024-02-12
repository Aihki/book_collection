
import FeedRow from '../components/FeedRow';
import { useBook } from '../hooks/apiHooks';

const Home = () => {

 const mediaArray = useBook();
console.log(mediaArray);

  return (
    <>
      <h2>Activity</h2>
      <div className="activity">
        {mediaArray.map((item) => (
          <FeedRow key={item.book_id} item={item} />
        ))}
      </div>
    </>
  );
};

export default Home;
