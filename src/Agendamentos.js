import React, {useState, useEffect, useCallback, useRef} from 'react';
import {View, RefreshControl, SafeAreaView, StatusBar, ScrollView, Platform, TouchableOpacity, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Abertos from "./Components/abertos";
import Agendados from './Components/agendados';
import Pendencias from './Components/pendencias';
import Instalados from './Components/instalados';
import Negados from './Components/negados';
import Aprovados from './Components/aprovados';
import Api from './Api/index';
import Footer from './Footer/footer';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function ({navigation}) {

    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    const [abertos, setAbertos] = useState();
    const [agendados, setAgendados] = useState();
    const [pendentes, setPendentes] = useState();
    const [instalados, setInstalados] = useState();
    const [negados, setNegados] = useState();
    const [aprovados, setAprovados] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [refreshing1, setRefreshing1] = useState(false);
    const [message, setMessage] = useState();

    console.log("Notificação: ", notification);

    useEffect(() => {

        registerForPushNotificationsAsync().then(token => getTokenDevice(token));
    
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });
    
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("Token Gerado: ", response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
        };

    }, []);

    const getTokenDevice = async (token)  => {
        
        console.log("Parametro: ", token);

        const token_user = await AsyncStorage.getItem('token');

        const deviceToken = await fetch(Api.url+"/api/expo-token/"+token, {
            method: 'PUT',
            body: JSON.stringify(),
            headers: {
                'Authorization': 'Token '+token_user,
                'Content-Type' : 'application/json',
            }
        });
            const jsonObject = await deviceToken.json();
            console.log(jsonObject);
        
    };

    useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {
            onRefresh();
            onRefresh1();
        });
        return unsubscribe;

    }, [navigation, message]);// Quando a tela recebe o foco ela chama a função onRefresh e atualiza a tela

    useEffect(() => {
 
        const apiGet = async () => { 
            
            const tkn = await AsyncStorage.getItem('token');
            console.log("Token", tkn);
        
            const req = await fetch(Api.url+"/api/size-status/", {
                method: 'GET',
                body: JSON.stringify(),
                headers: {
                    'Authorization': 'Token '+tkn,
                    'Content-Type' : 'application/json',
                }
            });
                const json = await req.json();
                setAbertos(json[0].aberto);
                setAgendados(json[1].agendado);
                setPendentes(json[2].pendente);
                setInstalados(json[3].instalado);
                setNegados(json[4].negado);
                setAprovados(json[5].aprovado);
        };
        apiGet();

    }, [message]);

    useEffect(() => {
        onRefresh();
        onRefresh1();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);

        const tkn = await AsyncStorage.getItem('token');
        
            const req = await fetch(Api.url+"/api/size-status/", {
                method: 'GET',
                body: JSON.stringify(),
                headers: {
                    'Authorization': 'Token '+tkn,
                    'Content-Type' : 'application/json',
                }
            });
          
            const json = await req.json();
                setAbertos(json[0].aberto);
                setAgendados(json[1].agendado);
                setPendentes(json[2].pendente);
                setInstalados(json[3].instalado);
                setNegados(json[4].negado);
                setAprovados(json[5].aprovado);

            wait(2000).then(() => setRefreshing(false));

    }, [refreshing]);

    const onRefresh1 = useCallback(async () => {
        setRefreshing1(true);

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
                await AsyncStorage.setItem('msg', JSON.stringify(mensagem.length));
                setMessage(mensagem.length);

                console.log("Mensagens: ", mensagem.length)

            wait(2000).then(() => setRefreshing1(false));

    }, [refreshing1, message]);


    return(
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                    />
                }> 

                <StatusBar barStyle="light-content" backgroundColor="#000"/>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    </TouchableOpacity>
                    <Text style={styles.title}>Meus Serviços</Text> 
                </View>

                <View> 
                    <View style={styles.buttonsContainer}>
                        <Abertos navigation={navigation} abertos={abertos}></Abertos>
                        <Agendados navigation={navigation} agendados={agendados}></Agendados>
                    </View>
                    
                    <View style={styles.buttonsContainer2}>
                        <Pendencias navigation={navigation} pendentes={pendentes}></Pendencias>
                        <Instalados navigation={navigation} instalados={instalados}></Instalados> 
                    </View>

                    <View style={styles.buttonsContainer3}>
                        <Negados navigation={navigation} negados={negados}></Negados>
                        <Aprovados navigation={navigation} aprovados={aprovados}></Aprovados>
                    </View>        
                </View>
            </ScrollView>
                <Footer navigation={navigation} message={message}></Footer>  
        </SafeAreaView>
    )
};

async function registerForPushNotificationsAsync() {

    let token;
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                alert('Falha ao obter token push para notificação push!');
                return;
            }

                token = (await Notifications.getExpoPushTokenAsync()).data;
                console.log("Token EXPO: ", token);

            } 
            else{
            alert('Deve usar dispositivo físico para notificações push');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            });
        };

    return token;
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#fff",
    },

    header:{
        height: 80,
        flexDirection: "row",
        alignItems: 'center',
        paddingTop: 5,
        justifyContent: "center",
        borderBottomWidth: 2,
        borderColor: "#bdc3c7",
        elevation: 5,
        borderStyle: 'solid',
        position: "absolute",
        top: -10,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
    },  

    title: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
        textAlign: "center",  
    },

    buttonsContainer: {
        width: "80%",
        height: "auto",
        marginTop: "28%",
        flexDirection: "row",
        justifyContent: "center",
        position: "relative",
        alignSelf: "center",
    },  

    buttonsContainer2: {
        width: "80%",
        height: "auto",
        marginTop: "10%",
        flexDirection: "row",
        justifyContent: "center",
        alignSelf: "center",
        position: "relative",
    },

    buttonsContainer3: {
        width: "80%",
        height: "auto",
        marginTop: "10%",
        flexDirection: "row",
        justifyContent: "center",
        alignSelf: "center",
        position: "relative",
        marginBottom: 100,
    },

    containerFooter: {
        flex: 0.1,
        height: 80,
        position: "absolute",
        bottom: -10,
        left: 0,
        right: 0,
        elevation: 15,
        alignItems:'center',
        backgroundColor: "#fff",
        paddingVertical: 10,
        flexDirection: 'row',
        borderTopWidth: 2,
        borderStyle: 'solid',
        borderColor: "#bdc3c7",
    },

    inner: {
        flex:1,
        justifyContent: 'center',
        alignItems:'center', 
    },

    primaryButton: {
        
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 8,

    },
      
    primaryButtonText: {
        fontSize: 18,
        textAlign: 'center',
        color: "#2c3e50",
    },
});

