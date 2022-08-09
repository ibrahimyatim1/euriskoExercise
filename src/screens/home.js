
 import React, { Fragment, useState, useEffect, useRef } from 'react';
 import {
   StyleSheet,
   View,
   RefreshControl,
   TouchableOpacity, 
   FlatList,
   TextInput,
   Text,
 } from 'react-native';
 import { useSelector, useDispatch } from 'react-redux';
 import { logoutUser } from '../actions/users_action';
 import { serverLink, width, height } from '../constants';
 import {useNavigation} from '@react-navigation/native';
 
 function Home() {
   
  const navigation = useNavigation();
  const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [ready, setReady] = useState(false);
  const [firstReady, setFirstReady] = useState(false);
  const [stopFetch, setStopFetch] = useState(false);
  const [page, setPage] = useState(0);
  const user = useSelector(state=> state.userReducer);
  
  const dispatch = useDispatch();

  var keywordRef = useRef();

  useEffect(() => {
     getArticles();
  },[page]);

  const getArticles = () => {
    setReady(false);
    const url = `${serverLink}/articles?page=${page}`;
    console.log(url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user}`, 
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      const serverData = { ...responseJson };
      if(serverData.status == 'OK'){
        if(keywordRef.current.value){
          delete keywordRef.current.value;
        }
        let newResponse = [];
        console.log('new array from server', serverData.response.docs);
        if(page!=0){
          newResponse = allArticles;
        }
        keywordRef.current.clear();
        if(serverData.response.docs.length<1){
          setStopFetch(true);
        }
        else {
          if(page==0){ 
            setArticles(serverData.response.docs); 
            setAllArticles(serverData.response.docs);
          }
          else {
            setArticles(()=>{return [...newResponse, ...serverData.response.docs]});
            setAllArticles(()=>{return [...newResponse, ...serverData.response.docs]});
          }
        }
      }
      setStopFetch(false);
      setReady(true);
      setFirstReady(true);
    })
    .catch((error) => {
      console.log(error);
    });
   }

  const logout=()=>{
    navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    dispatch(logoutUser()); 
  }

  const resetPage= async ()=>{
    if(page!=0)
    await setPage(0); 
    else getArticles();
  }

  const updateList = (keyword) => {
    let result = [];
    keyword = keyword.toLowerCase();
    for(var i=0; i<allArticles.length;i++){
      if(allArticles[i].abstract.toLowerCase().includes(keyword) || allArticles[i].lead_paragraph.toLowerCase().includes(keyword)){
        result.push(allArticles[i]);
      }
    }
    setArticles(result);
  }

   const ifApiCall=()=>{
    if(!stopFetch && ready && (keywordRef.current?.value==''|| !keywordRef.current.value )) {
      setPage(page+1)
    }
   }

   const renderItem=({item})=>{
     return(
      <View style={styles.item}>
        <Text numberOfLines={2} style={styles.title}>{item.abstract}</Text>
        <Text numberOfLines={2} reg style={styles.description}>{item.lead_paragraph}</Text>
      </View>
     )
   }

   const clearInputValue=()=>{
    setArticles(allArticles); 
    keywordRef.current.clear(); 
    keywordRef.current.value = '';
    setStopFetch(false)
   }

 
    return (
      <Fragment>
        <View style={styles.container}>
          <TouchableOpacity style={styles.logoutButton} onPress={()=> logout()}>
            <Text>Logout</Text>
          </TouchableOpacity>
          <View style={{ justifyContent: 'center' }}>
            <TextInput 
              ref={keywordRef}
              placeholder={'Search'}
              onChangeText={(e)=> {keywordRef.current.value = e; updateList(e)}} 
              style={styles.textInput} 
            />
            <TouchableOpacity onPress={clearInputValue} style={styles.clearButton}>
              <Text>Clear</Text>
            </TouchableOpacity>
          </View>
          {firstReady &&
            <FlatList
                style={{ marginTop: 20, }}
                data={articles}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={renderItem}
                keyExtractor={(item) => item.pub_date}
                refreshControl={<RefreshControl tintColor="#ffffff" refreshing={!ready} onRefresh={async ()=> { resetPage()}} />}
                ListEmptyComponent={
                  <Text>No articles</Text>
                }
                onEndReached={()=> {ifApiCall()}}
                onEndReachedThreshold={0.5}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            />
          }
        </View>
      </Fragment>
    );
 };
 
 const styles = StyleSheet.create({
   container:{
    flex:1,
    alignItems: 'center', 
    paddingTop: 20, 
    backgroundColor: '#D3D3D3',
    paddingHorizontal: 25 
   },
   textInput:{
    borderColor: 'black', 
    borderWidth: 1, 
    width: width * 0.9, 
    borderRadius: 5, 
    padding: 10, 
    backgroundColor: 'white',
    marginTop: 10,
   },
   item:{
    width: width * 0.9, 
    backgroundColor: 'white', 
    marginTop: width * 0.02, 
    padding: width * 0.03, 

    shadowOpacity: 0.3, 
    shadowOffset: {width: 0,height: 2,},
    elevation: 2,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 100
   },
   clearButton:{
    position: 'absolute', 
    top: width * 0.06, 
    right: width * 0.04,
   },
   title:{
     fontWeight: 'bold' 
   },
   description:{
    fontSize: 12,
    marginTop: 8
   },
   logoutButton:{
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 7, 
    alignSelf: 'flex-end',
   }
 });
 
 export default Home;