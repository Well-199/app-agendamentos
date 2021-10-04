import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, TouchableOpacity, RefreshControl, ScrollView, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Api from './Api/index';
import Header from './Header/Header';
import Footer from './Footer/footer';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const Configuracoes = ({navigation}) => {

  const [msg, setMsg] = useState();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {

    const unsubscribe = navigation.addListener('focus', () => {
        onRefresh();
    });
    return unsubscribe;

  }, [navigation, msg]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

        const tkn = await AsyncStorage.getItem('token');

        const reqMessage = await fetch(Api.url+"/api/messagelist/?active=true&read=false",{
            method: "GET",
            body: JSON.stringify(),
            headers: {
                'Authorization': 'Token '+tkn,
                'Content-Type' : 'application/json'
            }
        });

            const mensagem = await reqMessage.json();
            setMsg(mensagem.length);

            console.log("Mensagens: ", mensagem.length)

        wait(2000).then(() => setRefreshing(false));

}, [refreshing, msg]);
  
  return(
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefresh()}
          />
        }>

      <Header navigation={navigation} title="Configuraçoes"></Header>
      

      </ScrollView>
        <Footer navigation={navigation} message={msg}></Footer>
    </View>
  )
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
})

export default Configuracoes;