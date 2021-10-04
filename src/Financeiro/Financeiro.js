import React, {useState, useEffect, useLayoutEffect, useCallback} from 'react';
import {View, Text, TouchableOpacity, RefreshControl, ScrollView, Modal, Image, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import {LineChart} from "react-native-chart-kit";
import NetInfo from '@react-native-community/netinfo';
import Header from '../Header/Header';
import Footer from '../Footer/footer';
import { Dimensions } from "react-native";
import NumberFormat from 'react-number-format';
import Genios from '../../Images/Genios.png';
import Api from '../Api/index';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const Financeiro = ({navigation, route}) => {

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

    const [msg, setMsg] = useState();
    const [refreshing, setRefreshing] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [token, setToken] = useState();
    const [balance, setBalance] = useState();
    const [line, setLine] = useState();
    const [existe, setExiste] = useState(false);// Verifica se o array ja esta preenchido
    const [day] = useState(["Dia"]);
    const [value, setValue] = useState([0]);
    const [data] = useState({ labels: day, datasets: [ { data: value } ]});
    
    const [month, setMonth] = useState();
    const [fullYear, setFullYear] = useState("");

    console.log("Mes: ", month);
    console.log("Ano: ", fullYear);

    const [label, setLabel] = useState("");
    const [visivel, setVisivel] = useState(true);
    const [color, setColor] = useState(false);
    const [color1, setColor1] = useState(false);

    useEffect(() => {
        const getToken = async () => {
            const tkn = await AsyncStorage.getItem('token');
            setToken(tkn);
        };
        getToken();
    }, [token, day, value, existe, month, fullYear, data]);

    useLayoutEffect(() => {

        const getApi = async () => {

            const tkn = await AsyncStorage.getItem('token');
            const mes = await AsyncStorage.getItem('mes');
            const ano = await AsyncStorage.getItem('ano');
            setMonth(mes);
            setFullYear(ano);

            const req = await fetch(Api.url+"/api/fechamento-mes/"+mes+"/"+ano, {
                method: 'GET',
                body: JSON.stringify(),
                headers: {
                    'Authorization': 'Token '+tkn,
                    'Content-Type' : 'application/json',
                }
            });
        
            const json = await req.json();
            setLine(json.length);

            if(existe === false){
                const array = await json.map((item) => {
                    
                    day.push(item.create__day);
                    value.push(item.preco__sum);
                    setFullYear(item.create__year);

                    setExiste(true) //Agora existe

                    if(item.create__month === 1){
                        setLabel("Janeiro");
                    }
                    if(item.create__month === 2){
                        setLabel("Fevereiro");
                    }
                    if(item.create__month === 3){
                        setLabel("Março");
                    }
                    if(item.create__month === 4){
                        setLabel("Abril");
                    }
                    if(item.create__month === 5){
                        setLabel("Maio");
                    }
                    if(item.create__month === 6){
                        setLabel("Junho");
                    }
                    if(item.create__month === 7){
                        setLabel("Julho");
                    }
                    if(item.create__month === 8){
                        setLabel("Agosto");
                    }
                    if(item.create__month === 9){
                        setLabel("Setembro");
                    }
                    if(item.create__month === 10){
                        setLabel("Outubro");
                    }
                    if(item.create__month === 11){
                        setLabel("Novembro");
                    }
                    if(item.create__month === 12){
                        setLabel("Dezembro");
                    }

                    return array;
                });
            }
            else{
                console.log("Array de Preços: ", value);
                console.log("Array de Dias: ", day);
            }
           
            const soma = await value.reduce((soma, numero) => { return soma + numero }, 0);//0 é usado para realiza a primeira soma no array
            setBalance(soma);    
        };
        
        getApi();

    }, []);

        // START REQUISIÇÃO PARA SELECIONAR O MES ATUAL

        const select = async () => {

            const tkn = await AsyncStorage.getItem('token');
            
            const req = await fetch(Api.url+"/api/fechamento-mes/"+month+"/"+fullYear, {//API ANO: http://192.168.15.13:8085/api/fechamento-ano/2021
                method: 'GET',
                body: JSON.stringify(),
                headers: {
                    'Authorization': 'Token '+tkn,
                    'Content-Type' : 'application/json',
                }
            });
         
            const json = await req.json();
            day.splice(0, 1, "Dia");// Apartir do primeiro elemento 0, removava um elemento 1, e coloque uma string no lugar
            
            setLine(json.length);

            if(existe === false){
                const array = await json.map((item) => {

                    day.push(item.create__day);
                    value.push(item.preco__sum);
                    setFullYear(item.create__year);

                    setExiste(true) //Agora existe

                    if(item.create__month === 1){
                        setLabel("Janeiro");
                    }
                    if(item.create__month === 2){
                        setLabel("Fevereiro");
                    }
                    if(item.create__month === 3){
                        setLabel("Março");
                    }
                    if(item.create__month === 4){
                        setLabel("Abril");
                    }
                    if(item.create__month === 5){
                        setLabel("Maio");
                    }
                    if(item.create__month === 6){
                        setLabel("Junho");
                    }
                    if(item.create__month === 7){
                        setLabel("Julho");
                    }
                    if(item.create__month === 8){
                        setLabel("Agosto");
                    }
                    if(item.create__month === 9){
                        setLabel("Setembro");
                    }
                    if(item.create__month === 10){
                        setLabel("Outubro");
                    }
                    if(item.create__month === 11){
                        setLabel("Novembro");
                    }
                    if(item.create__month === 12){
                        setLabel("Dezembro");
                    }
            
                    return array;
                });
            }
            else{
                console.log("Array de Preços: ", value);
                console.log("Array de Dias: ", day);
            }
     
            const soma = await value.reduce((soma, numero) => { return soma + numero }, 0);//0 é usado para realiza a primeira soma no array
            setBalance(soma);
            
        };
        // END REQUISIÇÃO PARA SELECIONAR O MES ATUAL



        // START REQUISIÇÃO PARA SELECIONAR O ANO ATUAL
         
        const selectedYear = async () => {

            const tkn = await AsyncStorage.getItem('token');

            const req = await fetch(Api.url+"/api/fechamento-ano/"+fullYear, {
                method: 'GET',
                body: JSON.stringify(),
                headers: {
                    'Authorization': 'Token '+tkn,
                    'Content-Type' : 'application/json',
                }
            });

            const json = await req.json();
            day.splice(0, 1, "Mês");

            if(existe === false){
                const array = await json.map((item) => {

                    if(item.create__month === 1){
                        item.create__month = "Janeiro";
                        day.push(item.create__month);
                    }

                    if(item.create__month === 2){
                        item.create__month = "Fevereiro";
                        day.push(item.create__month);
                    }

                    if(item.create__month === 3){
                        item.create__month = "Março";
                        day.push(item.create__month);
                    }

                    if(item.create__month === 4){
                        item.create__month = "Abril";
                        day.push(item.create__month);
                    }

                    if(item.create__month === 5){
                        item.create__month = "Maio";
                        day.push(item.create__month);
                    }

                    if(item.create__month === 6){
                        item.create__month = "Junho";
                        day.push(item.create__month);
                    }

                    if(item.create__month === 7){
                        item.create__month = "Julho";
                        day.push(item.create__month);
                    }

                    if(item.create__month === 8){
                        item.create__month = "Agosto";
                        day.push(item.create__month);
                    }

                    if(item.create__month === 9){
                        item.create__month = "Setembro";
                        day.push(item.create__month);
                    }

                    if(item.create__month === 10){
                        item.create__month = "Outubro";
                        day.push(item.create__month);
                    }

                    if(item.create__month === 11){
                        item.create__month = "Novembro";
                        day.push(item.create__month);
                    }

                    if(item.create__month === 12){
                        item.create__month = "Dezembro";
                        day.push(item.create__month);
                    }
                    
                    value.push(item.preco__sum);

                    //setMonth(item.create__month);
                    setFullYear(item.create__year);

                    setExiste(true) //Agora existe
                    return array;
                });
            }
            else{
                console.log("Array de Preços: ", value);
                console.log("Array de Dias: ", day);
            }

            const soma = await value.reduce((soma, numero) => { return soma + numero }, 0);//0 é usado para realiza a primeira soma no array
            setBalance(soma);
            
        };
        // END REQUISIÇÃO PARA SELECIONAR O ANO ATUAL 
        
        const clear = () => {
            day.splice(1, day.length);
            value.splice(1, value.length);
            setBalance(0);
            setExiste(false);
        };

        const connected = async (select) => {

            await NetInfo.fetch().then(state => {
    
                if(state.isConnected === true){
                    select();
                }
                else{
                    alert("Falha na Conexão, sem acesso a internet.");
                }
            });
        };

        const connected_one = async (selectedYear) => {

            await NetInfo.fetch().then(state => {
    
                if(state.isConnected === true){
                    selectedYear();
                }
                else{
                    alert("Falha na Conexão, sem acesso a internet.");
                }
            });
        };

    return(
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        style={{backgroundColor: "#2ecc71"}}
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                    />
                    }>

            <Header navigation={navigation} title="Meus Ganhos"></Header> 

            <LinearGradient
                style={styles.panel}
                colors={["#2ecc71", "#27ae60", "#27ae60", "#2ecc71"]}>
                <Text style={styles.label}>Saldo Atual {label} {fullYear}</Text>

                <NumberFormat
                    value={parseFloat(balance)}
                    displayType={'text'}
                    thousandSeparator={'.'}
                    decimalSeparator={','}
                    fixedDecimalScale={true}
                    decimalScale={2}
                    prefix={'R$ '}
                    renderText={item => 
                    <Text style={styles.value}>{item}</Text>}
                />
                
                <View style={styles.verMaisView}>
                    <TouchableOpacity 
                        style={color === false ? styles.verMaisButton3 : styles.verMaisButton2}
                        onPress={() => {
                            setModalVisible(!modalVisible);
                            setColor(false);
                            setColor1(false);
                            day.splice(0, 1, "Dia");
                            }}>
                        <Text style={styles.verMaisText}>Gráfico Mês</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={color1 === false ? styles.verMaisButton : styles.verMaisButton1}
                        onPress={() => {
                            setModalVisible1(!modalVisible1);
                            setColor1(true);
                            setColor(true);
                            day.splice(0, 1, "Mês");
                            }}>
                        <Text style={styles.verMaisText}>Gráfico Ano</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
            
            <View style={styles.containerChart}>
                <LineChart
                    data={data}
                    width={Dimensions.get("window").width} // from react-native
                    height={220}
                    yAxisLabel="R$"
                    yAxisSuffix=""
                    segments={2}
                    //onDataPointClick={valorMensal}
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                    backgroundColor: "#e26a00",//
                    backgroundGradientFrom: "#3498db",//#fb8c00
                    backgroundGradientTo: "#2980b9",//#ffa726
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,
                           
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#ffa726"
                    }
                    }}
                    bezier
                    style={{borderRadius: 0}}
                />
            </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        setModalVisible(!modalVisible);
                        setColor(false);
                        setColor1(false);
                        }}>
                    <Text style={styles.textStyle}>Busca por Data</Text>
                </TouchableOpacity>

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


                        <Text style={styles.modalText}>Selecione</Text>
                        <View style={styles.selectedView}>
                            <View style={styles.selected}>
                                <Picker
                                    selectedValue={month}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setMonth(itemValue);
                                        clear();  
                                    }}>
                                    <Picker.Item label="Janeiro" value="1" />
                                    <Picker.Item label="Fevereiro" value="2" />
                                    <Picker.Item label="Março" value="3" />
                                    <Picker.Item label="Abril" value="4" />
                                    <Picker.Item label="Maio" value="5" />
                                    <Picker.Item label="Junho" value="6" />
                                    <Picker.Item label="Julho" value="7" />
                                    <Picker.Item label="Agosto" value="8" />
                                    <Picker.Item label="Setembro" value="9" />
                                    <Picker.Item label="Outubro" value="10" />
                                    <Picker.Item label="Novembro" value="11" />
                                    <Picker.Item label="Dezembro" value="12" />    
                                </Picker>
                            </View>

                            <View style={styles.selected}>
                                <Picker
                                    selectedValue={fullYear}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setFullYear(itemValue);
                                        clear();  
                                    }}>
                                    <Picker.Item label="2020" value="2020" />
                                    <Picker.Item label="2021" value="2021" />
                                    <Picker.Item label="2022" value="2022" />
                                    <Picker.Item label="2023" value="2023" />
                                    <Picker.Item label="2024" value="2024" />
                                    <Picker.Item label="2025" value="2025" />  
                                </Picker>
                            </View>

                            <TouchableOpacity 
                                style={styles.selectedButton}
                                onPress={() => {
                                    connected(select);
                                    setModalVisible(!modalVisible);
                                }}>
                                <Text style={styles.selectedButtonText}>Buscar</Text>
                            </TouchableOpacity>

                            <View>
                                <Image source={Genios} style={{ marginTop: 20}}/>
                            </View>
                        </View>   
                    </View>
                </View>
                </Modal>   
            </View>






            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible1}
                    onRequestClose={() => {
                    setModalVisible1(!modalVisible1);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>


                        <Text style={styles.modalText}>Selecione o Ano</Text>
                        <View style={styles.selectedView}>
                            <View style={styles.selected}>
                                <Picker
                                    selectedValue={fullYear}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setFullYear(itemValue);
                                        setLabel("");
                                        setMonth("");
                                        setVisivel(false);
                                        clear();     
                                    }}>
                                    <Picker.Item label="2020" value="2020" />
                                    <Picker.Item label="2021" value="2021" />
                                    <Picker.Item label="2022" value="2022" />
                                    <Picker.Item label="2023" value="2023" />
                                    <Picker.Item label="2024" value="2024" />
                                    <Picker.Item label="2025" value="2025" />   
                                </Picker>
                            </View>

                            <View>
                                <Image source={Genios} style={{ marginTop: 5, marginBottom: 10, }}/>
                            </View>

                            <TouchableOpacity 
                                style={styles.selectedButton}
                                onPress={() => {
                                    connected_one(selectedYear);
                                    setModalVisible1(!modalVisible1);
                                }}>
                                <Text style={styles.selectedButtonText}>Buscar</Text>
                            </TouchableOpacity>
                        </View>   
                    </View>
                </View>
                </Modal>
                
            </View>

            </ScrollView>
            <Footer navigation={navigation} message={msg}></Footer>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',   
    },
    label: {
        textAlign: "center",
        fontSize: 16,
        color: "#fff",
    },
    panel: {
        width: "100%",
        minWidth: 200,
        marginTop: -40,
        paddingTop: 50,
        paddingBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#2980b9',
        elevation: 2,
    },
    value: {
        fontSize: 28,
        color: "#fff",
        textAlign: 'center',
    },
    containerChart:{
        //flex: 1,
    },

    selectedView:{
        alignItems: "center",
        flexDirection: "column",   
    },

    selected:{
        width: 200,
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        borderStyle: "solid",
        borderColor: "#000",
        backgroundColor: "#fff",
    },

    selectedButton:{
        width: 100,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        borderColor: "#000",
        borderStyle: "solid",
        borderWidth: 1,
        backgroundColor: "#fff",
    },

    selectedButtonText:{
        fontSize: 16,
        fontWeight: "bold",
    },
    
    verMaisView:{
        width: 300,
        height: 40,
        flexDirection: 'row',
        alignSelf: "center",
        justifyContent: "space-between",
        marginTop: 10,
        borderRadius: 8,
        backgroundColor: "#16a085",
        elevation: 5,
    },

    verMaisButton:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderTopRightRadius: 8,
        backgroundColor: "#16a085",
    },
    
    verMaisButton1:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        backgroundColor: "#1abc9c",
    },

    verMaisButton2:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        backgroundColor: "#16a085",
    },
    
    verMaisButton3:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        backgroundColor: "#1abc9c",
    },

    verMaisText: {
        fontSize: 16,
    },  
    
    verMais:{
        width: 100,
        height: 50,
        justifyContent: "center",
        alignItems: 'center',
        borderColor: "#000",
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: "solid",
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },

    modalView: {
        width: 300,
        height: 400,
        margin: 20,
        backgroundColor: "#3498db",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2
    },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

    textStyle: {
        fontSize: 16,
        color: "#000",
        textAlign: "center"
    },

    modalText: {
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center"
    },

    button: {
        width: 250,
        alignSelf: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        height: 50,
        marginTop: 10,
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginBottom: 30,
    },
});

export default Financeiro;