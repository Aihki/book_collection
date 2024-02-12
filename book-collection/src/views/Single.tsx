import { MediaItemWithOwner} from '@sharedTypes/DBTypes';
import { useLocation } from 'react-router-dom';
import {NavigateFunction, useNavigate} from "react-router-dom";


const Single =() => {
  const {state} = useLocation();
  const item: MediaItemWithOwner = state;
  const navigate: NavigateFunction = useNavigate();
  return (
    <>
{/*     {item.media_type.includes('video') ? (
  <video controls src={item.filename}></video>
) : (
  <img src={item.filename} alt={item.title} />
)} */}
    <div className='single-book'>
      <div className='single-book-img-mob' style={{backgroundImage: `url(${item.filename})`}}></div>
      <div className='single-book-container'>
        <div className='single-book-img'><img className='book-cover' src={item.filename} alt={item.title} /></div>
        <div className='single-book-info'>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <p>user:{item.owner.username}</p>
          </div>
      </div>
    </div>


      <button className="close" onClick={() => {
      navigate(-1);
    }}>return</button>

    </>
  );
};
export default Single;

{/* <p>{item.title}</p>


<div className="single-book-container">
  <div className="single-book-img" style={{ backgroundImage: `url(${item.filename})`}}></div>
  <div className="single-book-info">
    <p>{item.description}</p>
  </div> */}
