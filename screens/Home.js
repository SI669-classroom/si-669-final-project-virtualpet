import { View, Text, Button } from "react-native";

function HomeScreen({navigation}) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
            <Button
                title="Create"
                onPress={() => navigation.navigate('Create')}
            />
        </View>
    );
}

export default HomeScreen;