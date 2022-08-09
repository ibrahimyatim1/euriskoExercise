
 import React, { Fragment, useState } from 'react';
 import {
   StyleSheet,
   View,
   ActivityIndicator,
   TouchableOpacity, 
   Text,
   TextInput,
 } from 'react-native';

 import { serverLink, width, height } from '../constants';

 import { SetUser } from '../actions/users_action';
 import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
   
 function Login ({navigation}) {
 
  const [username, setUsername] = useState('candidate');
  const [password, setPassword] = useState('P@ssw0rd');
  const [ready, setReady] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const dispatch = useDispatch();

  const login = () => {
    if(!username || username === ''){
      return setErrorMessage('Invalid username');
    }
    if(!password || password === ''){
      return setErrorMessage('Invalid password');
    }
    setReady(false)
    const url = `${serverLink}/auth/signin`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
              "username": username,
              "password": password
            })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      const serverData = { ...responseJson };
      if(serverData.accessToken){
        console.log(serverData.accessToken)
        dispatch(SetUser(serverData.accessToken));
        try{
          AsyncStorage.setItem('accessToken', JSON.stringify(serverData.accessToken));
        }
        catch(error){
          console.log(error, 'error set async in login');
        }
        return navigation.navigate('Home');
      }
      else {
        setReady(true);
        return alert('error username or password');
      }
    })
    .catch((error) => {
      setReady(true);
      alert(error);
    });
   }
    return (
      <Fragment>
        <View style={styles.container}>
          <Text>Login</Text>
          {/* {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>} */}
          <TextInput 
            placeholder={'Username'}
            testID='usernameInput'
            onChangeText={(e)=> {setUsername(e); setErrorMessage(null)}} 
            style={styles.usernameInput} 
          />

          <TextInput 
            secureTextEntry 
            testID='passwordInput'
            placeholder={'Password'}
            style={styles.passwordInput} 
            onChangeText={(e)=> {setPassword(e); setErrorMessage(null)}} 
          />
          <TouchableOpacity disabled={!ready || (username=='' && password=='')} style={styles.loginButton} 
            onPress={()=> login()}>
            <Text>Login</Text>
          </TouchableOpacity> 
          {!ready &&
            <ActivityIndicator style={{ marginTop: 10 }} />
          }
      </View>
      </Fragment>
    );
 };
 
 const styles = StyleSheet.create({
   container:{
    alignItems: 'center', 
    paddingTop: 60
   },
   loginButton: {
    marginTop: 50, 
    width: width * 0.8, 
    padding: width * 0.04, 
    alignItems: 'center', 
    borderRadius: 5,
    backgroundColor: 'red'
   },
   passwordInput:{
    marginTop: 20, 
    borderColor: 'black', 
    borderWidth: 1, 
    width: width * 0.8, 
    borderRadius: 5, 
    padding: 10, 
   },
   usernameInput: {
    marginTop: 20, 
    borderColor: 'black', 
    borderWidth: 1, 
    width: width * 0.8, 
    borderRadius: 5, 
    padding: 10,
   }
 });
 
 export default Login;