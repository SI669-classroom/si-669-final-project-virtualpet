import { View, Text, Image, StyleSheet } from "react-native";
import { useState } from "react";
import { Icon } from "@rneui/base";
import { Input, Button } from "@rneui/themed";

const images = {
    dog: require('../assets/dog.png'),
    cat: require('../assets/cat.png'),
    parrot: require('../assets/parrot.png'),
    hamster: require('../assets/hamster.png'),
};

function CreateScreen() {
    const types = ['dog', 'cat', 'parrot', 'hamster']
    const [typeIndex, setTypeIndex] = useState(0)
    const [name, setName] = useState('')

    const handleClick = () => {
        console.log("clicked");
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: "space-evenly", height: '100%', paddingBottom: "10%" }} behavior='padding'>
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
                            color={typeIndex === 0 ? "lightgray" : "black"}
                        />
                    </Button>
                    <View style={{ width: '50%', height: 250, alignItems: 'center', justifyContent: 'center' }}>
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
                            color={typeIndex === 3 ? "lightgray" : "black"} />
                    </Button>
                </View>
                <Text style={{ textTransform: 'uppercase' }}>{types[typeIndex]}</Text>
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
                    buttonStyle={{ backgroundColor: 'black' }}
                    onPress={{ handleClick }}
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
        backgroundColor: "lightgray"
    }
})