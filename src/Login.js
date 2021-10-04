import React, {useState, useEffect} from 'react';
import Genios from '../Images/Genios.png';
import {View, Text, Image, TouchableOpacity, StatusBar, Modal, KeyboardAvoidingView, TextInput, StyleSheet, BackHandler, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CheckBox from '@react-native-community/checkbox';
import {useNavigation} from '@react-navigation/native';
import Api from './Api/index';

const Login = () => {

    const navigation = useNavigation();

    const [user, setUser] = useState("");
    const [senha, setSenha] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [toggleCheckBox, setToggleCheckBox] = useState();

    useEffect(() => {

        const login = async () => {
            if(user === ""){
                const name = await AsyncStorage.getItem('name');
                const password = await AsyncStorage.getItem('password');
                const checkbox = await AsyncStorage.getItem('checkbox');
                setUser(name);
                setSenha(password);
                setToggleCheckBox(checkbox);

                console.log("Name: ", name);
                console.log("Password: ", password);
                console.log("CheckBox", checkbox);
            };
        };
        login();   
    },[user, senha]);

    const session = async (text) => {
        if(text === true){
            await AsyncStorage.setItem('name', user);
            await AsyncStorage.setItem('password', senha);
            await AsyncStorage.setItem('checkbox', JSON.stringify(text));
        }
        else{
            await AsyncStorage.removeItem('name');
            await AsyncStorage.removeItem('password');
        }
    };

    const connected = async (handleSend) => {

        await NetInfo.fetch().then(state => {

            if(state.isConnected === true){
                handleSend();
            }
            else{
                alert("Falha na Conexão, sem acesso a internet.");
            }
        });
    };

    const handleSend = async () => {

        const req = await fetch(Api.url+"/api-token-auth/", {
            method: 'POST',
            body: JSON.stringify({
                username: user,
                password: senha,
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type' : 'application/json'
            }
        });

        const json = await req.json();
        console.log("POST API Retorna Token: ", json.token);

        if(json.token){
            AsyncStorage.setItem('token', json.token);
            AsyncStorage.setItem('usuario', user);// Usado para verifica os_loc em Notication
            navigation.navigate("Agendamentos");
            setUser("");
            setSenha("");
        }
        else{
            setModalVisible(true);
        };   
    };

    useEffect(() => {
        const getDate = async () => {
            const data = await new Date();

            const day = await data.getDate();
            await AsyncStorage.setItem('dia', JSON.stringify(day))
            
            const month = await data.getMonth() + 1;
            await AsyncStorage.setItem('mes', JSON.stringify(month));

            const year = await data.getFullYear();
            await AsyncStorage.setItem('ano', JSON.stringify(year));
        };
        getDate();
    }, []);

    useEffect(() => {
        const backAction = () => {
            Alert.alert("Espere!", "Tem certeza que deseja Sair?", [
            {
                text: "Cancelar",
                onPress: () => null,
                style: "cancel"
            },
            { text: "Sim", onPress: () => BackHandler.exitApp() }
          ]);
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
            <StatusBar barStyle="light-content" backgroundColor="#34495e"/>

            <KeyboardAvoidingView contentContainerStyle={styles.box} behavior="position" enabled>
                <View style={styles.imageContainer}>
                    <Image source={Genios} alt="Logo Genios Shop"/>

                    <TextInput
                        style={styles.inputNome}
                        placeholder="Insira seu usuário"
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={text => setUser(text)}
                        value={user}
                    /> 

                    <TextInput
                        style={styles.inputSenha}
                        placeholder="Digite sua senha"
                        secureTextEntry
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={text => setSenha(text)}
                        value={senha}
                    />  
                </View>

                <View style={{flexDirection: "row", alignItems: "center", marginLeft: -10, marginBottom: 10}}>
                    <CheckBox
                        disabled={false}
                        value={toggleCheckBox}
                        tintColors={true ? "#3498db" : false ? "#3498db" : "#3498db"}
                        onValueChange={(text) => {
                            setToggleCheckBox(text);
                            session(text);
                        }}
                    />
                    <Text style={{fontSize: 14, color: "#000"}}>Manter-me conectado</Text>
                </View>

                <View style={styles.containerButtonLogin}>
                    <TouchableOpacity 
                        style={styles.buttonLogin}
                        onPress={() => connected(handleSend)}>
                        <Text style={styles.buttonText}>ENTRAR</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>

            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                    setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Image source={Genios}/>
                            <Text style={styles.modalText}>Olá parceiro, usuario ou senha inválidos.</Text>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {
                                    setUser("");
                                    setSenha("");
                                    setModalVisible(!modalVisible);
                                }}
                            >
                            <Text style={styles.textStyle}>Tentar Novamente</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#34495e",
    },

    box:{
        alignItems: "center",
    },  

    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },

    imageContainer: {
        marginTop: "20%",
        alignItems: "center",
        padding: 20,
        borderRadius: 40,
        backgroundColor: "#34495e",
    },
    
    inputNome: {
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#95a5a6",
        fontSize: 18,
        width: 250,
        height: 40,
        padding: 10,
        marginTop: "15%",
        borderRadius: 40,
        backgroundColor: "#ecf0f1",
    },

    inputSenha: {
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#95a5a6",
        fontSize: 18,
        width: 250,
        height: 40,
        padding: 10,
        marginTop: 30,
        borderRadius: 40,
        backgroundColor: "#ecf0f1",
    },

    containerButtonLogin: {
        width: 250,
        height: 60,
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
    },  

    buttonLogin: {
        width: 200,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        borderRadius: 5,
        marginBottom: 30,
        backgroundColor: "#3498db",
    },

    buttonText: {
        fontWeight: "bold",
        color: "#fff",
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },

    modalView: {
        width: "100%",
        height: "100%",
        margin: 20,
        justifyContent: "center",
        backgroundColor: "#34495e",
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
    },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        //elevation: 5
    },

    button: {
        marginTop: 20,
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },

    buttonClose: {
        backgroundColor: "#2196F3",
    },

    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },

    modalText: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
        color: "#fff",
        marginBottom: 15,
        textAlign: "center"
    },
});

export default Login;