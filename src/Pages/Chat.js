import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, StatusBar, RefreshControl, ScrollView, Image, TouchableOpacity, FlatList, BackHandler, Alert, TextInput, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Api from '../Api';
import Send from '../../Images/send.png';
import Back from '../../Images/back-arrow.png';
import Delete from '../../Images/trash.png';
import Genios from '../../Images/Genios.png';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
};

const Chat = ({route}) => {

    const navigation = useNavigation();

    const [refreshing, setRefreshing] = useState(false);
    const [refreshing1, setRefreshing1] = useState(false);
    const [talk, setTalk] = useState([]);
    const [send, setSend] = useState(false);
    const [message, setMessage] = useState("");

    const entry = route.params.entry;
    const [id, setId] = useState(route.params.id === undefined ? entry.os_loc : route.params.id);

    console.log("ID: ", id);
    console.log("Entry: ", entry);

    useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {
            onRefresh();
        });
        return unsubscribe;
    
    }, [navigation]);

    const onRefresh = useCallback(async (newId) => {

        if(newId === undefined){
            var urlApi = `${Api.url}/api/chatmessage/?os_loc=${id}&active=true`; 
        }
        else{
            var urlApi = `${Api.url}/api/chatmessage/?os_loc=${newId}&active=true`;
        };
         
        setRefreshing(true);
    
        const tkn = await AsyncStorage.getItem('token');

        const req = await fetch(urlApi, {
            method: 'GET',
            body: JSON.stringify(),
            headers: {
                'Authorization': 'Token '+tkn,
                'Content-Type' : 'application/json'
            }
        });
            const json = await req.json();

            setSend(true);
            setTalk(json);

            console.log("GET: ", json);
        
            wait(3000).then(() => setRefreshing(false)); 
        
    }, [refreshing, id]);


    const sendMessage = async (onRefresh) => {

        const tkn = await AsyncStorage.getItem('token');
    
        const req = await fetch(Api.url+"/api/createmessage/", {
            method: 'POST',
            body: JSON.stringify({
                message: message,
                os_loc: id,
            }),
            headers: {
                'Authorization': 'Token '+tkn,
                'Content-Type' : 'application/json'
            }
        });

            const json = await req.json();
            console.log("Resposta: ", json);
            setId(json);
            onRefresh(json);
            setMessage("");
    };

    const env = () => {
        if(message !== ""){
            sendMessage(onRefresh);
        }
        else{
            alert("Campo de Mensagem Vazio");
        }   
    };

    const goBack = () => {
        navigation.reset({
            routes: [{name: "Notification"}]
        });
    };

    useEffect(() => {
        const backAction = () => {
            [{ text: "Sim", onPress: () => goBack()}];
            return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );
    
        return () => backHandler.remove();

    }, []);

    const delete_message = () => {
        Alert.alert("Espere!", "Tem certeza que deseja Excluir a Conversa?", [
            { text: "Cancelar", onPress: () => null, style: "cancel" },
            { text: "Sim", onPress: () => delete_message_ok(onRefresh) }
        ]);
        return true;
    };

    const delete_message_ok = async (onRefresh) => {
        const tkn = await AsyncStorage.getItem('token');

        const req = await fetch(Api.url+"/api/change-message/"+id,{
            method: "POST",
            body: JSON.stringify(),
            headers: {
                'Authorization': 'Token '+tkn,
                'Content-Type' : 'application/json'
            }
        });

        onRefresh();

        console.log("POST: ", Api.url+"/api/change-message/"+id);

        const res = await req.json();
        console.log(res);

    };

    const connected = async (env) => {

        await NetInfo.fetch().then(state => {

            if(state.isConnected === true){
                env();
            }
            else{
                alert("Falha na Conexão, sem acesso a internet.");
            }
        });
    };

    return(
        <View style={styles.container}> 

            <StatusBar barStyle="light-content" backgroundColor="#2980b9"/>

            <Image source={Genios} style={styles.image}/>

            <View style={styles.body}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }>
                 
                    {send !== false && talk.length > 0 ? 
                    <View style={styles.userView}>

                        <FlatList
                            data={talk}
                            extraData={talk}
                            keyExtractor={item => JSON.stringify(item.id)}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    style={item.from_msg === "arena" ? styles.arenaMessage : styles.userMessage}>
                                    <Text>{item.message}</Text>
                                    <Text style={styles.time}>{moment(item.create).format('LT')}</Text> 
                                </TouchableOpacity>
                            )}>
                        </FlatList>

                    </View>
                    :
                    <View></View>
                    }

                </ScrollView>
            </View>
            
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={goBack}>
                    <Image source={Back}/>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={delete_message}>
                    <Image source={Delete}/>
                </TouchableOpacity>
                
                <TextInput 
                    style={styles.input}
                    onChangeText={(text) => setMessage(text)}
                    placeholder="Mensagem"
                    multiline={true}
                    value={message}>
                </TextInput>

                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={() => connected(env)}>
                    <Image source={Send}/>
                </TouchableOpacity>
            </View>   
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#2980b9",
    },

    image:{
        marginTop: 20,
        alignSelf: "center",
    },  

    body:{
        width: "100%",
        height: "100%",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        marginTop: 10,
        backgroundColor: "#ffff",
    },

    userView:{
        flex: 1,
        height: "auto",
        width: "100%",
        flexDirection: "row",
        marginLeft: 10,
        marginBottom: 230,
    },

    userMessage:{
        width: "80%",
        marginTop: 20,
        height: "auto",
        padding: 5,
        alignSelf: "flex-end",
        marginRight: 20,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        backgroundColor: "#2ecc71",
    },

    arenaMessage:{
        width: "80%",
        marginTop: 20,
        height: "auto",
        padding: 5,
        alignSelf: "flex-start",
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: "#bdc3c7",
    },

    time:{
        fontSize: 10,
        alignSelf: "flex-end",
        marginRight: 10,
    },

    footer:{
        flex: 0.1,
        width: "100%",
        height: "auto",
        position: "absolute",
        bottom: -10,
        left: 0,
        right: 0,
        elevation: 15,
        alignItems:'center',
        backgroundColor: "#fff",
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: "space-around",
    },

    input:{
        width: "50%",
        height: "auto",
        marginTop: 10,
        marginBottom: 20,
        padding: 5,
        borderRadius: 10,
        backgroundColor: "#bdc3c7",
    },

    sendButton:{
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },

    backButton:{
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
    },

    deleteButton:{
        marginRight: 10,
        marginBottom: 10,
    },
});

export default Chat;