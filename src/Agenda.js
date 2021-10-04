import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, Modal, RefreshControl, FlatList, StatusBar, TouchableOpacity, ScrollView, TextInput, Platform, StyleSheet} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import NetInfo from '@react-native-community/netinfo';
import Footer from './Footer/footer';
import Header from './Header/Header';
import Api from './Api/index';
import moment from 'moment';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const Agenda = ({navigation}) => {

    const [msg, setMsg] = useState();
    const [refreshing, setRefreshing] = useState(false);


    const [token, setToken] = useState();
    const [color, setColor] = useState(false);
    const [spinner, setSpinner] = useState(false);
    
    const [modalVisible, setModalVisible] = useState(false);

    const [lista, setLista] = useState([]);

    const [busca, setBusca] = useState("");
    const [opcao, setOpcao] = useState("");
    const [opcao1, setOpcao1] = useState("Todos os Serviços");

    const [date1, setDate1] = useState(new Date());
    const [date2, setDate2] = useState(new Date());

    const [initialDate1, setInitialDate1] = useState(null);
    const [initialDate2, setInitialDate2] = useState(null);

    const [data1, setData1] = useState("");//date1.getFullYear() +"-"+ (date1.getMonth() + 1) +"-"+ date1.getDate()
    const [data2, setData2] = useState("");//date2.getFullYear() +"-"+ (date2.getMonth() + 1) +"-"+ date2.getDate()
    
    const [mode1, setMode1] = useState('date');
    const [show1, setShow1] = useState(false);
    const [mode2, setMode2] = useState('date');
    const [show2, setShow2] = useState(false);

    const [preload, setPreload] = useState(true);

    const onChange1 = (event1, selectedDate1) => {
        const currentDate1 = selectedDate1 || date1;
        setShow1(Platform.OS === 'ios');
        setInitialDate1(currentDate1.getDate() + "/" + (currentDate1.getMonth() + 1) + "/" + currentDate1.getFullYear()); //Data Apresentada na Tela
        setData1(currentDate1.getFullYear() +"-"+ (currentDate1.getMonth() + 1) +"-"+ currentDate1.getDate()) //data enviado para api
    };

    const showMode1 = (currentMode1) => {
        setShow1(true);
        setMode1(currentMode1);
    };

    const showDatepicker1 = () => {
        showMode1('date');
    };

    const onChange2 = (event2, selectedDate2) => {
        const currentDate2 = selectedDate2 || date2;
        setShow2(Platform.OS === 'ios');
        setInitialDate2(currentDate2.getDate()+ "/" + (currentDate2.getMonth() + 1) + "/" + currentDate2.getFullYear());//Data Apresentada na Tela
        setData2(currentDate2.getFullYear() +"-"+ (currentDate2.getMonth() + 1) +"-"+ currentDate2.getDate()) //data enviado para api
    };

    const showMode2 = (currentMode2) => {
        setShow2(true);
        setMode2(currentMode2);
    };

    const showDatepicker2 = () => {
        showMode2('date');
    };

    const closeModal = (item) => {
        setModalVisible(!modalVisible);

        if(item.option === "Abertos"){
            setOpcao("&status=Aberto");
            setOpcao1("Abertos");
        }
        else if(item.option === "Agendados"){
            setOpcao("&status=Agendado");
            setOpcao1("Agendados");
        }
        else if(item.option === "Aprovados"){
            setOpcao("&status=Aprovado");
            setOpcao1("Aprovados");
        }
        else if(item.option === "Instalados"){
            setOpcao("&status=Instalado");
            setOpcao1("Instalados");
        }
        else if(item.option === "Negados"){
            setOpcao("&status=Negado");
            setOpcao1("Negados");
        }
        else if(item.option === "Pendentes"){
            setOpcao("&status=Pendencia");
            setOpcao1("Pendentes");
        }
        else if(item.option === "Todos"){
            setOpcao("");
            setOpcao1("Todos");
        }    
    };

    const opcoes = [
        {option: "Abertos"},
        {option: "Agendados"},
        {option: "Aprovados"},
        {option: "Instalados"},
        {option: "Negados"},
        {option: "Pendentes"},
        {option: "Todos"},
    ];

    useEffect(() => {
        const getToken = async () => {
            const tkn = await AsyncStorage.getItem('token');
            setToken(tkn);
        };
        getToken();
    }, [token, color, opcao1, opcao, lista]);

    
    const apiGetBusca = async () => {    

        const req = await fetch(`${Api.url}/api/agenda/?search=${busca}&data__gte=${data1}&data__lte=${data2}${opcao}`, {
            method: 'GET',
            body: JSON.stringify(),
            headers: {
                'Authorization': 'Token '+token,
                'Content-Type' : 'application/json',
            }
        });
        
        const json = await req.json();

            setLista(json);
            setPreload(false);
            setTimeout(() => {
                setSpinner(false);
            }, 1000);
    };

    const finalizado = async () => {

        const url_api_finalizado = `${Api.url}/api/finalizado/?search=${busca}&data__gte=${data1}&data__lte=${data2}`
        console.log(url_api_finalizado);

        const req = await fetch(`${Api.url}/api/finalizado/?search=${busca}&data__gte=${data1}&data__lte=${data2}`, {
            method: 'GET',
            body: JSON.stringify(),
            headers: {
                'Authorization': 'Token '+token,
                'Content-Type' : 'application/json',
            }
        });

        const json = await req.json();

        console.log("Busca Retorna: ", json.length);

            setLista(json);
            setPreload(false);
            setOpcao1("Serviços Finalizados");
            setColor(true); 

            setTimeout(() => {
                setSpinner(false);
            }, 1000);
    };

    const andamento = async () => {

        const req = await fetch(`${Api.url}/api/agenda/?search=${busca}&data__gte=${data1}&data__lte=${data2}`, {// Api.url+"/api/agenda/?data__gte="+data1+"&data__lte="+data2
            method: 'GET',
            body: JSON.stringify(),
            headers: {
                'Authorization': 'Token '+token,
                'Content-Type' : 'application/json',
            }
        });

        const json = await req.json();
        setPreload(false);

        console.log("Busca Retorna: ", json.length);

            setLista(json);
            setOpcao1("Serviços em Andamento");
            setColor(false);

            setTimeout(() => {
                setSpinner(false);
            }, 1000);

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

                console.log("Mensagens: ", mensagem.length)

            wait(2000).then(() => setRefreshing(false));

    }, [refreshing, msg]);

    const connected = async (apiGetBusca) => {

        await NetInfo.fetch().then(state => {

            if(state.isConnected === true){
                apiGetBusca();
            }
            else{
                alert("Falha na Conexão, sem acesso a internet.");
                setSpinner(false);
            }
        });
    };

    const connected_one = async (andamento) => {

        await NetInfo.fetch().then(state => {

            if(state.isConnected === true){
                andamento();
            }
            else{
                alert("Falha na Conexão, sem acesso a internet.");
                setSpinner(false);
            }
        });
    };

    const connected_two = async (finalizado) => {

        await NetInfo.fetch().then(state => {

            if(state.isConnected === true){
                finalizado();
            }
            else{
                alert("Falha na Conexão, sem acesso a internet.");
                setSpinner(false);
            }
        });
    };

    return(
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                    />
                }>

            <Header navigation={navigation} title="Agenda"></Header>

                <Spinner
                    visible={spinner}
                    size="large"
                    cancelable={true}
                    textStyle={{color: "#fff"}}
                />

            <View>
                <View style={styles.buttonsContainer}>
                    <View>
                        <TouchableOpacity 
                            style={color === false ? styles.buttonsFalse : styles.buttons1}
                            onPress={() => {
                                connected_one(andamento);
                                setSpinner(true);
                            }}>                 
                            <Text style={color === false ? styles.txt2 : styles.txt}>Andamento</Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <TouchableOpacity 
                            style={color === true ? styles.buttonsTrue : styles.buttons2}
                            onPress={() => {
                                connected_two(finalizado);
                                setSpinner(true);
                            }}>
                            <Text style={color === true ? styles.txt2 : styles.txt}>Finalizado</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.dateContainer}>

                    <View>
                        <Text style={styles.dateButtonText1}>De</Text>
                            <TouchableOpacity 
                                style={styles.dateButton1}
                                onPress={showDatepicker1}>
                                <Text style={styles.buttonText}>{initialDate1}</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={styles.dateButtonText2}>Até</Text>
                            <TouchableOpacity 
                                style={styles.dateButton2}
                                onPress={showDatepicker2}>
                                <Text style={styles.buttonText}>{initialDate2}</Text>
                            </TouchableOpacity>
                        </View>

                        {show1 && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date1}
                                mode={mode1}
                                is24Hour={true}
                                display="calendar"
                                onChange={onChange1}
                            />
                        )} 
                        
                        <View>
                        {show2 && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date2}
                                mode={mode2}
                                is24Hour={true}
                                display="calendar"
                                onChange={onChange2}
                            />
                        )}
                    </View>
                </View>
        
                <View style={styles.containerInput}>
                    <TextInput 
                        style={styles.input}
                        placeholder="Pesquisar Placa"
                        onChangeText={(text) => setBusca(text.replace("-", ''))}
                        value={busca}>
                    </TextInput>
                </View> 

                    {opcao1 !== "Serviços Finalizados" ? 
                    <View style={styles.seletores}>
                        <View>
                            <TouchableOpacity 
                                style={styles.buttonSelect1}
                                onPress={() => setModalVisible(true)}>
                                <Text style={[styles.buttonText1, {color: "#000"}]}>Status</Text>
                            </TouchableOpacity>
                        </View> 

                        <View>
                            <TouchableOpacity 
                                style={styles.buttonSelect2}
                                onPress={() => {
                                    connected(apiGetBusca);
                                    setSpinner(true);
                                }}>
                                <Text style={[styles.buttonText1, {color: "#fff"}]}>Buscar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    <View>
                        <TouchableOpacity 
                            style={styles.buttonSelect3}
                            onPress={() => {
                                connected_two(finalizado);
                                setSpinner(true);
                            }}>
                            <Text style={[styles.buttonText1, {color: "#fff"}]}>Buscar</Text>
                        </TouchableOpacity>
                    </View>
                    }
            </View>
         
                <Text style={styles.tituloLista}>{opcao1}</Text>

                <View style={styles.listaContainer}>

                    {lista.length <= 0 && preload === true ?
                    <View style={{width: 300, height: 100, justifyContent: "center", alignSelf: "center"}}>
                        <Text style={{fontSize: 20, textAlign: "center", color: "#000"}}>Faça uma Busca!</Text>
                        <Text style={{fontSize: 20, textAlign: "center", color: "#000"}}>escolha entre as opções</Text>
                        <Text style={{fontSize: 20, textAlign: "center", color: "#000"}}>disponíveis</Text>
                    </View>

                    :

                    lista.length <= 0 && preload === false ?

                    <View style={{width: 300, height: 100, justifyContent: "center", alignSelf: "center"}}>
                        <Text style={{fontSize: 20, textAlign: "center", color: "#000"}}>Ops!</Text>
                        <Text style={{fontSize: 20, textAlign: "center", color: "#000"}}>Sem Registros nesse Período</Text>
                    </View>

                    :

                    <View>
                        <FlatList
                            data={lista}
                            extraData={lista}
                                keyExtractor={item => JSON.stringify(item.id)}
                                renderItem={({item}) => 

                                <View style={{flex: 1}}>
                                    <TouchableOpacity
                                        style={styles.buttonLista}>

                                            <View style={{flexDirection: "row", borderStyle: "solid", borderColor: "#000",  borderWidth: 1, backgroundColor: "#fff"}}>
                                                <TouchableOpacity style={styles.tableButton} onPress={() => navigation.navigate("Pedidos_"+item.status+"s", {entry: item})}>
                                                    <Text style={[styles.txt, {textAlign: "center", fontWeight: "bold", fontSize: 22, color: "#000"}]}>Serviço {item.os}</Text>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{flexDirection: "row", borderWidth: 1, borderStyle: "solid", borderColor: "#000", backgroundColor: "#fff"}}>
                                                <TouchableOpacity style={styles.tableButton} onPress={() => navigation.navigate("Pedidos_"+item.status+"s", {entry: item})}>
                                                    <Text style={{fontSize: 18, color: "#000", textAlign: "left"}}>Cliente</Text>    
                                                </TouchableOpacity>

                                                <TouchableOpacity style={[styles.tableButton, {borderLeftWidth: 1, borderLeftColor: "#000", borderStyle: "solid", alignItems: "flex-end"}]} 
                                                    onPress={() => navigation.navigate("Pedidos_"+item.status+"s", {entry: item})}>
                                                    <Text style={{fontSize: 18, color: "#000", textAlign: "right"}}>{item.cliente.nome}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            
                                            <View style={{flexDirection: "row", borderWidth: 1, borderStyle: "solid", borderColor: "#000", backgroundColor: "#fff"}}>
                                                <TouchableOpacity style={styles.tableButton} onPress={() => navigation.navigate("Pedidos_"+item.status+"s", {entry: item})}>
                                                    <Text style={{fontSize: 18, color: "#000", textAlign: "left"}}>Placa</Text>    
                                                </TouchableOpacity>

                                                <TouchableOpacity style={[styles.tableButton, {borderLeftWidth: 1, borderLeftColor: "#000", borderStyle: "solid", alignItems: "flex-end"}]} 
                                                    onPress={() => navigation.navigate("Pedidos_"+item.status+"s", {entry: item})}>
                                                    <Text style={{fontSize: 18, color: "#000", textAlign: "right"}}>{item.cliente.placa}</Text>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{flexDirection: "row", borderWidth: 1, borderStyle: "solid", borderColor: "#000", backgroundColor: "#fff"}}>
                                                <TouchableOpacity style={styles.tableButton} onPress={() => navigation.navigate("Pedidos_"+item.status+"s", {entry: item})}>
                                                    <Text style={{fontSize: 18, color: "#000", textAlign: "left"}}>Data</Text>    
                                                </TouchableOpacity>

                                                <TouchableOpacity style={[styles.tableButton, {borderLeftWidth: 1, borderLeftColor: "#000", borderStyle: "solid", alignItems: "flex-end"}]} 
                                                    onPress={() => navigation.navigate("Pedidos_"+item.status+"s", {entry: item})}>
                                                    <Text style={{fontSize: 18, color: "#000", textAlign: "right"}}>{moment(item.data).format("DD/MM/YYYY")}</Text>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{flexDirection: "row", borderWidth: 1, borderStyle: "solid", borderColor: "#000", borderBottomColor: "#000", marginBottom: 10, borderBottomWidth: 1, backgroundColor: "#fff"}}>
                                                <TouchableOpacity style={styles.tableButton} onPress={() => navigation.navigate("Pedidos_"+item.status+"s", {entry: item})}>
                                                    <Text style={{fontSize: 18, color: "#000", textAlign: "left"}}>Status</Text>    
                                                </TouchableOpacity>

                                                <TouchableOpacity style={[styles.tableButton, {borderLeftWidth: 1, borderLeftColor: "#000", borderStyle: "solid", alignItems: "flex-end"}]} 
                                                    onPress={() => navigation.navigate("Pedidos_"+item.status+"s", {entry: item})}>
                                                    <View style={
                                                        item.status === "Aberto" ?
                                                        [styles.statusView, {backgroundColor: "#e74c3c"}] :

                                                        item.status === "Agendado" ?
                                                        [styles.statusView, {backgroundColor: "#3498db"}] :

                                                        item.status === "Aprovado" ?
                                                        [styles.statusView, {backgroundColor: "#00CC65"}] :

                                                        item.status === "Instalado" ?
                                                        [styles.statusView, {backgroundColor: "#e67e22"}] :

                                                        item.status === "Negado" ?
                                                        [styles.statusView, {backgroundColor: "#800080"}] :

                                                        item.status === "Pendencia" ?
                                                        [styles.statusView, {backgroundColor: "#FFFF00"}] :

                                                        item.status === "Finalizado" ?
                                                        [styles.statusView, {backgroundColor: "#6c757d"}] :

                                                        statusViewElse}>
                                                        <Text style={{fontSize: 18, color: "#000"}}>{item.status}</Text>
                                                    </View>  
                                                </TouchableOpacity>
                                            </View>
                                    </TouchableOpacity>
                                </View>
                            }>
                        </FlatList>
                    </View>
                    }
                </View> 

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
                            <StatusBar barStyle="light-content" backgroundColor="#34495e"/>
                            <View style={styles.modalView}>
                                
                                <FlatList
                                    data={opcoes}
                                    keyExtractor={item => item.option}
                                    renderItem={({item}) => 
                                    
                                    <TouchableOpacity
                                        style={styles.selectModal}
                                        onPress={() => closeModal(item)}>
                                        <Text style={styles.selectText}>{item.option}</Text>
                                    </TouchableOpacity>
                                    }>    
                                </FlatList>

                            </View>
                        </View>

                        <View style={styles.containerFooter}>
                            <View style={styles.inner}>
                                <TouchableOpacity 
                                    style={styles.primaryButton} 
                                    onPress={() => setModalVisible(!modalVisible)}>
                                    <Text style={styles.primaryButtonText}>Fechar</Text>
                                </TouchableOpacity>
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
    container:{
        flex: 1,
        backgroundColor: "#fff",
    },

    title:{
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 20,
    },

    buttonsContainer: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignSelf: "center",
        elevation: 5,
    },

    buttons1: {
        width: 160,
        padding: 10,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#bdc3c7",
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
    },

    buttonsFalse:{
        width: 160,
        padding: 10,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#bdc3c7",
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        backgroundColor: "#2ecc71",
    },

    buttons2: {
        width: 160,
        padding: 10,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#bdc3c7",
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25, 
    },

    buttonsTrue:{
        width: 160,
        padding: 10,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#bdc3c7",
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        backgroundColor: "#3498db",
    },

    txt:{
        fontSize: 18,
        color: "#000",
        textAlign: "center",
    },

    txt2:{
        fontSize: 18,
        color: "#000",
        textAlign: "center",
    },

    dateContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },

    dateButtonText1:{
        fontWeight: "bold",
        marginLeft: 10,
        color: "#000",
        elevation: 5,
    },  

    dateButtonText2:{
        fontWeight: "bold",
        marginLeft: 40,
        color: "#000",
        elevation: 5,
    },  

    dateButton1:{
        width: 140,
        height: 40,
        padding: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#000",
        justifyContent: "center",
    },

    dateButton2:{
        width: 140,
        height: 40,
        marginLeft: 30,
        padding: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#000",
        justifyContent: "center",
    },

    buttonText:{
        fontSize: 16,
        textAlign: "center",
        color: "#000",
    },

    containerInput: {
        alignSelf: "center",
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "center",  
    },

    input:{
        width: 320,
        height: 50,
        padding: 10,
        fontSize: 18,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#bdc3c7",
        borderRadius: 25,
        backgroundColor: "#bdc3c7",
        elevation: 5,
    },

    seletores: {
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "center",
    },

    buttonSelect1:{
        width: 140,
        height: 40,
        marginTop: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#bdc3c7",
        justifyContent: "center",
        backgroundColor: "#2ecc71",
        elevation: 5,
    },

    buttonText1: {
        fontSize: 16,
        textAlign: "center",
    },

    buttonSelect2:{
        width: 140,
        height: 40,
        marginTop: 20,
        marginLeft: 30,
        borderRadius: 25,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#bdc3c7",
        justifyContent: "center",
        backgroundColor: "#3c6382",
        elevation: 5,
    },

    buttonSelect3:{
        width: 300,
        height: 40,
        marginTop: 20,
        alignSelf: "center",
        borderRadius: 25,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#bdc3c7",
        justifyContent: "center",
        backgroundColor: "#3498db",
        elevation: 5,
    },

    tituloLista:{
        textAlign: "center",
        marginTop: 10,
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },

    listaContainer:{
        flex: 1,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        paddingBottom: 100,
        borderTopWidth: 1,
        borderStyle: "solid",
        borderColor: "#000",
    },
    
    tableButton:{
        flex: 1,
        padding: 5,
    },

    statusView:{
        alignItems: 'center',
        paddingLeft: "15%",
        paddingRight: "15%",
        backgroundColor: "#e74c3c",
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    modalView: {
        width: "100%",
        height: "100%",
        backgroundColor: "#34495e",
        padding: 35,
        flexDirection: 'row',
        justifyContent: 'center',
        shadowColor: "#000",    
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

    selectModal:{
        width: "100%",
        height: 50,
        marginTop: 20,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: "#000",
        justifyContent: 'center',
        borderRadius: 10,   
    },

    selectText:{
        fontSize: 18,
        textAlign: 'center',
        color: "#fff",
    },

    containerFooter: {
        backgroundColor: "#34495e",
        paddingVertical: 10,
    },

    inner: {
        flexDirection: 'row',
        justifyContent: 'center', 
    },

    primaryButton: {
        borderWidth: 1,
        borderRadius: 150,
        borderColor: "#2ecc71",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
      
    primaryButtonText: {
        fontSize: 18,
        textAlign: 'center',
        color: "#2ecc71",
    },
});

export default Agenda;