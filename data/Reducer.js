
const CREATE_PET = 'CREATE_PET';
const LOAD_PET = 'LOAD_PET'


const initialState = {
    petStatus: {
        name: "",
        type: "",
        sanitary: 100,
        satiety: 100,
        mood: 100,
        wasteNum: 0,
        userId: 0,
        items: []
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

function rootReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case CREATE_PET:
            return createPet(state, payload.petStatus);
        case LOAD_PET:
            return loadPet(state, payload.petStatus);
        default:
            return state;
    }
}

export {
    rootReducer,
    CREATE_PET,
    LOAD_PET
};