import {useState} from 'react';
import {useForm} from '../hooks/formHooks';
import { useBook, useFile } from '../hooks/apiHooks';
import { useNavigate } from 'react-router-dom';

// Upload.tsx
const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const {postFile} = useFile();
  const {postBook} = useBook();
  const navigate = useNavigate();

  const initValues = {
    title: '',
    description: '',
  };

  const doUpload = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !file) {
          return;
      }
      const fileResult = await postFile(file, token);
      const bookResult = await postBook(fileResult, inputs, token);
      console.log(bookResult.message);
      navigate('/');

  } catch (e) {
      console.log((e as Error).message);
  }
  };
  // Upload.tsx
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
      setFile(e.target.files[0]);
  }
};

  const {handleSubmit, handleInputChange, inputs} = useForm(
    doUpload,
    initValues,
  );

  return (
    <>
      <h1>Upload</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            name="title"
            type="text"
            id="title"
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="series">Series name</label>
          <input
            name="series"
            type="text"
            id="series"
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="genre">Genre Name</label>
          <input
            name="genre"
            type="text"
            id="genre"
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            rows={5}
            id="description"
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div>
          <label htmlFor="file">File</label>
          <input
            name="file"
            type="file"
            id="file"
            accept="image/*, video/*"
            onChange={handleFileChange}
          />
        </div>
        <img
          src={
            file
              ? URL.createObjectURL(file)
              : 'https://via.placeholder.com/200?text=Choose+image'
          }
          alt="preview"
          width="200"
        />
        <button
          type="submit"
          disabled={file && inputs.title.length > 3 ? false : true}
        >
          Upload
        </button>
      </form>
    </>
  );
};
export default Upload;
