
import { useEffect, useState } from 'react';
import { useUserContext } from '../hooks/contexHooks';
import { useBook } from '../hooks/graphQLHooks';
import { BookGroup, MediaItemWithOwner, StatusColors } from '@sharedTypes/DBTypes';
import { Link } from 'react-router-dom';


const statusColors: StatusColors = {
  'Reading': 'border-b-8 border-blue-500 ',
  'Read': 'border-b-8 border-green-500',
  'Dropped': 'border-b-8 border-red-500',
  'Want to Read': 'border-b-8 border-yellow-500',
  'Paused': 'border-b-8 border-purple-500',
};
const statusColorBox: StatusColors = {
  'Reading': 'bg-blue-500 ',
  'Read': 'bg-green-500',
  'Dropped': 'bg-red-500',
  'Want to Read': 'bg-yellow-500',
  'Paused': 'bg-purple-500',
};

const Profile = () => {
const {user} = useUserContext();
const {ownBookList} = useBook();
const [books, setBooks] = useState<MediaItemWithOwner[]>([]);
const [expandedSeries, setExpandedSeries] = useState<string | null>(null);
const {handleLogout} = useUserContext();


useEffect(() => {
  const fetchBooks = async () => {
    if (user) {
      const books = await ownBookList(user.user_id) ;
      setBooks(books);
    }
  };
  fetchBooks();
}, []);


let booksBySeries: BookGroup = {};

if (books) {
  booksBySeries = books.reduce((acc: BookGroup, book: MediaItemWithOwner) => {
    (acc[book.series_name] = acc[book.series_name] || []).push(book);
    return acc;
  }, {});
}

  return (
  <>
    {user &&(
      <>
     <div className=" mx-auto my-10 rounded-lg p-5">
      <img className="w-32 h-32 rounded-full mx-auto" src="https://avatars.cloudflare.steamstatic.com/ce84b1df8d571a6b3cbb255c21c20960fd64aadf_full.jpg" alt="Profile picture" />
      <h2 className="text-3xl font-bold text-center">{user.username}</h2>
      <p className="text-center">Email: {user.email}</p>
      <div className="flex items-center justify-center">
  <button className="m-2 bg-red-500 p-2 rounded-md text-center font-bold" onClick={handleLogout}>Logout</button>
</div>
      <div className="flex flex-row justify-center sm:grid sm:grid-cols-2">
      {Object.entries(statusColorBox).map(([status, color], index) => (
  <div key={index} className="flex items-center mb-2">
    <div className={`w-4 h-4 m-2 ${color}`}></div>
    <p>{status}</p>
  </div>
))}
</div>

  <div className="flex items-center justify-center h-screen sm:w-full text-white">
  <div className="mt-5 overflow-auto h-3/5 w-5/6 sm:w-full">
    {Object.entries(booksBySeries).map(([seriesName, booksInSeries], index) => (
      <div key={index} className="mb-5 p-5 bg-neutral-500 shadow-lg rounded-lg">
        <h2 className="text-2xl mb-5 text-center cursor-pointer" onClick={() => setExpandedSeries(seriesName === expandedSeries ? null : seriesName)}>
          {seriesName}
        </h2>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-1">
  {seriesName === expandedSeries && booksInSeries.map((book, bookIndex) => (
    <div key={bookIndex}>
      <Link to="/single" state={book}>
      <div className={`mb-5 min-w-0 rounded-md ${statusColors[book.status.status_name as keyof StatusColors]}`}>
          <div className="bg-gray-700  rounded-md text-lg overflow-hidden relative flex flex-col">
            <div className="w-full">
              <div className="block bg-no-repeat bg-top bg-cover h-56 w-full mt-0" style={{ backgroundImage: `url(${book.filename})` }}></div>
            </div>
            <div className="p-1 px-4 pr-3 w-full">
              <p className="text-base font-bold">Book tittle: {book.title}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  ))}
</div>
      </div>
    ))}
  </div>
</div>
    </div>
      </>
    )}
  </>

  )
};

export default Profile;
