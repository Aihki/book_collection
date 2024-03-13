
import FeedRow from '../components/FeedRow';
import { useBook } from '../hooks/graphQLHooks';

const Home = () => {

 const {mediaArray} = useBook();


//  if (mediaArray.length === 0) {
//   return (
//     <div className="h-screen flex items-center justify-center">
//       <p className="text-2xl text-center">There were no books.</p>
//     </div>
//   );
// }

  return (
    <>
    <h2 className="text-3xl flex items-center justify-center p-3">Activity Feed</h2>
    <div className="activity">
      {mediaArray && mediaArray.length > 0 ? (
        mediaArray.map((book) => (
          <FeedRow key={book.book_id} book={book} />
        ))
      ) : (
        <div className="h-screen flex items-center justify-center">
          <p className="text-2xl text-center">No books added.</p>
        </div>
      )}
    </div>
  </>
  );
};

export default Home;
