
import { CREATE_PET, LOAD_PET } from "./Reducer";
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, addDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';

import { firebaseConfig } from '../Secrets';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const createPet = (petStatus) => {
    return async (dispatch) => {
        const userId = auth.currentUser?.uid;
        const petWithUserId = { ...petStatus, userId };
        const docRef = await addDoc(collection(db, 'pet'), petWithUserId);
        const id = docRef.id;
        dispatch({
            type: CREATE_PET,
            payload: {
                petStatus: { ...petWithUserId, key: id }
            }
        });
    }
}

const loadPet = () => {
    return async (dispatch) => {
        const userId = auth.currentUser?.uid;
        const querySnapshot = await getDocs(collection(db, 'pet'));
        const petData = querySnapshot.docs
            .map(doc => ({ ...doc.data(), key: doc.id }))
            .find(pet => pet.userId === userId); 

        if (petData) {
            dispatch({
                type: LOAD_PET,
                payload: {
                    petStatus: petData
                }
            });
        }
    }
}

export { createPet, loadPet }
