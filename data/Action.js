
import { CREATE_PET, LOAD_PET, UPDATE_PET } from "./Reducer";
import { initializeApp } from 'firebase/app';
import { getFirestore, addDoc, collection, getDocs, where, query, updateDoc, doc } from 'firebase/firestore';

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

const loadPet = (userId) => {
    return async (dispatch) => {
        const q = query(collection(db, "pet"), where('userId', '==', userId));
        let querySnapshot = await getDocs(q);
        const data = querySnapshot.docs[0]
        let petStatus = { ...data.data(), key: data.id }
        dispatch({
            type: LOAD_PET,
            payload: {
                petStatus: petStatus
            }
        });
    }
}

const updatePet = (pet, key, value) => {
    return async (dispatch) => {
        await updateDoc(doc(db, 'pet', pet.key), { [key]: value });
        dispatch({
            type: UPDATE_PET,
            payload: {
                key: key,
                value: value
            }
        });
    }
};

const updatePetMultiple = (pet, updatedFields) => {
    return async (dispatch) => {
        await updateDoc(doc(db, 'pet', pet.key), updatedFields);
        Object.entries(updatedFields).forEach(([key, val]) => {
            dispatch({
                type: UPDATE_PET,
                payload: {
                    key: key,
                    value: val
                }
            });
        })
    }
}

export { createPet, loadPet, updatePet, updatePetMultiple }