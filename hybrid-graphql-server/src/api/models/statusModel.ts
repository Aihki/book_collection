import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Status, statusResult} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {fetchData} from '../../lib/functions';
import {StatusResponse} from '@sharedTypes/MessageTypes';
import {fetchMediaAndStatusById} from './mediaModel';

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

const putStatus = async (
  status: Pick<statusResult, 'status_id'>,
  id: number,
): Promise<StatusResponse | null> => {
  try {
    const rows = promisePool.format(
      `UPDATE BookStatus SET status_id = ? WHERE book_id = ?;`,
      [status.status_id, id],
    );
    const [result] = await promisePool.execute<ResultSetHeader>(rows);
    if (result.affectedRows === 0) {
      return null;
    }

    const statusItem = await fetchMediaAndStatusById(id);
    if (statusItem === null) {
      return null;
    }
    return {message: 'Status updated', status: statusItem};
  } catch (e) {
    console.error('putStatus error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

export {allStatuses, putStatus};
