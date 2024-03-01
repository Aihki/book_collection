
import FeedRow from '../components/FeedRow';
import { useBook } from '../hooks/graphQLHooks';

const Home = () => {

 const {mediaArray} = useBook();

  return (
    <>
      <h2 className="text-3xl">Activity</h2>
      <div className="activity">
        {mediaArray.map((item) => (
          <FeedRow key={item.book_id} item={item} />
        ))}
      </div>
    </>
  );
};

export default Home;
