import axios from 'axios';

export async function getTemperaments() {
    try {
        const temperaments = await axios.get('http://localhost:3001/temperament') 
        if (temperaments.status === 200) return temperaments.data
    } catch (e) {
        return []
    }
}