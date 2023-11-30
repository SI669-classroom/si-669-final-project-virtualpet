import { useState, useEffect } from 'react';
import { Button, Image } from '@rneui/themed';
import { signIn, signUp, subscribeToAuthChanges } from '../AuthManager';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';


function SigninBox({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    return (
      <View style={styles.loginContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
          />
        </View>
            <Text style={styles.loginHeaderText}>Log In</Text>
            <View style={styles.loginLabelContainer}>
              <Text style={styles.loginLabelText}>Email: </Text>
            </View>
            <View style={styles.loginInputContainer}>
              <TextInput 
                style={styles.loginInputBox}
                placeholder='enter email address' 
                autoCapitalize='none'
                spellCheck={false}
                onChangeText={text=>setEmail(text)}
                value={email}
              />
            </View>

            <View style={styles.loginLabelContainer}>
              <Text style={styles.loginLabelText}>Password: </Text>
            </View>
            <View style={styles.loginInputContainer}>
              <TextInput 
                style={styles.loginInputBox}
                placeholder='enter password' 
                autoCapitalize='none'
                spellCheck={false}
                secureTextEntry={true}
                onChangeText={text=>setPassword(text)}
                value={password}
              />
            </View>
     

          <View style={styles.loginRow}>
            <Button
              onPress={async () => {
                try {
                  await signIn(email, password);
                  setEmail('')
                  setPassword('')
                } catch(error) {
                  Alert.alert("Wrong username or password", error.message,[{ text: "OK" }])
                }
              }}
            >
              Sign In
            </Button>
          </View>
      </View>
    );
  }

function LoginScreen({navigation}) {
  const [loginMode, setLoginMode] = useState(true);
  useEffect(()=> {
    subscribeToAuthChanges(navigation);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        {loginMode?
          <SigninBox navigation={navigation}/>
        :
          <SignupBox navigation={navigation}/>
        }
        </View>
      <View styles={styles.modeSwitchContainer}>
        { loginMode ? 
          <Text>Don't have an account?
            <Text 
              onPress={()=>{setLoginMode(!loginMode)}} 
              style={{color: 'blue'}}> Sign up </Text> 
            instead!
          </Text>
        :
          <Text>Already have an account?
            <Text 
              onPress={()=>{setLoginMode(!loginMode)}} 
              style={{color: 'blue'}}> Log in </Text> 
            instead!
          </Text>
        }
      </View>
    </View>
  );
}

function SignupBox({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  return (
    <View style={styles.loginContainer}>
      <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
          />
      </View>
      <Text style={styles.loginHeaderText}>Sign Up</Text>

        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>username: </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput 
            style={styles.loginInputBox}
            placeholder='enter username' 
            autoCapitalize='none'
            spellCheck={false}
            onChangeText={text=>setDisplayName(text)}
            value={displayName}
          />
        </View>

      
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Email: </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput 
            style={styles.loginInputBox}
            placeholder='enter email address' 
            autoCapitalize='none'
            spellCheck={false}
            onChangeText={text=>setEmail(text)}
            value={email}
          />
        </View>
     

        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Password: </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput 
            style={styles.loginInputBox}
            placeholder='enter password' 
            autoCapitalize='none'
            spellCheck={false}
            secureTextEntry={true}
            onChangeText={text=>setPassword(text)}
            value={password}
          />
        </View>

      <View style={styles.loginRow}>
        <Button
          onPress={async () => {
            try {
              await signUp(displayName, email, password);
              setDisplayName('')
              setEmail('')
              setPassword('')
            } catch(error) {
              Alert.alert("Sign Up Error", error.message,[{ text: "OK" }])
            }
          }}
        >
          Sign Up
        </Button>  
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#DEF4C6',
      alignItems: 'center',
      justifyContent: 'center',

    },
    bodyContainer: {
      flex: 0.8,
      justifyContent: 'center',
      alignItems: 'center',
    },

    loginContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      paddingTop: '30%',
      paddingBottom: '10%',
    },

    logoContainer: {
      flex: 0.3,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 100,
    },

    logo: {
      width: 180, 
      height: 180,
      resizeMode: 'contain',
    },


    loginHeader: {
      width: '100%',
      padding: '3%',
      justifyContent: 'center',
      alignItems: 'center',
    },

    loginHeaderText: {
      fontSize: 24,
      color: 'black',
      paddingBottom: '5%',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },

    loginRow: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      padding: '3%',
      marginTop: '3%',
    },

    loginLabelContainer: {
      flex: 0.15,
      width: 330,
      justifyContent: 'left',
      flexDirection: 'row',
    },
    loginLabelText: {
      fontSize: 18,
      marginTop: 12,
    },
    loginInputContainer: {
      flex: 0.15,
      justifyContent: 'center',
      alignItems: 'flex-start',
      width: 340,
    },
    loginInputBox: {
      width: '100%',
      borderColor: 'lightgray',
      borderWidth: 1,
      borderRadius: 6,
      fontSize: 18,
      padding: '2%'
    },
    modeSwitchContainer:{
      flex: 0.2,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      backgroundColor: 'pink'
    },
    loginButtonRow: {
      width: '100%',
      justifyContent: 'center', 
      alignItems: 'center',
    },
    listContainer: {
      flex: 0.7, 
      backgroundColor: '#ccc',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%', 
    },
  });
  export default LoginScreen;