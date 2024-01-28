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
      `SELECT *,
      CONCAT(?, filename) AS filename,
      CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail
      FROM Collection`,
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
//bs = bookstatus table
//s = status table
//u = users table
const ownBookList = async (id: number): Promise<bookList[] | null> => {
  try {
    console.log('ownBookList id', id);
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
      [id],
    );
    if (rows.length === 0) {
      return null;
    }
    console.log('ownBookList rows', rows);
    return rows;
  } catch (e) {
    console.error(' own booklist error error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// Request a list of media items by tag
const fetchMediaByTag = async (tag: string): Promise<MediaItem[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & MediaItem[]>(
      `SELECT Collection.*,
      CONCAT(?, Collection.filename) AS filename,
      CONCAT(?, CONCAT(Collection.filename, "-thumb.png")) AS thumbnail
      FROM Collection
      JOIN GenreTags ON Collection.book_id = GenreTags.book_id
      JOIN Tags ON GenreTags.tag_id = Tags.tag_id
      WHERE Tags.tag_name = ?`,
      [process.env.UPLOAD_URL, process.env.UPLOAD_URL, tag],
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchMediaByTag error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const fetchAllMediaByAppId = async (
  id: string,
): Promise<MediaItem[] | null> => {
  const uploadPath = process.env.UPLOAD_URL;
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & MediaItem[]>(
      `SELECT *,
      CONCAT(?, filename) AS filename,
      CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail
      FROM Collection
      WHERE app_id = ?`,
      [uploadPath, uploadPath, id],
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

/**
 * Get media item by id from the database
 *
 * @param {number} id - id of the media item
 * @returns {object} - object containing all information about the media item
 * @throws {Error} - error if database query fails
 */

const fetchMediaById = async (id: number): Promise<MediaItem | null> => {
  const uploadPath = process.env.UPLOAD_URL;
  try {
    // TODO: replace * with specific column names needed in this case
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

const fetchMediaAndStatusById = async (
  id: number,
): Promise<statusResult | null> => {
  try {
    const sql = `SELECT c.*, s.status_name
    FROM Collection c
    LEFT JOIN BookStatus bs ON c.book_id = bs.book_id
    LEFT JOIN Status s ON bs.status_id = s.status_id
    WHERE c.book_id = ?;`;
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
  console.log('postMedia', media);
  const {
    user_id,
    filename,
    filesize,
    media_type,
    title,
    description,
    book_genre,
  } = media;
  const sql = `INSERT INTO Collection (user_id, filename, filesize, media_type, title, description, book_genre)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    user_id,
    filename,
    filesize,
    media_type,
    title,
    description,
    book_genre,
  ];
  try {
    const result = await promisePool.execute<ResultSetHeader>(sql, params);
    console.log('result', result);
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
    console.log('rows', rows[0]);
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
  id: number,
): Promise<MediaResponse | null> => {
  try {
    const sql = promisePool.format(
      'UPDATE Collection SET ? WHERE book_id = ?',
      [media, id],
    );
    const result = await promisePool.execute<ResultSetHeader>(sql);
    console.log('result', result);
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
  id: number,
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
    /*
    await connection.execute('DELETE FROM Likes WHERE book_id = ?;', [id]);
    await connection.execute('DELETE FROM Comments WHERE book_id = ?;', [id]); */

    await connection.execute('DELETE FROM BookStatus WHERE book_id = ?;', [id]);

    await connection.execute('DELETE FROM Ratings WHERE book_id = ?;', [id]);

    await connection.execute('DELETE FROM Reviews WHERE book_id = ?;', [id]);
    // ! user_id in SQL so that only the owner of the media item can delete it

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

// Attach a tag to a media item
const postTagToMedia = async (
  tag_name: string,
  book_id: number,
): Promise<MediaItem | null> => {
  try {
    let tag_id: number = 0;
    // check if tag exists (case insensitive)
    const [tagResult] = await promisePool.execute<RowDataPacket[]>(
      'SELECT * FROM Tags WHERE tag_name = ?',
      [tag_name],
    );
    if (tagResult.length === 0) {
      // if tag does not exist create it
      const [insertResult] = await promisePool.execute<ResultSetHeader>(
        'INSERT INTO Tags (tag_name) VALUES (?)',
        [tag_name],
      );
      // get tag_id from created tag
      if (insertResult.affectedRows === 0) {
        return null;
      }
      tag_id = insertResult.insertId;
    } else {
      // if tag exists get tag_id from the first result
      tag_id = tagResult[0].tag_id;
    }
    const [GenreTagsResult] = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO GenreTags (tag_id, book_id) VALUES (?, ?)',
      [tag_id, book_id],
    );
    if (GenreTagsResult.affectedRows === 0) {
      return null;
    }

    return await fetchMediaById(book_id);
  } catch (e) {
    console.error('postTagToMedia error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

export {
  fetchAllMedia,
  fetchAllMediaByAppId,
  fetchMediaByTag,
  fetchMediaById,
  postMedia,
  deleteMedia,
  fetchMostLikedMedia,
  fetchMostCommentedMedia,
  fetchHighestRatedMedia,
  putMedia,
  postTagToMedia,
  ownBookList,
  fetchMediaAndStatusById,
};
