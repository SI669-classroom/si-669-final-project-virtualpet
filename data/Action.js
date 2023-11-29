
import { CREATE_PET, LOAD_PET } from "./Reducer";
import { initializeApp } from 'firebase/app';
import { getFirestore, addDoc, collection, getDocs } from 'firebase/firestore';

import { firebaseConfig } from '../Secrets';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const createPet = (petStatus) => {
    return async (dispatch) => {
        const docRef = await addDoc(collection(db, 'pet'), petStatus);
        const id = docRef.id;
        dispatch({
            type: CREATE_PET,
            payload: {
                petStatus: { ...petStatus, key: id }
            }
        });
    }
}

const loadPet = () => {
    return async (dispatch) => {
        let querySnapshot = await getDocs(collection(db, 'pet'));
        const data = querySnapshot.docs[0]
        let petStatus = { ...data, key: data.id }
        dispatch({
            type: LOAD_PET,
            payload: {
                petStatus: petStatus
            }
        });
    }
}

export { createPet, loadPet }