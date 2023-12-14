import { Button } from '@rneui/themed';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Easing, ImageBackground } from 'react-native';
import { getAuthUser, signOut } from '../AuthManager';
import { useEffect, useState, useRef } from 'react';
import { loadPet } from '../data/Action';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, LinearProgress, Overlay } from 'react-native-elements'
import { ActionButton } from '../components/ActionButton';
import { 
    Accuracy,
    requestForegroundPermissionsAsync,
    watchPositionAsync 
  } from 'expo-location';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const images = {
    dog: require('../assets/dog-walk.png'),
    cat: require('../assets/cat.png'),
    parrot: require('../assets/parrot.png'),
    hamster: require('../assets/hamster.png'),
    ended: require('../assets/dog-happy.png'),
};

function WalkScreen({ navigation }) {

    const [showItems, setShowItems] = useState(false)
    const [isWalking, setIsWalking] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [seconds, setSeconds] = useState(0);
    const [hasWalkEnded, setHasWalkEnded] = useState(false);
    const [walkEndMessage, setWalkEndMessage] = useState(null);
    const [petImage, setPetImage] = useState(images.dog);
    const [location, setLocation] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);

    const translateX = useRef(new Animated.Value(0)).current;
    const dogAnimation = useRef(null);
    const intervalRef = useRef(null);
    const locationSubscription = useRef(null);
    const initRegion = {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };
    const [mapRegion, setMapRegion] = useState(initRegion);
    const pet = useSelector((state) => state.petStatus);

    useEffect(() => {
        const startLocationTracking = async () => {
          const { status } = await requestForegroundPermissionsAsync();
    
          if (status === 'granted') {
            const subscription = await watchPositionAsync(
              { accuracy: Accuracy.High },
              (newLocation) => {
                setLocation(newLocation);
                setRouteCoordinates((prevRoute) => [...prevRoute, newLocation.coords]);
                setMapRegion({
                  ...mapRegion,
                  latitude: newLocation.coords.latitude,
                  longitude: newLocation.coords.longitude,
                  latitudeDelta: 0.01,  // Adjust the value to zoom in/out
                  longitudeDelta: 0.01, // Adjust the value to zoom in/out
                });
              }
            );
    
            locationSubscription.current = subscription;
            setIsWalking(true);
          } else {
            console.log('Location permission denied');
          }
        };
    
        // Check if it's walking and not paused to start location tracking
        if (isWalking && !isPaused) {
          startLocationTracking();
    
          // Start the interval to update the timer
          intervalRef.current = setInterval(() => {
            setSeconds((s) => s + 1);
          }, 1000);
        } else {
          // Clear the interval when not walking or paused
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
          }
        }
    
        // Clean up when the component is unmounted or when walking is paused
        return () => {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
          }
    
          if (locationSubscription.current) {
            locationSubscription.current.remove();
          }
        };
      }, [isWalking, isPaused]);

    useEffect(() => {
    if (isWalking) {
        startDogAnimation();
    } else {
        stopDogAnimation();
    }
    }, [isWalking]);

    const startDogAnimation = () => {
        translateX.setValue(-300); // Start from the furthest left every time animation starts
        dogAnimation.current = Animated.timing(translateX, {
            toValue: 300, // Move to the right
            duration: 8000,
            easing: Easing.linear,
            useNativeDriver: false,
        });
        dogAnimation.current.start(() => {
          // Make sure the animation has not been stopped 
            startDogAnimation();
        });
    };
    
    const stopDogAnimation = () => {
        Animated.timing(translateX, {
            toValue: 0,
            duration: 0,
            easing: Easing.linear,
            useNativeDriver: false,
        }).stop();
    };

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
        setWalkEndMessage(`You just walked with ${pet.name} \n  for ${walkMinutes} min and ${walkSeconds} sec!`);
        if (dogAnimation.current) {
            dogAnimation.current.stop();
        }
        dogAnimation.current = null;
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
            return <Text style={[styles.statementText, {marginBottom: '5%'}]}>I'm ready, let's walk!</Text>
        }
    }

    const renderButton = () => {
        if (isWalking && !isPaused) {
            return (
                <View style={styles.row}>
                    <ActionButton type="Pause" onPress={pauseWalk} />
                    <ActionButton type="Finish" onPress={stopWalk} />
                </View>
            )
        } else if (isWalking && isPaused) {
            return (
                <View style={styles.row}>
                    <ActionButton type="Restart" onPress={restartWalk} />
                    <ActionButton type="Finish" onPress={stopWalk} />
                </View>
            )
        } else if (hasWalkEnded) {
            return (
                <View style={styles.row}>
                    <ActionButton type="Back" onPress={() =>
                    navigation.navigate('Home')
                } />
                </View>)
        } else {
            return (
                <View style={styles.row}>
                    <ActionButton type="Start Walk" onPress={startWalk} />
                    <ActionButton type="Back" onPress={() =>
                    navigation.navigate('Home')
                } />
                </View>)}
    }

    return (
        <ImageBackground
            source={require('../assets/background.png')}
            style={styles.container}
            >
            {isWalking && (
            <>
                <MapView
                style={[styles.map, styles.shadowBox, {marginBottom: '8%'}]}
                provider={PROVIDER_GOOGLE}
                region={mapRegion}
                showsUserLocation={true}
                >
                {/* Display the route */}
                <Polyline
                    coordinates={routeCoordinates}
                    strokeColor="#127A33" // Route line color
                    strokeWidth={10}
                />

                {/* Display the user's current location */}
                {location && (
                    <Marker
                    coordinate={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    }}
                    title="You are here"
                    description="Your current location"
                    >
                    <Image
                        source={require('../assets/dog-walk-icon.png')}
                        style={{ width: 50, height: 50 }}
                    />
                    </Marker>
                )}
                </MapView>
                <Text style={{fontSize: 20}}>You are walking with {pet.name}</Text>
                <Animated.View
                    style={{
                        width: '100%',
                        height: '15%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: [{ translateX: translateX }], // Highlighted: TranslateX for animation
                    }}
                    >
                    <Image source={images[pet.type]} style={[styles.shadowBox, { flex: 1, resizeMode: 'contain', marginBottom: 5, shadowRadius: 1 }]} />
                </Animated.View>
            </>)}

            {!isWalking && !isPaused && !hasWalkEnded && (
            <>
                <View style={{ backgroundColor: "white", borderRadius: '50%', marginBottom: 20, height: '8%', width: '40%'}}>
                    <Text style={styles.petName}>{pet.name}</Text>
                </View>
                <View style={{ width: '100%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={images[pet.type]} style={[styles.shadowBox, { flex: 1, resizeMode: 'contain', marginBottom: 50 }]} />
                </View>
            </>)}

            {hasWalkEnded && (
            <>
                <MapView
                    style={[styles.map, {marginBottom: '3%'}]}
                    provider={PROVIDER_GOOGLE}
                    region={mapRegion}
                    showsUserLocation={true}
                >
                    {/* Display the route with Polyline */}
                    <Polyline
                    coordinates={routeCoordinates}
                    strokeColor="#127A33" // Route line color
                    strokeWidth={10}
                    />

                    {/* Display the user's current location */}
                    {location && (
                    <Marker
                        coordinate={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        }}
                        title="You are here"
                        description="Your current location"
                    >
                        <Image
                        source={require('../assets/dog-walk-icon.png')}
                        style={{ width: 50, height: 50 }}
                        />
                    </Marker>
                    )}
                </MapView>
                <Image
                    source={require('../assets/dog-happy.png')}
                    style={[styles.shadowBox, { width: '30%', height: '20%', shadowRadius: 1}]}
                />
            </>)}
            {renderStatement()}
            {renderButton()}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D6E9E1',
        gap: 10
    },
    row: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
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
        alignItems: 'center',
        marginLeft: '30%',
        marginTop: '8%',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        marginTop: 25,
    },
    statementText: {
        fontSize: 28,
    },
    map: {
        width: '90%',
        aspectRatio: 0.9,
        borderRadius: 10,
        borderColor: "#409378",
        borderWidth: 5, 
    },
    shadowBox: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
    },
});

export default WalkScreen;