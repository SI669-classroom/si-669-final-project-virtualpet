import { Button } from '@rneui/themed';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getAuthUser, signOut } from '../AuthManager';
import { useEffect, useState, useRef } from 'react';
import { loadPet } from '../data/Action';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, LinearProgress, Overlay } from 'react-native-elements'

const images = {
    dog: require('../assets/dog-walk.png'),
    cat: require('../assets/cat.png'),
    parrot: require('../assets/parrot.png'),
    hamster: require('../assets/hamster.png')
};

function WalkScreen({ navigation }) {

    const [showItems, setShowItems] = useState(false)
    const [isWalking, setIsWalking] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [seconds, setSeconds] = useState(0);
    const [hasWalkEnded, setHasWalkEnded] = useState(false);
    const [walkEndMessage, setWalkEndMessage] = useState(null);

    const intervalRef = useRef(null);

    const pet = useSelector((state) => state.petStatus);

    useEffect(() => {
        if (isWalking && !isPaused) {
            intervalRef.current = setInterval(() => {
                setSeconds((s) => s + 1);
            }, 1000);
        }
        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isWalking, isPaused]);

    const startWalk = () => {
        setIsWalking(true);
        setSeconds(0);
        setWalkEndMessage(null);
    };

    const pauseWalk = () => {
        setIsPaused(true);
    };

    const restartWalk = () => {
        setIsPaused(false);
    };

    const stopWalk = () => {
        setIsWalking(false);
        setIsPaused(false);
        setHasWalkEnded(true);
        const walkMinutes = Math.floor(seconds / 60);
        const walkSeconds = seconds - (walkMinutes * 60);
        setWalkEndMessage(`You just walked with ${pet.name} \n  for ${walkMinutes} min and ${walkSeconds} sec.`);
    };

    const formatTime = (totalSeconds) => {
        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds - hours * 3600) / 60);
        let seconds = totalSeconds - (hours * 3600 + minutes * 60);

        //Adding a leading zero if minutes or seconds less than zero
        minutes = String(minutes).padStart(2, "0");
        hours = String(hours).padStart(2, "0");
        seconds = String(seconds).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    }

    const renderStatement = () => {
        if (isWalking) {
            return <Text style={styles.statementText}> {formatTime(seconds)}</Text>
        }
        else if (hasWalkEnded) {
            return <Text style={{ fontSize: 20, textAlign: 'center' }}>{walkEndMessage}</Text>
        } else {
            return <Text style={styles.statementText}>I'm ready, let's walk!</Text>
        }
    }

    const renderButton = () => {
        if (isWalking && !isPaused) {
            return (
                <View style={styles.buttonContainer}>
                    <Button buttonStyle={{ margin: 20 }} onPress={pauseWalk}>Pause</Button>
                    <Button buttonStyle={{ margin: 20 }} onPress={stopWalk}>Stop</Button>
                </View>
            )
        } else if (isWalking && isPaused) {
            return (
                <View style={styles.buttonContainer}>
                    <Button buttonStyle={{ margin: 20 }} onPress={restartWalk}>Restart</Button>
                    <Button buttonStyle={{ margin: 20 }} onPress={stopWalk}>Stop</Button>
                </View>
            )
        } else {
            return (
                <View style={styles.buttonContainer}>
                    <Button buttonStyle={{ margin: 20, marginTop: 40, }} onPress={startWalk}>Start Walk</Button>
                    <Button buttonStyle={{ margin: 20, marginTop: 40, }} onPress={() => navigation.navigate('Home')}>Back</Button>
                </View>
            )
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.petName}>{pet.name}</Text>
            <View style={{ width: '100%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={images[pet.type]} style={{ flex: 1, resizeMode: 'contain', marginBottom: 50 }} />
            </View>
            {renderStatement()}
            {renderButton()}
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D6EEBB',
        gap: 10
    },
    row: {
        flexDirection: 'row',
        gap: 10
    },
    linearProgress: {
        height: 20,
        width: "60%",
        borderRadius: 20
    },
    progressLabel: {
        width: 60,
        color: '#127A33',
        fontWeight: 'bold'
    },
    itemContainer: {
        backgroundColor: 'beige',
        width: "100%", height: "40%",
        position: "absolute",
        bottom: 0,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 30,
        gap: 20
    },
    petName: {
        fontSize: 28,
        fontWeight: 900,
        marginBottom: 80
    },
    buttonContainer: {
        flexDirection: 'row', // Add this line to make buttons display in a row
        justifyContent: 'space-between', // Center buttons horizontally
        marginTop: 25,
    },
    statementText: {
        fontSize: 35,
    },
});

export default WalkScreen;