import React  from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import Voltar from '../../Images/goBack.png';
import {useNavigation} from '@react-navigation/native';

const Header = ({title}) => {

    const navigation = useNavigation();

    const goBack = () => {
        navigation.reset({
            routes: [{name: "Agendamentos"}]
        });
    };

    return(
        <View style={styles.header}>
            <TouchableOpacity
                style={styles.teste} 
                onPress={goBack}>
                <Image source={Voltar}/>
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text> 
        </View>
    )
};

const styles = StyleSheet.create({
    header:{
        width: "100%",
        height: 80,
        flexDirection: "row",
        alignItems: 'center',
        paddingTop: 5,
        justifyContent: "flex-start",
        paddingLeft: 30,
        borderBottomWidth: 2,
        borderColor: "#bdc3c7",
        elevation: 5,
        borderStyle: 'solid',
        //position: "absolute",
        top: -10,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
    }, 

    title: {
        fontSize: 20,
        marginLeft: 20,
        fontWeight: "bold",
        textAlign: "center",  
    },
});

export default Header;