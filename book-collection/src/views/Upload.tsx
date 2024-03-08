import {useState} from 'react';
import {useForm} from '../hooks/formHooks';
import {useBook, useFile} from '../hooks/graphQLHooks';
import {useNavigate} from 'react-router-dom';

// Upload.tsx
const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const {postFile} = useFile();
  const {postBook} = useBook();
  const navigate = useNavigate();

  const initValues = {
    title: '',
    description: '',
    genre: '',
    series: '',
  };

  const doUpload = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !file) {
        return;
      }
      const fileResult = await postFile(file, token);
      console.log('fileResult', fileResult);
      const bookResult = await postBook(fileResult, inputs, token);
      console.log('bookResult', bookResult);
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
      <h3 className="text-3xl flex items-center justify-center p-3">Upload</h3>
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
        <div className="flex flex-col w-2/5 space-y-2 sm:w-4/5">
    <label htmlFor="title">Title</label>
    <input
      className="rounded-md border-slate-500 p-3 text-slate-950"
      name="title"
      type="text"
      id="title"
      onChange={handleInputChange}
    />
    <label htmlFor="genre">Genre</label>
    <input
      className="rounded-md border-slate-500 p-3 text-slate-950"
      name="genre"
      type="text"
      id="genre"
      onChange={handleInputChange}
    />
    <label htmlFor="series">Series</label>
    <input
      className="rounded-md border-slate-500 p-3 text-slate-950"
      name="series"
      type="text"
      id="series"
      onChange={handleInputChange}
    />
    <label htmlFor="description">Description</label>
    <textarea
      className="rounded-md border-slate-500 p-3 text-slate-950"
      name="description"
      rows={5}
      id="description"
      onChange={handleInputChange}
    ></textarea>
    <label htmlFor="file">File</label>
    <input
      className="rounded-md border-slate-500 p-3 text-slate-950"
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
    className="h-auto w-72 object-cover rounded"
  />
<button
  className="w-1/3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-sm shadow-lg"
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
