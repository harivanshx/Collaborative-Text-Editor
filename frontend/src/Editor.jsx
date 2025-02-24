import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';



const socket = io(import.meta.env.VITE_BACKEND_URL);



function Editor() {
  const { id } = useParams();
  const [content, setContent] = useState('');

  useEffect(() => {
    socket.emit('joinDocument', id);

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/docs/${id}`)
    .then((res) => setContent(res.data.content));
  


    socket.on('receiveChanges', (newContent) => setContent(newContent));
    return () => {
      socket.off('receiveChanges');
      socket.emit('leaveDocument', id);
    };
  }, [id]);

  const handleChange = (e) => {
    setContent(e.target.value);
    socket.emit('sendChanges', { docId: id, content: e.target.value });
  };

  return(
  <>
<h1 style={{ 
  color: 'blue', 
  fontSize: '2rem', 
  textAlign: 'center', 
  margin: '20px 0' 
}}>
  Text Editor
</h1>

<textarea 
  value={content} 
  onChange={handleChange} 
  rows={10} 
  cols={50} 
  style={{ 
    color: 'black', 
    fontSize: '1rem', 
    textAlign: 'left', 
    height: '80vh', 
    width: '90%', 
    maxWidth: '1200px', 
    minHeight: '300px', 
    margin: '0 auto', 
    display: 'block', 
    padding: '10px', 
    boxSizing: 'border-box',
    border: '2px solid #ccc', 
    borderRadius: '8px', 
    outline: 'none', 
    resize: 'none' 
  }} 
/>

</>
  );
}

export default Editor;
