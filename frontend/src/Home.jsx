import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const createDocument = async () => {
        try {
          const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/docs`, {
            content: '',
        });
        

            navigate(`/docs/${response.data._id}`);
        } catch (error) {
            console.error('Error creating document:', error);
        }
    };

    return (
        <div>
            <h1>Welcome to the Collaborative Text Editor</h1>
            <button onClick={createDocument}>Create New Document</button>
        </div>
    );
}

export default Home;
