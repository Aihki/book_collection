import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {
  MediaItem,
  TokenContent,
  bookList,
  statusResult,
} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {fetchData} from '../../lib/functions';
import {MediaResponse, MessageResponse} from '@sharedTypes/MessageTypes';

/**
 * Get all media items from the database
 *
 * @returns {array} - array of media items
 * @throws {Error} - error if database query fails
 */

const fetchAllMedia = async (): Promise<MediaItem[] | null> => {
  const uploadPath = process.env.UPLOAD_URL;
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & MediaItem[]>(
      `SELECT c.*,
        s.status_name,
        u.username,
        r.review_text,
        ra.rating_value,
        CONCAT(?, c.filename) AS filename,
        CONCAT(?, CONCAT(c.filename, "-thumb.png")) AS thumbnail
        FROM Collection c
        LEFT JOIN Reviews r ON c.book_id = r.book_id
        LEFT JOIN Ratings ra ON c.book_id = ra.book_id
        LEFT JOIN BookStatus bs ON c.book_id = bs.book_id
        LEFT JOIN Status s ON bs.status_id = s.status_id
        LEFT JOIN Users u ON c.user_id = u.user_id;`,

      [uploadPath, uploadPath],
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
//c = collection table
//u = users table
const ownBookList = async (id: string): Promise<bookList[] | null> => {
  const uploadPath = process.env.UPLOAD_URL;
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & bookList[]>(
      `SELECT c.*,
      CONCAT(?, c.filename) AS filename,
      CONCAT(?, CONCAT(c.filename, "-thumb.png")) AS thumbnail,
      s.status_name,
      u.username,
      r.review_text,
      ra.rating_value
      FROM Collection c
      LEFT JOIN Reviews r ON c.book_id = r.book_id
      LEFT JOIN Ratings ra ON c.book_id = ra.book_id
      LEFT JOIN BookStatus bs ON c.book_id = bs.book_id
      LEFT JOIN Status s ON bs.status_id = s.status_id
      LEFT JOIN Users u ON c.user_id = u.user_id
      WHERE c.user_id = ?;
`,
      [uploadPath, uploadPath, id],
    );

    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error(' ownbooklist error error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};


/**
 * Get media item by id from the database
 *
 * @param {number} id - id of the media item
 * @returns {object} - object containing all information about the media item
 * @throws {Error} - error if database query fails
 */

const fetchMediaById = async (id: string): Promise<MediaItem | null> => {
  const uploadPath = process.env.UPLOAD_URL;
  try {
    const sql = `SELECT *,
                CONCAT(?, filename) AS filename,
                CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail
                FROM Collection
                WHERE book_id=?`;
    const params = [uploadPath, uploadPath, id];
    const [rows] = await promisePool.execute<RowDataPacket[] & MediaItem[]>(
      sql,
      params,
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('fetchMediaById error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const fetchBooksStatus = async (
  id: string,
): Promise<statusResult | null> => {
  try {
    const sql = `SELECT s.status_name
    FROM Collection c
    LEFT JOIN BookStatus bs ON c.book_id = bs.book_id
    LEFT JOIN Status s ON bs.status_id = s.status_id
    WHERE c.book_id = ?`;
    const params = [id];
    const [rows] = await promisePool.execute<RowDataPacket[] & statusResult[]>(
      sql,
      params,
    );

    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('fetchMediaAndStatusById error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Add new media item to database
 *
 * @param {object} media - object containing all information about the new media item
 * @returns {object} - object containing id of the inserted media item in db
 * @throws {Error} - error if database query fails
 */
const postMedia = async (
  media: Omit<MediaItem, 'book_id' | 'created_at' | 'thumbnail'>,
): Promise<MediaItem | null> => {
  const {
    user_id,
    filename,
    filesize,
    media_type,
    title,
    description,
    book_genre,
    series_name,
  } = media;
  const sql = `INSERT INTO Collection (user_id, filename, filesize, media_type, title, description, book_genre, series_name)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    user_id,
    filename,
    filesize,
    media_type,
    title,
    description,
    book_genre,
    series_name,
  ];
  try {
    const result = await promisePool.execute<ResultSetHeader>(sql, params);
    const addSatus = await promisePool.execute<ResultSetHeader>(
      `INSERT INTO BookStatus (book_id, status_id)
      VALUES (?, 4)`,
      [result[0].insertId],
    );
    if (addSatus[0].affectedRows === 0) {
      return null;
    }

    const [rows] = await promisePool.execute<RowDataPacket[] & MediaItem[]>(
      'SELECT * FROM Collection WHERE book_id = ?',
      [result[0].insertId],
    );

    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Update media item in database
 *
 * @param {object} media - object containing all information about the media item
 * @param {number} id - id of the media item
 * @returns {object} - object containing id of the updated media item in db
 * @throws {Error} - error if database query fails
 */

const putMedia = async (
  media: Pick<MediaItem, 'title' | 'description'>,
  id: string,
): Promise<MediaResponse | null> => {
  try {
    const sql = promisePool.format(
      'UPDATE Collection SET ? WHERE book_id = ?',
      [media, id],
    );
    const result = await promisePool.execute<ResultSetHeader>(sql);
    if (result[0].affectedRows === 0) {
      return null;
    }

    const mediaItem = await fetchMediaById(id);
    if (!mediaItem) {
      return null;
    }
    return {message: 'Media updated', media: mediaItem};
  } catch (e) {
    console.error('error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Delete media item from database
 *
 * @param {number} id - id of the media item
 * @returns {object} - object containing id of the deleted media item in db
 * @throws {Error} - error if database query fails
 */

const deleteMedia = async (
  id: string,
  user: TokenContent,
  token: string,
): Promise<MessageResponse> => {
  /*   console.log('deleteMedia', id); */
  const media = await fetchMediaById(id);
  /*   console.log(media); */
  if (!media) {
    return {message: 'Media not found'};
  }

  // if admin add user_id from media object to user object from token content
  if (user.level_name === 'Admin') {
    user.user_id = media.user_id;
  }

  // remove environment variable UPLOAD_URL from filename
  media.filename = media?.filename.replace(
    process.env.UPLOAD_URL as string,
    '',
  );

  /*   console.log(token); */

  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();



    await connection.execute('DELETE FROM Ratings WHERE book_id = ?;', [id]);

    await connection.execute('DELETE FROM Reviews WHERE book_id = ?;', [id]);

    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM Collection WHERE book_id = ? and user_id = ?;',
      [id, user.user_id],
    );

    if (result.affectedRows === 0) {
      return {message: 'Media not deleted'};
    }

    // delete file from upload server
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    console.log(media.filename);
    console.log('options', options);
    const deleteResult = await fetchData<MessageResponse>(
      `${process.env.UPLOAD_SERVER}/delete/${media.filename}`,
      options,
    );

    console.log('deleteResult', deleteResult);
    if (deleteResult.message !== 'File deleted') {
      throw new Error('File not deleted');
    }

    // if no errors commit transaction
    await connection.commit();

    return {message: 'Media deleted'};
  } catch (e) {
    await connection.rollback();
    console.error('error', (e as Error).message);
    throw new Error((e as Error).message);
  } finally {
    connection.release();
  }
};

/**
 * Get all the most liked media items from the database
 *
 * @returns {object} - object containing all information about the most liked media item
 * @throws {Error} - error if database query fails
 */

const fetchMostLikedMedia = async (): Promise<MediaItem | undefined> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & MediaItem[]>(
      'SELECT * FROM `MostLikedMedia`',
    );
    if (rows.length === 0) {
      return undefined;
    }
    rows[0].filename =
      process.env.MEDIA_SERVER + '/uploads/' + rows[0].filename;
  } catch (e) {
    console.error('getMostLikedMedia error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Get all the most commented media items from the database
 *
 * @returns {object} - object containing all information about the most commented media item
 * @throws {Error} - error if database query fails
 */

const fetchMostCommentedMedia = async (): Promise<MediaItem | undefined> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & MediaItem[]>(
      'SELECT * FROM `MostCommentedMedia`',
    );
    if (rows.length === 0) {
      return undefined;
    }
    rows[0].filename =
      process.env.MEDIA_SERVER + '/uploads/' + rows[0].filename;
  } catch (e) {
    console.error('getMostCommentedMedia error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Get all the highest rated media items from the database
 *
 * @returns {object} - object containing all information about the highest rated media item
 * @throws {Error} - error if database query fails
 */

const fetchHighestRatedMedia = async (): Promise<MediaItem | undefined> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & MediaItem[]>(
      'SELECT * FROM `HighestRatedMedia`',
    );
    if (rows.length === 0) {
      return undefined;
    }
    rows[0].filename =
      process.env.MEDIA_SERVER + '/uploads/' + rows[0].filename;
    return rows[0];
  } catch (e) {
    console.error('getHighestRatedMedia error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};



export {
  fetchAllMedia,
  fetchMediaById,
  postMedia,
  deleteMedia,
  fetchMostLikedMedia,
  fetchMostCommentedMedia,
  fetchHighestRatedMedia,
  putMedia,
  ownBookList,
  fetchBooksStatus,
};
