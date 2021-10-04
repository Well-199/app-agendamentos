import React from "react";
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const ModaFooter = ({onPress}) => {

    return(
        <View style={styles.containerFooter}>
            <View style={styles.inner}>
                <TouchableOpacity 
                    style={styles.primaryButton}
                    onPress={onPress}>
                    <Text style={styles.primaryButtonText}>Fechar</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    containerFooter: {
        backgroundColor: "#3498db",
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

export default ModaFooter;