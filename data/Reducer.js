
const CREATE_PET = 'CREATE_PET';
const LOAD_PET = 'LOAD_PET'
const UPDATE_PET = 'UPDATE_PET'


const initialState = {
    petStatus: {
        name: "",
        type: "",
        sanitary: 100,
        satiety: 50,
        mood: 100,
        wasteNum: 0,
        userId: 0,
        items: { item1: 10 }
    }
}

const createPet = (state, petStatus) => {
    return {
        ...state,
        petStatus
    };
}

const loadPet = (state, petStatus) => {
    return {
        ...state,
        petStatus
    };
}

const updatePet = (state, key, value) => {
    let { petStatus } = state;
    return {
        ...state,
        petStatus: {
            ...petStatus,
            [key]: value
        }
    };
}


function rootReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case CREATE_PET:
            return createPet(state, payload.petStatus);
        case LOAD_PET:
            return loadPet(state, payload.petStatus);
        case UPDATE_PET:
            return updatePet(state, payload.key, payload.value)
        default:
            return state;
    }
}

export {
    rootReducer,
    CREATE_PET,
    LOAD_PET,
    UPDATE_PET
};