import React from 'react';
import {View, TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import Navigation from '../../Images/nav.png';
import Agenda from '../../Images/agenda.jpg';
import Open from '../../Images/open.png';
import Config from '../../Images/config.png';
import Financas from '../../Images/financas.jpg';

const Footer = ({navigation, message}) => {

    return(
        <View style={styles.containerFooter}>
            <View style={[styles.inner, {marginTop: 5}]}>
                <TouchableOpacity 
                    style={styles.primaryButton} 
                    onPress={() => navigation.navigate("Agendamentos")}>
                    <Image source={Navigation}/>
                </TouchableOpacity>
            </View>

            <View style={styles.inner}>
                <TouchableOpacity 
                    style={styles.primaryButton} 
                    onPress={() => navigation.navigate("Agenda")}>
                    <Image source={Agenda}/>
                </TouchableOpacity>
            </View>

            <View style={styles.inner}>
                <TouchableOpacity 
                    style={styles.primaryButton} 
                    onPress={() => navigation.navigate("Financeiro")}>
                    <Image source={Financas}/>
                </TouchableOpacity>
            </View>

            <View style={styles.inner}>  
                <TouchableOpacity 
                    style={styles.primaryButton} 
                    onPress={() => navigation.navigate("Notification")}>

                        {message > 0 ? 
                            <View style={styles.notificationsView}>
                                <Text style={styles.notifications}>{message}</Text>
                            </View>
                            :
                            <View></View>
                        }
                    <Image source={Config}/>
                </TouchableOpacity>
            </View>

            <View style={styles.inner}>
                <TouchableOpacity 
                    style={styles.primaryButton} 
                    onPress={() => navigation.toggleDrawer()}>
                    <Image source={Open} style={styles.open}/>
                </TouchableOpacity>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
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

    notificationsView:{
        width: 30,
        height: 30,
        borderRadius: 50,
        justifyContent: "center",
        marginBottom: -15,
        marginLeft: 15,
        backgroundColor: "#EA2027",
    },

    notifications:{
        fontWeight: "bold",
        textAlign :"center",
        color: "#fff",
    },  
});

export default Footer;