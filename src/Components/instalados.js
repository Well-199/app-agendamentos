import React, { useState, useEffect } from 'react';
import {View, Text,  Modal, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import Api from '../Api/index';
import ModaFooter from "../ModalFooter/ModalFooter";
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

const Instalados = ({navigation, instalados}) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [data, setData] = useState([]);
    const [token, setToken] = useState();

    useEffect(() => {
        
        const getToken = async () => {
            const tkn = await AsyncStorage.getItem('token');
            setToken(tkn);
        };
        getToken();
    }, []);

    const openModal = () => {
        setModalVisible(true)
        getData(); 
    }

    const closeModal = (item) => {
        navigation.navigate("Pedidos_Instalados", {entry: item});
        setModalVisible(!modalVisible);
    }

    async function getData(){

        const req = await fetch(Api.url+"/api/instalado/",{
            method: "GET",
            body: JSON.stringify(),
            headers: {
                'Authorization': 'Token '+token,
                'Content-Type' : 'application/json'
            }
        });

        const json = await req.json();
        setData(json);

        console.log(json);
    };

    return(
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}>

                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Instalados</Text>

                        <FlatList 
                            data={data}
                            keyExtractor={item => JSON.stringify(item.id)}
                                renderItem={({item}) => 
                                        
                                <TouchableOpacity 
                                    style={styles.buttonItem}
                                    onPress={() => closeModal(item)}
                                    >
                                    <View>
                                        <Text>OS: {item.os}</Text>
                                        <Text>Cliente - Placa: {item.cliente_loc}</Text>
                                        <Text>Data: {moment(item.data).format("DD/MM/YYYY")}</Text>
                                        <Text>Status: {item.status}</Text>
                                    </View>
                                </TouchableOpacity>
                            }>

                        </FlatList>
                    </View>
                </View>

                <ModaFooter onPress={() => setModalVisible(!modalVisible)}/>
            </Modal>
          
            <TouchableOpacity 
                style={instalados > 0 ? styles.button4 : styles.button44} 
                onPress={openModal}>
                <Text style={styles.button4Text}>Instalados</Text>
                <Text style={styles.lenght}>{instalados}</Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container:{
        //flex: 1,
    },

    button4: {
        width: 120,
        height: 120,
        borderRadius: 5,
        backgroundColor: "#e67e22",
        marginLeft: 30,
        justifyContent: "center",
        shadowColor: "#000",    
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

    button44:{
        width: 120,
        height: 120,
        borderRadius: 5,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#e67e22",
        backgroundColor: "#fff",
        marginLeft: 30,
        justifyContent: "center",
        shadowColor: "#000",    
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

    button4Text: {
        fontSize: 18,
        textAlign: "center",
        alignItems: "center",
    },

    lenght:{
        fontSize: 18,
        textAlign: "center",
        alignItems: "center",
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    modalView: {
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",    
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

    modalText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center"
    },

    buttonItem:{
        width: "100%",
        minWidth: 250,
        borderColor: "black",
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
});

export default Instalados;