import { Button } from '@rneui/themed';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { getAuthUser, signOut } from '../AuthManager';
import { useEffect, useState } from 'react';
import { loadPet } from '../data/Action';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, LinearProgress, Overlay } from 'react-native-elements'
import { Item } from '../components/Item';
import { ActionButton } from '../components/ActionButton';
import { updatePet } from '../data/Action';


const images = {
  dog: require('../assets/dog-default.png'),
  cat: require('../assets/cat.png'),
  parrot: require('../assets/parrot.png'),
  hamster: require('../assets/hamster.png')
};

const items =
{
  item1: 'satiety',
  item2: 'satiety',
  item3: 'sanitary',
  item4: 'mood'
}

function HomeScreen({ navigation }) {
  const dispatch = useDispatch()
  const userId = getAuthUser()?.uid
  const [showItems, setShowItems] = useState(false)

  const pet = useSelector((state) => state.petStatus);

  useEffect(() => {
    dispatch(loadPet(userId))
  }, [])

  const [tempImage, setTempImage] = useState(null);


  const handleItemPress = (name) => {

    const newImage = require('../assets/dog-happy.png');
    setTempImage(newImage);


    dispatch(updatePet(pet, items[name], pet[items[name]] + 10));
    dispatch(updatePet(pet, 'items', { ...pet.items, [name]: pet.items[name] - 1 }));
    setShowItems(false)

    setTimeout(() => {
      setTempImage(null);
    }, 3000);
  };

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.container}
    >
      <View style={{ backgroundColor: "white", paddingVertical: 10, paddingHorizontal: 30, borderRadius: '50%', marginBottom: 20 }}>
        <Text style={styles.petName}>{pet.name}</Text>
      </View>
      <View style={{ width: '100%', height: 320, alignItems: 'center', position: "relative", marginBottom: 20 }}>
        <Image source={tempImage || images[pet.type]} style={{ ...styles.shadowBox, flex: 1, resizeMode: 'contain' }} />
        <Button
          containerStyle={{ position: "absolute", right: 9, bottom: 135 }}
          buttonStyle={{ backgroundColor: 'transparent', padding: 0 }}
          onPress={() => setShowItems(!showItems)}
        >
          <Image source={require('../assets/backpack.png')} style={{ ...styles.shadowBox, width: 60, height: 60 }} />
        </Button>
      </View>

      <View style={styles.progressWrapper}>
        {['satiety', 'sanitary', 'mood'].map((type, i) =>
          < View style={styles.row} key={i}>
            <Text style={styles.progressLabel}>{type}</Text>
            <LinearProgress color="#127A33" style={styles.linearProgress} value={pet[type] / 100} variant="determinate" />
          </View>
        )}
      </View>

      <View style={styles.row}>
        {['Feed', 'Groom'].map((action, i) => <ActionButton key={i} type={action} onPress={() => setShowItems(true)} />)}
      </View>

      <View style={styles.row}>
        <ActionButton type="Play" onPress={() => setShowItems(true)} />
        <ActionButton type="Walk" onPress={() =>
          navigation.navigate('Walk')
        } />
      </View>

      {/* <Button onPress={() => signOut()}>Sign out</Button> */}
      {
        showItems &&
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => setShowItems(false)}
        >
          <Text style={{ fontSize: 20 }}>My Items</Text>
          <View style={styles.row}>
            {Object.keys(items).slice(0, 4).map((name, i) =>
              <Item
                key={i}
                number={pet.items[name]}
                type={name}
                onPress={() => handleItemPress(name)}
              />)}
          </View>
        </TouchableOpacity>
      }
    </ImageBackground >
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    resizeMode: "contain"
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
    fontWeight: 'bold',
    textTransform: "capitalize"
  },
  progressWrapper: {
    gap: 10,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20
  },
  itemContainer: {
    backgroundColor: 'beige',
    width: "100%", height: "40%",
    position: "absolute", bottom: 0,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30, gap: 20
  },
  petName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  shadowBox: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  }
});
export default HomeScreen;