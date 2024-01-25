import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Status, statusResult} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {fetchData} from '../../lib/functions';
import {MessageResponse} from '@sharedTypes/MessageTypes';

const allStatuses = async (): Promise<Status[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Status[]>(
      `SELECT * FROM Status;`,
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
