import React, {useState} from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';

const ModalTermo = ({onPress}) => {

    const [modalVisible, setModalVisible] = useState(false);

    return(
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}>

                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Termo de Privacidade</Text>
                    </View>
                </View>
                <View style={styles.containerFooter}>
                    <View style={styles.inner}>
                        <TouchableOpacity 
                            style={styles.primaryButton}
                            onPress={onPress}>
                            <Text style={styles.primaryButtonText}>Li e Concordo com o Termo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity 
                style={styles.button1} 
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.button1Text}>Termo de Privacidade</Text>
            </TouchableOpacity>  
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    button1: {
        textAlign: "center",
    },

    button1Text: {
        fontWeight: "bold",
        textAlign: "center",
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
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

    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },

    modalText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center"
    },

    containerFooter: {
        backgroundColor: "#2980b9",
        paddingVertical: 10,
    },

    inner: {
        flexDirection: 'row',
        justifyContent: 'center', 
    },

    primaryButton: {
        borderWidth: 1,
        borderRadius: 150,
        borderColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
      
    primaryButtonText: {
        fontSize: 18,
        textAlign: 'center',
        color: "#fff",
    },
});

export default ModalTermo;