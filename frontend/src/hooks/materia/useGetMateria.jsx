import { useState,useEffect } from 'react';
import { getMaterias } from '@services/materia.service';

const useGetMateria = () => {
    const [materias, setMaterias] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false);
    
    useEffect(() => {
        const fetchMaterias = async () => {
            try {
                const response = await getMaterias();
                setMaterias(response.data);
                setLoading(false);
                } catch (error) {
                    setError(error.message);
                    setLoading(false);
             }
        };
                    setRefresh(false);
                    fetchMaterias();
                    }
        , [refresh]);

    return {
        fetchGetMaterias: () => setRefresh(true),
        materias,
        loading,
        error
    };
}
    

export default useGetMateria;