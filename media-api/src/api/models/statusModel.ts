import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {statusResult} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {fetchData} from '../../lib/functions';
import {MessageResponse} from '@sharedTypes/MessageTypes';

const allStatuses = async (): Promise<statusResult[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & statusResult[]>(
      `SELECT Status.status_id, Status.status_name, BookStatus.book_id
       FROM Status
       JOIN BookStatus ON Status.status_id = BookStatus.status_id`
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('allStatuses error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

export {allStatuses};
