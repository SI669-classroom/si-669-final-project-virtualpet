import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const ActionButton = ({ type, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{type}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#127A33',
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
        width: "40%",
        borderRadius: 10
    },
    buttonText: {
        color: "white",
        fontWeight: 900,
        fontSize: 26
    }
});