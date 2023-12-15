import { TouchableOpacity, Image, Text, StyleSheet } from "react-native"

const images = {
    item1: require('../assets/item1.png'),
    item2: require('../assets/item2.png'),
    item3: require('../assets/item3.png'),
    item4: require('../assets/item4.png')
};

export const Item = ({ type, number, onPress, highlight }) => {
    return (
        <TouchableOpacity
            style={[highlight && styles.highlight, styles.container]}
            onPress={onPress}
            disabled={!number}>
            <Image source={images[type]} style={!number && styles.disabled} />
            <Text style={styles.text}>{number ?? 0}</Text>
        </TouchableOpacity >
    )
}

const styles = StyleSheet.create({
    container: { backgroundColor: 'white', justifyContent: "center", alignItems: "center", padding: 10, position: "relative", borderRadius: 5 },
    text: { alignSelf: 'flex-end', fontSize: 12, position: 'absolute', bottom: 2, right: 5, fontWeight: 600 },
    disabled: { opacity: 0.5 },
    highlight: {
        borderColor: '#E6D0B1',
        borderWidth: 4
    }
});