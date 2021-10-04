import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, TouchableOpacity,  RefreshControl, ScrollView, Image, FlatList, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NumberFormat from 'react-number-format';
import Contato from '../../Images/fone.png';
import Header from '../Header/Header';
import Footer from '../Footer/footer';
import Api from '../Api/index';
import moment from 'moment';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const Pedidos_Finalizados = ({navigation, route}) => {

    const entry = route.params.entry;
    console.log(entry);

    const [msg, setMsg] = useState();
    const [refreshing, setRefreshing] = useState(false);

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

                console.log("Mensagens: ", mensagem.length)

            wait(2000).then(() => setRefreshing(false));

    }, [refreshing, msg]);

    return(
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                    />
                }>

        <Header navigation={navigation} title="Serviço Finalizado"></Header>

        <View style={{marginBottom: 100}}>
            <View style={{flex: 1}}>
                <View style={{flexDirection: "row", marginLeft: 20, marginRight: 20, borderStyle: "solid", borderColor: "#000",  borderWidth: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: "#fff"}}>
                    <TouchableOpacity style={styles.tableButton}>
                        <Text style={[styles.txt, {textAlign: "center", fontWeight: "bold", fontSize: 22, color: "#000"}]}>Serviço</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <FlatList 
                        data={[entry]}
                        keyExtractor={item => JSON.stringify(item.id)}
                        renderItem={({item}) => 
                                
                            <View>
                                <View style={{flexDirection: "row",  marginLeft: 20, marginRight: 20, borderWidth: 1, borderStyle: "solid", borderColor: "#000", backgroundColor: "#fff"}}>
                                    <TouchableOpacity style={styles.tableButton}>
                                        <Text style={styles.txt}>Ordem de Serviço</Text>    
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.tableButton, {borderLeftWidth: 1, borderLeftColor: "#000", borderStyle: "solid", alignItems: "flex-end"}]}>
                                        <Text style={styles.txt}>{item.os}</Text>
                                    </TouchableOpacity>
                                </View>
                                
                                <View style={{flexDirection: "row",  marginLeft: 20, marginRight: 20, borderWidth: 1, borderStyle: "solid", borderColor: "#000", backgroundColor: "#fff"}}>
                                    <TouchableOpacity style={styles.tableButton}>
                                        <Text style={styles.txt}>Data</Text>    
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.tableButton, {borderLeftWidth: 1, borderLeftColor: "#000", borderStyle: "solid", alignItems: "flex-end"}]}>
                                        <Text style={styles.txt}>{moment(item.data).format("DD/MM/YYYY")}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{flexDirection: "row",  marginLeft: 20, marginRight: 20, borderWidth: 1, borderStyle: "solid", borderColor: "#000", backgroundColor: "#fff"}}>
                                    <TouchableOpacity style={styles.tableButton}>
                                        <Text style={styles.txt}>Período</Text>    
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.tableButton, {borderLeftWidth: 1, borderLeftColor: "#000", borderStyle: "solid", alignItems: "flex-end"}]}>
                                        <Text style={styles.txt}>{item.periodo}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{flexDirection: "row",  marginLeft: 20, marginRight: 20, borderWidth: 1, borderStyle: "solid", borderColor: "#000", backgroundColor: "#fff"}}>
                                    <TouchableOpacity style={styles.tableButton}>
                                        <Text style={styles.txt}>Preço</Text>    
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.tableButton, {borderLeftWidth: 1, borderLeftColor: "#000", borderStyle: "solid", alignItems: "flex-end"}]}>
                                        <NumberFormat
                                            value={parseFloat(item.preco)}
                                            displayType={'text'}
                                            thousandSeparator={'.'}
                                            decimalSeparator={','}
                                            fixedDecimalScale={true}
                                            decimalScale={2}
                                            prefix={'R$ '}
                                            renderText={value => 
                                            <Text style={styles.txt}>{value}</Text>}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={{flexDirection: "row",  marginLeft: 20, marginRight: 20, borderWidth: 1, borderStyle: "solid", borderColor: "#000", backgroundColor: "#fff"}}>
                                    <TouchableOpacity style={styles.tableButton}>
                                        <Text style={styles.txt}>Status</Text>    
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.tableButton, {borderLeftWidth: 1, borderLeftColor: "#000", borderStyle: "solid", alignItems: "flex-end"}]}>
                                        <View style={styles.statusViewPendente}>
                                            <Text style={styles.statusText}> {item.status}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <View style={{flexDirection: "row",  marginLeft: 20, marginRight: 20, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderStyle: "solid", borderColor: "#000", backgroundColor: "#fff", borderBottomLeftRadius: 8, borderBottomRightRadius: 8}}>
                                    <View style={styles.tableButton}>
                                        <Text style={styles.txt}>Observação</Text>
                                        <Text style={{fontSize: 16, color: "#000", textAlign: "justify"}}>{item.observacao_admin}</Text>    
                                    </View>
                                </View>
                            </View>
                        }>
                    </FlatList>
                </View>
            </View>


            {/*START CLIENTE ------ START CLIENTE  -------  START CLIENTE*/}


            <View style={{flex: 1, marginTop: 30}}>
                <View style={{flexDirection: "row", marginLeft: 20, marginRight: 20, borderStyle: "solid", borderColor: "#000",  borderWidth: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: "#fff"}}>
                    <TouchableOpacity style={styles.tableButton}>
                        <Text style={[styles.txt, {textAlign: "center", fontWeight: "bold", fontSize: 22, color: "#000"}]}>Cliente</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <FlatList 
                        data={[entry]}
                        keyExtractor={item => JSON.stringify(item.id)}
                        renderItem={({item}) => 
                                
                            <View>
                                <View style={{flexDirection: "row",  marginLeft: 20, marginRight: 20, borderWidth: 1, borderStyle: "solid", borderColor: "#000", backgroundColor: "#fff"}}>
                                    <TouchableOpacity style={styles.tableButton}>
                                        <Text style={styles.txt}>Nome</Text>    
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.tableButton, {borderLeftWidth: 1, borderLeftColor: "#000", borderStyle: "solid", alignItems: "flex-end"}]}>
                                        <Text style={styles.txt}>{item.cliente.nome}</Text>
                                    </TouchableOpacity>
                                </View>
                                
                                <View style={{flexDirection: "row",  marginLeft: 20, marginRight: 20, borderWidth: 1, borderStyle: "solid", borderColor: "#000", backgroundColor: "#fff"}}>
                                    <TouchableOpacity style={styles.tableButton}>
                                        <Text style={styles.txt}>Cpf/Cnpj</Text>    
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.tableButton, {borderLeftWidth: 1, borderLeftColor: "#000", borderStyle: "solid", alignItems: "flex-end"}]}>
                                        <Text style={styles.txt}>{item.cliente.cpf_cnpj}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{flexDirection: "row",  marginLeft: 20, marginRight: 20, borderWidth: 1, borderStyle: "solid", borderColor: "#000", backgroundColor: "#fff"}}>
                                    <TouchableOpacity style={styles.tableButton}>
                                        <Text style={styles.txt}>Placa</Text>    
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.tableButton, {borderLeftWidth: 1, borderLeftColor: "#000", borderStyle: "solid", alignItems: "flex-end"}]}>
                                        <Text style={styles.txt}>{item.cliente.placa}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{flexDirection: "row",  marginLeft: 20, marginRight: 20, borderWidth: 1, borderStyle: "solid", borderColor: "#000", backgroundColor: "#fff"}}>
                                    <TouchableOpacity style={styles.tableButton}>
                                        <Text style={styles.txt}>Modelo</Text>    
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.tableButton, {borderLeftWidth: 1, borderLeftColor: "#000", borderStyle: "solid", alignItems: "flex-end"}]}>
                                        <Text style={styles.txt}>{item.cliente.car_modelo}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{flexDirection: "row",  marginLeft: 20, marginRight: 20, borderLeftWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, borderStyle: "solid", borderColor: "#000", backgroundColor: "#fff", borderBottomLeftRadius: 8, borderBottomRightRadius: 8}}>
                                    <TouchableOpacity style={styles.tableButton}>
                                        <Text style={styles.txt}>ANO</Text>    
                                    </TouchableOpacity>
                                
                                <TouchableOpacity style={[styles.tableButton, {borderLeftWidth: 1, borderLeftColor: "#000", borderStyle: "solid", alignItems: "flex-end"}]}>
                                    <Text style={styles.txt}>{item.cliente.car_ano}</Text>
                                </TouchableOpacity>
                                </View>
                            </View>
                        }>
                    </FlatList>
                </View>
            </View>


            {/*END CLIENTE --- END CLIENTE */}


            <View style={{flex: 1, marginTop: 30}}>
                <View style={{flexDirection: "row", marginLeft: 20, marginRight: 20, borderStyle: "solid", borderColor: "#000",  borderWidth: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: "#fff"}}>
                    <TouchableOpacity style={styles.tableButton}>
                        <Text style={{textAlign: "center", fontWeight: "bold", fontSize: 22, color: "#000"}}>Produto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tableButton, {borderLeftWidth: 1, borderLeftColor: "#000", borderStyle: "solid"}]}>
                        <Text style={{textAlign: "center", fontWeight: "bold", fontSize: 22, color: "#000"}}>Preço</Text>
                    </TouchableOpacity>
                </View>

                <View >
                    <FlatList 
                        data={entry.produto}
                        keyExtractor={item => JSON.stringify(item.id)}
                        renderItem={({item}) => 
                                                
                            <View style={{flexDirection: "row",  marginLeft: 20, marginRight: 20, borderWidth: 1, borderStyle: "solid", borderColor: "#000", backgroundColor: "#fff"}}>
                                <TouchableOpacity style={styles.tableButton}>
                                    <Text style={styles.txt}>{item.produto}</Text>    
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.tableButton, {borderLeftWidth: 1, borderLeftColor: "#000", borderStyle: "solid", alignItems: "flex-end"}]}>
                                    <NumberFormat
                                        value={parseFloat(item.preco)}
                                        displayType={'text'}
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        fixedDecimalScale={true}
                                        decimalScale={2}
                                        prefix={'R$ '}
                                        renderText={value => 
                                        <Text style={styles.txt}>{value}</Text>}
                                    />
                                </TouchableOpacity>
                            </View>      
                        }>
                    </FlatList>
                </View>

                <View style={{alignSelf: 'center', flexDirection: "row", borderStyle: "solid", borderColor: "#000", borderWidth: 1, marginLeft: 20, marginRight: 20, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, backgroundColor: "#fff"}}>
                    <TouchableOpacity style={styles.tableButton}>
                        <Text style={styles.txt}>Total</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tableButton, {borderLeftWidth: 1, borderLeftColor: "#000", borderStyle: "solid", alignItems: "flex-end"}]}>
                        <NumberFormat
                            value={parseFloat(entry.preco)}
                            displayType={'text'}
                            thousandSeparator={'.'}
                            decimalSeparator={','}
                            fixedDecimalScale={true}
                            decimalScale={2}
                            prefix={'R$ '}
                            renderText={value => 
                            <Text style={styles.txt}>{value}</Text>}
                        />
                    </TouchableOpacity>
                </View>
            </View> 

            <View style={{flexDirection: "row", justifyContent: "center"}}>
                <TouchableOpacity 
                    style={styles.button1} 
                    onPress={() => navigation.navigate("Contato", {entry: entry, tela: "Pedidos_Finalizados"})}>
                    <Image source={Contato} />                    
                </TouchableOpacity>
            </View>

        </View> 
        </ScrollView> 
        <Footer navigation={navigation} message={msg}></Footer>
    </View>
    )
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#fff",
},

txt:{
    fontSize: 18,
    color: "#000",
},

tableButton:{
    flex: 1,
    padding: 5,
},

status:{
    flexDirection: "row",
},

statusViewPendente:{
    paddingLeft: "15%",
    paddingRight: "15%",
    borderRadius: 8,
    marginLeft: 5,
    backgroundColor: "#6c757d",
},

button1: {
    width: 90,
    height: 70,
    elevation: 5,
    padding: 10,
    marginLeft: 20,
	justifyContent: "center",
	alignItems: "center",
    borderRadius: 10,
    alignSelf: "center",
    textAlign: "center",
    marginTop: 20,
    backgroundColor: "#7f8c8d",
}, 

statusText:{
    fontSize: 18,
    fontWeight: "bold",
    color: "#ecf0f1",
    textAlign: 'center',
},
});

export default Pedidos_Finalizados;