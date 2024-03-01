import { MediaItemWithOwner } from "@sharedTypes/DBTypes";
import { useBookStatus } from "../hooks/graphQLHooks";
import { useEffect, useState } from "react";
import { useStatusChangeStore, useStatusStore } from "../store";
import { useUserContext } from "../hooks/contexHooks";


const Status = ({item}: {item: MediaItemWithOwner}) => {
 const {status, setStatus} = useStatusStore();
 const {allStatuses, setAllStatuses} = useStatusChangeStore();
 const {user} = useUserContext();
 const {getBookStatus, getAllStatus, changeStatus } = useBookStatus();
  const [isOpen, setIsOpen] = useState(false);




  const allSatus = async () => {
    try {
      const statuses = await getAllStatus();
      console.log('statuses',statuses)
      setAllStatuses(statuses);
    } catch (error) {
      setAllStatuses([]);
      console.error('getAllStatus failed', error);
    }
  };


  const getStatus = async () => {
    try {
      const status = await getBookStatus(item.book_id);
      console.log('status',status)
      setStatus(status);
    } catch (error) {
      setStatus('');
      console.error('getStatus  failed', error);
    }
  }

 const doStatusChange = async (status_id:string) => {
    const token = localStorage.getItem('token');
    if (!user || !token) {
    return;
  }
    try {
      console.log('status_id',status_id)
      const newStatus = await changeStatus(item.book_id, status_id, token);
      console.log('newStatus',newStatus)
      getStatus();
    } catch (error) {
      console.error('doStatusChange failed', error);
    }
 };


useEffect(() => {
  getStatus();
  allSatus();
}, []);

return (
  <>
  <button className="flex items-center" onClick={() => setIsOpen(!isOpen)}>{status}
  {!isOpen ? '▼' : '▲'}
  </button>
  {isOpen && allStatuses.map((status) => (
    <div key={status.status_id}>
      <div onClick={() => {
        doStatusChange(status.status_id);
        setIsOpen(false);
      }}>
        <div className="rounded-md border border-slate-200 bg-slate-800 p-3 text-slate-100 text-center cursor-pointer w-36 h-12">
          <span className="ml-2">{status.status_name}</span>
        </div>
      </div>
    </div>
  ))}
</>
);
};

export default Status;



