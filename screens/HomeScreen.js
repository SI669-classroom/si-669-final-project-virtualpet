import { Button } from '@rneui/themed';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { getAuthUser, signOut } from '../AuthManager';
import { useEffect, useState } from 'react';
import { loadPet } from '../data/Action';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, LinearProgress, Overlay } from 'react-native-elements'
import { Item } from '../components/Item';
import { ActionButton } from '../components/ActionButton';
import { updatePet } from '../data/Action';
import Poop from '../components/Poop';


const images = {
  dog: require('../assets/dog-default.png'),
  cat: require('../assets/cat.png'),
  parrot: require('../assets/parrot.png'),
  hamster: require('../assets/hamster.png'),
  poop: require('../assets/poop.png')
};

const items =
{
  item1: 'satiety',
  item2: 'satiety',
  item3: 'sanitary',
  item4: 'mood',
  item5: 'poop',
}

const actionToStatus = {
  Feed: 'satiety',
  Groom: 'sanitary',
  Play: 'mood'
}

function HomeScreen({ navigation }) {
  const [action, setAction] = useState()
  const dispatch = useDispatch()
  const userId = getAuthUser()?.uid
  const [showItems, setShowItems] = useState(false)
  const [poopPosition, setPoopPosition] = useState({ top: 0, left: 0 });
  const [poopPositions, setPoopPositions] = useState([]);
  const [showPoopPopup, setShowPoopPopup] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);


  const pet = useSelector((state) => state.petStatus);
  const [tempImage, setTempImage] = useState(null);
  const [collectedPoop, setCollectedPoop] = useState(0);

  useEffect(() => {
    dispatch(loadPet(userId));

    const poopTimer = setInterval(() => {
      const screenWidth = Dimensions.get('window').width;
      const screenHeight = Dimensions.get('window').height;
      const randomLeft = Math.random() * (screenWidth-50); 
      const randomTop = Math.random() * (screenHeight * 0.6 -50); 
      const newPoopPosition = { left: randomLeft, top: randomTop };
      
      setPoopPositions(oldPositions => [...oldPositions, newPoopPosition]);
      const newImage = require('../assets/dog-upset.png');
      setTempImage(newImage);
      setTimeout(() => {
        setTempImage(null);
      }, 3000);
    }, 40000);

    return () => clearInterval(poopTimer);
  }, [])

  const handleItemPress = (name) => {
    console.log('Item ' + name + ' count: ', pet.items[name]);
    if (pet.items[name] === 0) {
      setSelectedItem(name);
      setShowTradeModal(true);
    } else {
      const newImage = require('../assets/dog-happy.png');
      setTempImage(newImage);
      dispatch(updatePet(pet, items[name], pet[items[name]] + 10));
      dispatch(updatePet(pet, 'items', { ...pet.items, [name]: pet.items[name] - 1 }));
      setShowItems(false)
      setTimeout(() => {
        setTempImage(null);
      }, 3000);
    }
  };

  const handleYesPress = (name) => {
    // Get index of item
    const items = {...pet.items};
    items[name] += 1;
    items['item5'] -= 1;
    
    // Update pet items
    dispatch(updatePet(pet, 'items', items));
  
    setShowTradeModal(false)
    setSelectedItem(null);
  };

  const handleItem5Press = () => {
    setCollectedPoop((prevCount) => prevCount + 1);
    setShowPoopPopup(true);
  };

  const handlePoopPopupConfirm = () => {
    dispatch(updatePet(pet, 'items', { ...pet.items, ['item5']: pet.items['item5'] + 1 }));
    setPoopPositions((oldPositions) => oldPositions.slice(1));
    setShowPoopPopup(false);
  };

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.container}
    >
      <View style={{ backgroundColor: "white", paddingVertical: 10, paddingHorizontal: 30, borderRadius: '50%', marginBottom: 20 }}>
        <Text style={styles.petName}>{pet.name}</Text>
      </View>
      <View style={{ width: '100%', height: 320, alignItems: 'center', position: "relative", marginBottom: 20, ...styles.shadowBox }}>
        <Image source={tempImage || images[pet.type]} style={{ flex: 1, resizeMode: 'contain' }} />
        <Button
          containerStyle={{ position: "absolute", right: 9, bottom: 135 }}
          buttonStyle={{ backgroundColor: 'transparent', padding: 0 }}
          onPress={() => setShowItems(!showItems)}
        >
          <Image source={require('../assets/backpack.png')} style={{ width: 60, height: 60 }} />
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
        {['Feed', 'Groom'].map((action, i) => <ActionButton key={i} type={action} onPress={() => { setShowItems(true); setAction(action) }} />)}
      </View>

      <View style={styles.row}>
        <ActionButton type="Play" onPress={() => { setShowItems(true); setAction('Play') }} />
        <ActionButton type="Walk" onPress={() =>
          navigation.navigate('Walk')
        } />
      </View>

      {
        showItems &&
        <View
          style={styles.itemContainer}
        >
          <Text style={{ fontSize: 20 }}>My Items</Text>
          <Icon
            name='close'
            type='material'
            color='#000'
            containerStyle={{ position: 'absolute', right: 30, top: 30 }}
            onPress={() => setShowItems(false)} />
          <View style={styles.row}>
            {Object.keys(items).slice(0, 5).map((name, i) =>
              <Item
                key={i}
                number={pet.items[name]}
                type={name}
                highlight={actionToStatus[action] === items[name]}
                onPress={() => handleItemPress(name)}
              />)}
          </View>
        </View>
      }
      {poopPositions.map((position, index) => (
        <Poop key={index} onPress={handleItem5Press} position={position} />
      ))}
      {showPoopPopup && (
        <Overlay isVisible={showPoopPopup} onBackdropPress={() => setShowPoopPopup(false)}>
          <View style={{ padding: 20 }}>
            <Text>POOP x 1 added to your bag</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: '10%',}}>
              <ActionButton type="OK" onPress={handlePoopPopupConfirm} />
            </View>
          </View>
        </Overlay>
      )}
      {showTradeModal && (
        <Overlay isVisible={true} onBackdropPress={() => setShowTradeModal(false)}>
          <View style={{ padding: 20 }}>
            <Text>{"Do you want to trade POOP X1 for " + selectedItem + "?"}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: '10%'}}>
              <ActionButton type="Yes" onPress={() => handleYesPress(selectedItem)} />
              <ActionButton type="No" onPress={() => setShowTradeModal(false)} />
            </View>
          </View>
        </Overlay>
      )}
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
    width: 65,
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
    borderRadius: '40 0',
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