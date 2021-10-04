import React, {useState, useEffect, useCallback} from 'react';
import {View, RefreshControl, Text, ScrollView, Modal, Button, Linking, TouchableOpacity, BackHandler, Image, TextInput,  StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import WhatsApp from "../Images/whatsapp.png";
import Facebook from "../Images/face.png";
import Instagran from "../Images/insta.png";
import Back from '../Images/back-arrow.png';
import Api from './Api/index';
import Header from './Header/Header';
import moment from 'moment';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const Contato = ({route}) => {

    const entry = route.params?.entry ? route.params.entry : {os_loc: "1"};
    const [telaNav, setTelaNav] = useState(`${route.params.tela}`);
    const [telaUser, setTelaUser] = useState("");

    useEffect(() => {

        const alterarTela = () => {
            if(telaNav === "Notification"){
                setTelaUser("Notificações");
                setTelaNav({ routes: [{name: "Notification"}] });
            }
            if(telaNav === "Pedidos_Abertos"){
                setTelaUser("Serviço Aberto");
                setTelaNav({ index: 0, routes: [{name: "Pedidos_Abertos", params: {entry: entry}}] })
            }
            if(telaNav === "Pedidos_Agendados"){
                setTelaUser("Serviço Agendado");
                setTelaNav({ index: 0, routes: [{name: "Pedidos_Agendados", params: {entry: entry}}] }) 
            }
            if(telaNav === "Pedidos_Pendencias"){
                setTelaUser("Serviço Pendente");
                setTelaNav({ index: 0, routes: [{name: "Pedidos_Pendencias", params: {entry: entry}}] })
            }
            if(telaNav === "Pedidos_Negados"){
                setTelaUser("Serviço Negado");
                setTelaNav({ index: 0, routes: [{name: "Pedidos_Negados", params: {entry: entry}}] })
            }
            if(telaNav === "Pedidos_Aprovados"){
                setTelaUser("Serviço Aprovado");
                setTelaNav({ index: 0, routes: [{name: "Pedidos_Aprovados", params: {entry: entry}}] })
            }
            if(telaNav === "Pedidos_Instalados"){
                setTelaUser("Serviço Instalado");
                setTelaNav({ index: 0, routes: [{name: "Pedidos_Instalados", params: {entry: entry}}] })
            }
            if(telaNav === "Pedidos_Finalizados"){
                setTelaUser("Serviço Finalizado");
                setTelaNav({ index: 0, routes: [{name: "Pedidos_Finalizados", params: {entry: entry}}] })
            }
        };

        alterarTela();

    }, []);

    console.log("Parametro de Tela: ", telaNav);

    const navigation = useNavigation();

    const [msg, setMsg] = useState();
    const [message, setMessage] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [phone] = useState(5511947787492);
    const [id] = useState(entry.os_loc === undefined ? entry.os : entry.os_loc);

    console.log("ID: ", id);

    const whats = () => {
        Linking.openURL(`http://api.whatsapp.com/send?phone=${phone}`);
    };

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
    
            wait(2000).then(() => setRefreshing(false));
    
    }, [refreshing, msg]);

    const goBack = () => {
        navigation.reset(telaNav);
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

    return(
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh()}
                />
            }>
            <Header navigation={navigation} title="Contato"></Header>

                <View style={styles.body}>
                    <Text style={styles.title}>Bem-vindo a Pagina de Contato estamos prontos para esclarecer suas dúvidas fale conosco!</Text>
                </View>
                <View style={styles.centeredView}>
                    <TouchableOpacity 
                        style={[styles.buttonWhats, {justifyContent: "center", alignItems: "center"}]} 
                        onPress={whats}>
                        <Image source={WhatsApp} />  
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.buttonWhats, {justifyContent: "center", alignItems: "center"}]}>
                        <Image source={Facebook} />  
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.buttonWhats, {justifyContent: "center", alignItems: "center"}]}>
                        <Image source={Instagran} />  
                    </TouchableOpacity>
                </View>


                <View style={{marginTop: 30}}>
                    <Text style={styles.title}>Ou se preferir envie uma mensagem</Text>
                </View>

                {id === "1" ? 
                <View style={{alignSelf: "center", marginTop: 20}}>
                    <Button 
                        title="Digite sua mensagem" 
                        onPress={() => navigation.navigate("Chat", {entry: entry})}/>
                </View> 
                :
                <View style={{width: "100%", height: 80, alignSelf: "center", padding: 10, marginBottom: 10, marginLeft: 30, marginRight: 30}}>
                    <TouchableOpacity 
                        style={entry.read === false ? styles.mensagens : styles.mensagensLidas}
                        onPress={() => navigation.reset({
                            index: 0,
                            routes: [{name: 'Chat', params: {entry: entry, id}}],// reset no historico de navegaçao e passa parametros
                          })}>

                        <View style={{flexDirection: "row", justifyContent: "space-around"}}>
                            <View style={{flexDirection: "column", justifyContent: "space-around"}}>
                                <Text style={{fontSize: 14, marginBottom: 8, marginTop: 4, color: "#000", textAlign: "center"}}>{moment(entry.create).format("DD/MM/YYYY")}</Text>
                                <Text style={{fontSize: 14, marginBottom: 10, marginTop: 10, color: "#000", textAlign: "center"}}>OS: {id}</Text>
                                <Text numberOfLines={1} style={entry.read === false ? styles.textFalse : styles.textTrue}>{entry.message}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                }

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(!modalVisible)}>

                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite sua mensagem"
                            onChangeText={(text) => setMessage(text)}
                            value={message}
                        />

                        <TouchableOpacity 
                            style={styles.button}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                }}>
                            <Text style={styles.buttonText}>Enviar</Text>  
                        </TouchableOpacity>
                    </View>
                </Modal>
            </ScrollView> 
            
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={goBack}>
                    <Image source={Back}/>
                </TouchableOpacity>

                <Text style={styles.footerTxt}>Ver {telaUser}</Text>
            </View> 
        </View>
    )
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },

    body:{
        padding: 20,
    },

    title:{
        fontSize: 18,
        textAlign: "center",
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
    
    centeredView: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },

    buttonWhats:{
        width: 50,
        height: 50,
        padding: 10,
        borderRadius: 10,
        alignSelf: "center",
        textAlign: "center",
        marginTop: 20,
    }, 

    buttonFacebook:{
        width: 50,
        height: 50,
        padding: 10,
        borderRadius: 10,
        alignSelf: "center",
        textAlign: "center",
        marginTop: 20,
    },

    buttonInstagran:{
        width: 50,
        height: 50,
        padding: 10,
        borderRadius: 10,
        alignSelf: "center",
        textAlign: "center",
        marginTop: 20,
    },

    modalView:{
        width: "90%",
        height: 100,
        alignSelf: "center",
        marginTop: "25%",
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: "#fff",
    },

    input:{
        fontSize: 18,
        padding: 10,
    },

    button:{
        width: 70,
        height: 40,
        padding: 5,
        justifyContent: "center",
        alignSelf: "flex-end",
        marginTop: 5,
        marginRight: 5,
        borderRadius: 8,
        backgroundColor: "#3498db",
    },
    
    buttonText:{
        fontSize: 16,
        textAlign: "center",
        color: "#fff",
    }, 

    footer:{
        flex: 0.1,
        height: 70,
        position: "absolute",
        bottom: -10,
        left: 0,
        right: 0,
        elevation: 15,
        alignItems:'center',
        backgroundColor: "#fff",
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: "flex-start",
    },

    backButton:{
        marginLeft: 20,
        marginBottom: 10,
    },

    footerTxt:{
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 20,
        marginBottom: 10,
    },
});

export default Contato;