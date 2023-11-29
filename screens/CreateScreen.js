import { View, Text, Image, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { Icon } from "@rneui/base";
import { Input, Button } from "@rneui/themed";
import { createPet } from "../data/Action";
import { useDispatch } from 'react-redux';
import { getAuthUser } from "../AuthManager";

const images = {
    dog: require('../assets/dog.png'),
    cat: require('../assets/cat.png'),
    parrot: require('../assets/parrot.png'),
    hamster: require('../assets/hamster.png'),
};

function CreateScreen({navigation}) {
    const types = ['dog', 'cat', 'parrot', 'hamster']
    const [typeIndex, setTypeIndex] = useState(0)
    const [name, setName] = useState('')
    const dispatch = useDispatch()
    const userId = getAuthUser()?.uid

    const handleClick = () => {
        const newPet = {
            name: name,
            userId: userId,
            type: types[typeIndex],
            sanitary: 100,
            satiety: 100,
            mood: 100,
            wasteNum: 0,
            items: []
        }
        dispatch(createPet(newPet))
        navigation.navigate('Home')
    }

    return (
        <View style={{
            flex: 1, alignItems: 'center', justifyContent: "space-evenly", height: '100%', paddingBottom: "10%",
            backgroundColor: "#D6EEBB"
        }} behavior='padding'>
            <View style={{ ...styles.col }}>
                <Text style={{ fontSize: 28, fontWeight: 900, height: "10%" }}>{name}</Text>
                <View style={styles.row}>
                    <Button
                        type="clear"
                        disabled={typeIndex === 0}
                        onPress={() => { setTypeIndex(prev => prev - 1) }}
                    >
                        <Icon
                            name="chevron-left"
                            type="font-awesome"
                            color={typeIndex === 0 ? "#AFDC89" : "#127A33"}
                        />
                    </Button>
                    <View style={{ width: '50%', height: 320, alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={images[types[typeIndex]]} />
                    </View>
                    <Button
                        type="clear"
                        disabled={typeIndex === 3}
                        onPress={() => { setTypeIndex(prev => prev + 1) }}
                    >
                        <Icon
                            name="chevron-right"
                            type="font-awesome"
                            color={typeIndex === 3 ? "#AFDC89" : "#127A33"} />
                    </Button>
                </View>
            </View>
            <View style={{ width: '80%', ...styles.col }}>
                <Input
                    label="Name your pet: "
                    labelStyle={{ fontWeight: 600, color: "black" }}
                    inputContainerStyle={styles.inputContainer}
                    containerStyle={styles.container}
                    value={name}
                    onChangeText={(newText) => setName(newText)}
                />
                <Button
                    buttonStyle={{ backgroundColor: '#127A33' }}
                    onPress={handleClick}
                >
                    Adopted!
                </Button>
            </View>
        </View >
    );
}

export default CreateScreen;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20
    },
    col: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20
    },

    inputContainer: {
        borderColor: "transparent",
        padding: 5,
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: "white"
    }
})