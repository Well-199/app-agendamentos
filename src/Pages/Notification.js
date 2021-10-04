import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, FlatList, RefreshControl, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import Header from '../Header/Header';
import Footer from '../Footer/footer';
import Api from '../Api/index';
import moment from 'moment';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
};

const Notification = () => {

    const navigation = useNavigation();

    const [refreshing, setRefreshing] = useState(false);
    const [refreshing1, setRefreshing1] = useState(false);
    const [msg, setMsg] = useState();
    const [message, setMessage] = useState();

    const user = AsyncStorage.getItem('usuario');

    useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {
            onRefresh();
            onRefresh1();
        });
        return unsubscribe;

    }, [navigation, message]);

    useEffect(() => {

        const messageGet = async () => {

        const tkn = await AsyncStorage.getItem('token');

            const reqMessage = await fetch(Api.url+"/api/messagelist/?active=true",{// Todas as Mensagens
                method: "GET",
                body: JSON.stringify(),
                headers: {
                    'Authorization': 'Token '+tkn,
                    'Content-Type' : 'application/json'
                }
            });
        
            const res = await reqMessage.json();
            setMessage(res);
        }
        messageGet();

        const getAmount = async () => {

            const tkn = await AsyncStorage.getItem('token');
    
                const amount = await fetch(Api.url+"/api/messagelist/?active=true&read=false",{// Somente Mensagens Nao Lidas
                    method: "GET",
                    body: JSON.stringify(),
                    headers: {
                        'Authorization': 'Token '+tkn,
                        'Content-Type' : 'application/json'
                    }
                });
            
                const res_amount = await amount.json();
                setMsg(res_amount.length);
            }
            getAmount();
    }, []);

    const read = async (item) => {

        const tkn = await AsyncStorage.getItem('token');

        const req = await fetch(`${Api.url}/api/change-message/${item.os_loc}`,{// Atualiza como Mensagem Lida
            method: "PUT",
            body: JSON.stringify(),
            headers: {
                'Authorization': 'Token '+tkn,
                'Content-Type' : 'application/json'
            }
        });
            try{
                const res = await req.json();
                console.log(res);

                navigation.reset({
                    index: 0,
                    routes: [{name: 'Chat', params: {entry: item}}],// reset no historico de navegaçao e passa parametros
                })
            }catch(e){
                console.log("ERRO: ", e);

                navigation.reset({
                    index: 0,
                    routes: [{name: 'Chat', params: {entry: item}}],// reset no historico de navegaçao e passa parametros
                })
            };

            console.log("Item: ", item);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);

        const tkn = await AsyncStorage.getItem('token');

            const reqMessage = await fetch(Api.url+"/api/messagelist/?active=true",{// Todas as Mensagens
                method: "GET",
                body: JSON.stringify(),
                headers: {
                    'Authorization': 'Token '+tkn,
                    'Content-Type' : 'application/json'
                }
            });
        
            const res = await reqMessage.json();
            setMessage(res);

            wait(2000).then(() => setRefreshing(false));

    }, [refreshing, message, msg]);

    const onRefresh1 = useCallback(async () => {
        setRefreshing1(true);

        const tkn = await AsyncStorage.getItem('token');

            const reqMessage = await fetch(Api.url+"/api/messagelist/?active=true&read=false",{// Somente Mensagens Nao Lidas
                method: "GET",
                body: JSON.stringify(),
                headers: {
                    'Authorization': 'Token '+tkn,
                    'Content-Type' : 'application/json'
                }
            });
        
            const res = await reqMessage.json();
            setMsg(res.length);

            wait(2000).then(() => setRefreshing1(false));

    }, [refreshing1, message, msg]);

    return(
        <View style={styles.container}>
            <Header navigation={navigation} title="Notificações"></Header>

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                    }> 
   
                {message ? 
                <View style={{marginBottom: 130}}>
                    <FlatList 
                        data={message}
                        keyExtractor={item => JSON.stringify(item.id)}
                        renderItem={({item}) => 

                        <View style={{width: "100%", height: 80, alignSelf: "center", padding: 10, marginBottom: 10, marginLeft: 30, marginRight: 30}}>
                            <TouchableOpacity 
                                style={item.read === false ? styles.mensagens : styles.mensagensLidas}
                                    onPress={() => read(item)}>
                                        <View style={{flexDirection: "row", justifyContent: "flex-start"}}>
                                            <Text style={styles.messageText}>{moment(item.create).format("DD/MM/YYYY")}</Text>
                                            <Text style={styles.messageText}>{moment(item.create).format('LT')}</Text>
                                            {item.os_loc.match(user) ? 
                                            <Text ></Text>
                                            :
                                            <Text style={styles.txtOs}>OS: {item.os_loc}</Text>
                                            }
                                        </View>
                                        <View style={{flexDirection: "row", justifyContent: "flex-start"}}>
                                            <Text numberOfLines={1} style={item.read === false ? styles.textFalse : styles.textTrue}>{item.message}</Text>
                                        </View>
                                        
                            </TouchableOpacity>
                        </View>
                    }>    
                    </FlatList>
                </View>
                :
                <View></View>
                }               
            </ScrollView>

                <TouchableOpacity
                    style={styles.newMessage}
                    onPress={() => navigation.navigate("Contato", {tela: "Notification"})}>
                    <Text style={styles.newMessageText}>+</Text>
                </TouchableOpacity>

           <Footer navigation={navigation} message={msg}></Footer>
           </View>
        );
    };

    const styles = StyleSheet.create({
        container:{
            flex: 1,
        },

        messageText:{
            fontSize: 14, 
            marginBottom: 8, 
            marginTop: 4, 
            color: "#000", 
            marginLeft: 15,
            fontWeight: "bold",
        },

        txtOs:{
            fontSize: 14,
            fontWeight: "bold",
            color: "#000",
            marginBottom: 8, 
            marginTop: 4,
            marginLeft: "25%",
        },

        mensagens:{
            width: "100%",
            height: 80,
            alignSelf: "center",
            padding: 5,
            elevation: 5,
            borderStyle: "solid",
            borderColor: "#3498db",
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 10,
            backgroundColor: "#fff",
        },

        mensagensLidas:{
            width: "100%",
            height: 80,
            alignSelf: "center",
            padding: 5,
            borderRadius: 8,
            marginBottom: 10,
            backgroundColor: "#95a5a6",
        },

        textFalse:{
            fontSize: 18,
            marginLeft: 15,
            marginBottom: 8,
            marginRight: 15,
            textAlign: "justify",
            color: "#000",
        },

        textTrue:{
            fontSize: 18,
            marginLeft: 15,
            marginBottom: 8,
            marginRight: 15,
            textAlign: "justify",
            color: "#bdc3c7",
        },

        newMessage:{
            width: 60,
            height: 60,
            elevation: 5,
            alignSelf: "flex-end",
            marginRight: 20,
            borderRadius: 40,
            marginTop: -100,
            marginBottom: 100,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#27ae60",
        },  

        newMessageText:{
            fontSize: 40,
            marginBottom: 3, 
            color: "#ffffff", 
        },
    });

export default Notification;

