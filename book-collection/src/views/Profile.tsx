
import { useEffect, useState } from 'react';
import { useUserContext } from '../hooks/contexHooks';
import { useBook } from '../hooks/graphQLHooks';
import { BookGroup, MediaItemWithOwner, StatusColors } from '@sharedTypes/DBTypes';

const statusColors: StatusColors = {
  'Reading': 'border-blue-500 ',
  'Read': 'border-green-500',
  'Dropped': 'border-red-500',
  'Want to Read': 'border-yellow-500',
  'Paused': 'border-purple-500',
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


useEffect(() => {
  const fetchBooks = async () => {
    if (user) {
      const books = await ownBookList(user.user_id) ;
      setBooks(books);
    }
  };
  fetchBooks();
}, []);


const booksBySeries: BookGroup = books.reduce((acc: BookGroup, book: MediaItemWithOwner) => {
  (acc[book.series_name] = acc[book.series_name] || []).push(book);
  return acc;
}, {});

  return (
  <>
    {user && (
      <>
     <div className=" mx-auto my-10 rounded-lg p-5">
      <img className="w-32 h-32 rounded-full mx-auto" src="https://avatars.cloudflare.steamstatic.com/ce84b1df8d571a6b3cbb255c21c20960fd64aadf_full.jpg" alt="Profile picture" />
      <h2 className="text-3xl font-bold text-center">{user.username}</h2>
      <p className="text-center">Email: {user.email}</p>
      <div className="flex flex-row justify-center  ">
      {Object.entries(statusColorBox).map(([status, color], index) => (
  <div key={index} className="flex items-center mb-2">
    <div className={`w-4 h-4 m-2 ${color}`}></div>
    <p>{status}</p>
  </div>
))}
</div>
  <div className="flex items-center justify-center sm:w-full">
  <div className="mt-5 overflow-auto h-96 w-4/6 sm:w-full">
        {Object.entries(booksBySeries).map(([seriesName, booksInSeries], index) => (
          <div key={index}>
            <h2 className="text-xl font-bold mb-2">{seriesName}</h2>
            {booksInSeries.map((book, bookIndex) => (
              <div key={bookIndex}>
    <div className={`mb-5 min-w-0 rounded-md border-2 ${statusColors[book.status.status_name as keyof StatusColors]}`}>
        <div className="bg-gray-900 rounded-md text-lg overflow-hidden relative grid grid-cols-12 sm:grid-cols-5 sm:w-full">
          <div className="">
              <img
                className="bg-cover bg-no-repeat bg-center w-20 h-28"
                src={book.filename} alt={book.title}
              />
            </div>
            <div className="p-1 px-4 pr-3 col-span-11 sm:col-span-4 sm:w-full">
              <p className="text-base">{book.title}</p>
              <p className="text-base">{book.series_name}</p>
              <p className="pb-0 text-base">{book.book_genre}</p>
            </div>
          </div>
        </div>
              </div>
            ))}
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
