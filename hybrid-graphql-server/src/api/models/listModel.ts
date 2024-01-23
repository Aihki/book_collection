import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {bookList} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {fetchData} from '../../lib/functions';
import {MessageResponse} from '@sharedTypes/MessageTypes';

//c = collection table
//bs = bookstatus table
//s = status table
//u = users table
const ownBookList = async (id: string): Promise<bookList[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & bookList[]>(
      `SELECT c.*,
      s.status_name,
      u.username,
      u.email
      FROM Collection c
      LEFT JOIN BookStatus bs ON c.book_id = bs.book_id
      LEFT JOIN Status s ON bs.status_id = s.status_id
      LEFT JOIN Users u ON c.user_id = u.user_id
      WHERE c.user_id = ?;`,
      [id]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchAllMedia error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

export {ownBookList};
