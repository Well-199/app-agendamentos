import React, { useState, useEffect, useCallback } from 'react';
import {View, Text, Modal, FlatList, RefreshControl, TouchableOpacity, Linking, TextInput, ScrollView, Image, SafeAreaView, Alert, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NumberFormat from 'react-number-format';
import NetInfo from '@react-native-community/netinfo';
import Contato from '../../Images/fone.png';
import WhatsApp from '../../Images/whatsapp.png';
import Footer from '../Footer/footer';
import Header from '../Header/Header';
import Api from '../Api/index';
import moment from 'moment';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const Pedidos_Abertos = ({navigation, route}) => {

    const entry = route.params.entry;
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [message, setMessage] = useState();
    const [phone] = useState(5511971668818);
    const [msg, setMsg] = useState();

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

    const termo_ok = async (termoAceito) => {

        const reqPut = await fetch(Api.url+"/api/aberto-termo/"+entry.id,{
            method: 'PUT',
            body: JSON.stringify(),
            headers:{
                Accept: 'application/json',
                'Content-Type' : 'application/json',
            }
        });
            try{
                const json = await reqPut.json();
                return json;
            }
            catch(e){
                console.log("ERRO: ", e);
            }  
        termoAceito();     
    };

    const termoAceito = async () => {
        const reqGet = await fetch(Api.url+"/api/aberto-termo/"+entry.id,{
            method: 'GET',
            body: JSON.stringify(),
            headers:{
                Accept: 'application/json',
                'Content-Type' : 'application/json',
            }
        });
            const res = await reqGet.json();
            Alert.alert(
                "Obrigado Parceiro!",
                "Termo aceito com sucesso.",
                [{ text: "OK", onPress: () => {
                    navigation.navigate("Pedidos_Agendados", {entry: res});
                }}],
            );
    };

    const chat = () => {
        Alert.alert(
            "Mensagem Enviada Com Sucesso!",
            "Aguarde que entraremos em contato",
            [{ text: "OK", onPress: () => {
                setModalVisible1(!modalVisible1);
                setMessage("");
            }}],
        );
    };

    const handleSend = async (chat) => {

        const tkn = await AsyncStorage.getItem('token');

        const req = await fetch(Api.url+"/api/createmessage/", {
            method: 'POST',
            body: JSON.stringify({
                message: message,
                os: entry.os,
            }),
            headers: {
                'Authorization': 'Token '+tkn,
                'Content-Type' : 'application/json'
            }
        });

        chat();
        setMessage("");
        
        const json = await req.json();
        console.log("Resposta: ", json);
        console.log("OS: ", entry.os);
        console.log("Mensagem: ", message);
        
    };

    const whats = () => {
        Linking.openURL(`http://api.whatsapp.com/send?phone=${phone}`);
    };

    const connected = async (termo_ok) => {

        await NetInfo.fetch().then(state => {

            if(state.isConnected === true){
                termo_ok(termoAceito);
            }
            else{
                alert("Falha na Conex??o, sem acesso a internet.");
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
                        
            <Header navigation={navigation} title="Servi??o Aberto"></Header>
   
            <View>
                <View style={{flex: 1}}>
                    <View style={{flexDirection: "row", marginLeft: 20, marginRight: 20, borderStyle: "solid", borderColor: "#000",  borderWidth: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: "#fff"}}>
                        <TouchableOpacity style={styles.tableButton}>
                            <Text style={[styles.txt, {textAlign: "center", fontWeight: "bold", fontSize: 22, color: "#000"}]}>Servi??o</Text>
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
                                            <Text style={styles.txt}>Ordem de Servi??o</Text>    
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
                                            <Text style={styles.txt}>Per??odo</Text>    
                                        </TouchableOpacity>

                                        <TouchableOpacity style={[styles.tableButton, {borderLeftWidth: 1, borderLeftColor: "#000", borderStyle: "solid", alignItems: "flex-end"}]}>
                                            <Text style={styles.txt}>{item.periodo}</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{flexDirection: "row",  marginLeft: 20, marginRight: 20, borderWidth: 1, borderStyle: "solid", borderColor: "#000", backgroundColor: "#fff"}}>
                                        <TouchableOpacity style={styles.tableButton}>
                                            <Text style={styles.txt}>Pre??o</Text>    
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
                                            <Text style={styles.txt}>Observa????o</Text>
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
                            <Text style={{textAlign: "center", fontWeight: "bold", fontSize: 22, color: "#000"}}>Pre??o</Text>
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

                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <TouchableOpacity 
                            style={styles.button1} 
                            onPress={() => navigation.navigate("Contato", {entry: entry, tela: "Pedidos_Abertos"})}>
                            <Image source={Contato}/>   
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.button2} 
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}>
                            <Text style={styles.button1Text}>Ler e Aceitar Servi??o</Text>
                        </TouchableOpacity>
                    </View>
                </View>
        
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(!modalVisible)}>

                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Termo de Privacidade</Text>

                            <ScrollView>
                                <Text style={styles.termo}>
                                    Lorem Ipsum ?? simplesmente um texto fict??cio da ind??stria de impress??o e composi????o. Lorem Ipsum tem sido o texto fict??cio padr??o da ind??stria desde 1500, quando um impressor desconhecido pegou um modelo de impress??o e embaralhou-o para fazer um livro de amostra de tipos. Ele sobreviveu n??o apenas cinco s??culos, mas tamb??m ao salto para a composi????o eletr??nica, permanecendo essencialmente inalterado. Ele foi popularizado na d??cada de 1960 com o lan??amento de folhas de Letraset contendo passagens de Lorem Ipsum e, mais recentemente, com software de editora????o eletr??nica como Aldus PageMaker incluindo vers??es de Lorem Ipsum. Ao contr??rio da cren??a popular, Lorem Ipsum n??o ?? simplesmente um texto aleat??rio. Tem ra??zes em uma pe??a da literatura cl??ssica latina de 45 aC, com mais de 2.000 anos. Richard McClintock, um professor de latim no Hampden-Sydney College, na Virg??nia, pesquisou uma das palavras latinas mais obscuras, consectetur, de uma passagem de Lorem Ipsum e, examinando as cita????es da palavra na literatura cl??ssica, descobriu a fonte indubit??vel. Lorem Ipsum vem das se????es 1.10.32 e 1.10.33 de "de Finibus Bonorum et Malorum" (Os Extremos do Bem e do Mal) de C??cero, escrito em 45 aC. Este livro ?? um tratado sobre a teoria da ??tica, muito popular durante o Renascimento. A primeira linha de Lorem Ipsum, "Lorem ipsum dolor sit amet ..", vem de uma linha na se????o 1.10.32.
                                    O peda??o padr??o de Lorem Ipsum usado desde 1500 ?? reproduzido abaixo para os interessados. As se????es 1.10.32 e 1.10.33 de "de Finibus Bonorum et Malorum" por C??cero tamb??m s??o reproduzidas em sua forma original exata, acompanhadas por vers??es em ingl??s da tradu????o de 1914 por H. Rackham. Ao contr??rio da cren??a popular, Lorem Ipsum n??o ?? simplesmente um texto aleat??rio. Tem ra??zes em uma pe??a da literatura cl??ssica latina de 45 aC, com mais de 2.000 anos. Richard McClintock, um professor de latim no Hampden-Sydney College, na Virg??nia, pesquisou uma das palavras latinas mais obscuras, consectetur, de uma passagem de Lorem Ipsum e, examinando as cita????es da palavra na literatura cl??ssica, descobriu a fonte indubit??vel. Lorem Ipsum vem das se????es 1.10.32 e 1.10.33 de "de Finibus Bonorum et Malorum" (Os Extremos do Bem e do Mal) de C??cero, escrito em 45 aC. Este livro ?? um tratado sobre a teoria da ??tica, muito popular durante o Renascimento. A primeira linha de Lorem Ipsum, "Lorem ipsum dolor sit amet ..", vem de uma linha na se????o 1.10.32. Onde posso arranjar algum?
                                    Existem muitas varia????es de passagens de Lorem Ipsum dispon??veis, mas a maioria sofreu altera????o de alguma forma, por humor injetado ou palavras aleat??rias que n??o parecem nem um pouco cr??veis. Se for usar uma passagem de Lorem Ipsum, voc?? precisa ter certeza de que n??o h?? nada embara??oso escondido no meio do texto. Todos os geradores Lorem Ipsum na Internet tendem a repetir blocos predefinidos conforme necess??rio, tornando este o primeiro gerador verdadeiro na Internet. Ele usa um dicion??rio de mais de 200 palavras latinas, combinado com um punhado de estruturas de frases modelo, para gerar Lorem Ipsum que parece razo??vel. O Lorem Ipsum gerado est??, portanto, sempre livre de repeti????o, humor injetado ou palavras n??o caracter??sticas, etc. Onde posso arranjar algum?
                                    Existem muitas varia????es de passagens de Lorem Ipsum dispon??veis, mas a maioria sofreu altera????o de alguma forma, por humor injetado ou palavras aleat??rias que n??o parecem nem um pouco cr??veis. Se for usar uma passagem de Lorem Ipsum, voc?? precisa ter certeza de que n??o h?? nada embara??oso escondido no meio do texto. Todos os geradores Lorem Ipsum na Internet tendem a repetir blocos predefinidos conforme necess??rio, tornando este o primeiro gerador verdadeiro na Internet. Ele usa um dicion??rio de mais de 200 palavras latinas, combinado com um punhado de estruturas de frases modelo, para gerar Lorem Ipsum que parece razo??vel. O Lorem Ipsum gerado est??, portanto, sempre livre de repeti????o, humor injetado ou palavras n??o caracter??sticas, etc. Onde posso arranjar algum?
                                    Existem muitas varia????es de passagens de Lorem Ipsum dispon??veis, mas a maioria sofreu altera????o de alguma forma, por humor injetado ou palavras aleat??rias que n??o parecem nem um pouco cr??veis. Se for usar uma passagem de Lorem Ipsum, voc?? precisa ter certeza de que n??o h?? nada embara??oso escondido no meio do texto. Todos os geradores Lorem Ipsum na Internet tendem a repetir blocos predefinidos conforme necess??rio, tornando este o primeiro gerador verdadeiro na Internet. Ele usa um dicion??rio de mais de 200 palavras latinas, combinado com um punhado de estruturas de frases modelo, para gerar Lorem Ipsum que parece razo??vel. O Lorem Ipsum gerado est??, portanto, sempre livre de repeti????o, humor injetado ou palavras n??o caracter??sticas, etc. Onde posso arranjar algum?
                                    Existem muitas varia????es de passagens de Lorem Ipsum dispon??veis, mas a maioria sofreu altera????o de alguma forma, por humor injetado ou palavras aleat??rias que n??o parecem nem um pouco cr??veis. Se for usar uma passagem de Lorem Ipsum, voc?? precisa ter certeza de que n??o h?? nada embara??oso escondido no meio do texto. Todos os geradores Lorem Ipsum na Internet tendem a repetir blocos predefinidos conforme necess??rio, tornando este o primeiro gerador verdadeiro na Internet. Ele usa um dicion??rio de mais de 200 palavras latinas, combinado com um punhado de estruturas de frases modelo, para gerar Lorem Ipsum que parece razo??vel. O Lorem Ipsum gerado est??, portanto, sempre livre de repeti????o, humor injetado ou palavras n??o caracter??sticas, etc. Onde posso arranjar algum?
                                    Existem muitas varia????es de passagens de Lorem Ipsum dispon??veis, mas a maioria sofreu altera????o de alguma forma, por humor injetado ou palavras aleat??rias que n??o parecem nem um pouco cr??veis. Se for usar uma passagem de Lorem Ipsum, voc?? precisa ter certeza de que n??o h?? nada embara??oso escondido no meio do texto. Todos os geradores Lorem Ipsum na Internet tendem a repetir blocos predefinidos conforme necess??rio, tornando este o primeiro gerador verdadeiro na Internet. Ele usa um dicion??rio de mais de 200 palavras latinas, combinado com um punhado de estruturas de frases modelo, para gerar Lorem Ipsum que parece razo??vel. O Lorem Ipsum gerado est??, portanto, sempre livre de repeti????o, humor injetado ou palavras n??o caracter??sticas, etc. Onde posso arranjar algum?
                                    Existem muitas varia????es de passagens de Lorem Ipsum dispon??veis, mas a maioria sofreu altera????o de alguma forma, por humor injetado ou palavras aleat??rias que n??o parecem nem um pouco cr??veis. Se for usar uma passagem de Lorem Ipsum, voc?? precisa ter certeza de que n??o h?? nada embara??oso escondido no meio do texto. Todos os geradores Lorem Ipsum na Internet tendem a repetir blocos predefinidos conforme necess??rio, tornando este o primeiro gerador verdadeiro na Internet. Ele usa um dicion??rio de mais de 200 palavras latinas, combinado com um punhado de estruturas de frases modelo, para gerar Lorem Ipsum que parece razo??vel. O Lorem Ipsum gerado est??, portanto, sempre livre de repeti????o, humor injetado ou palavras n??o caracter??sticas, etc. Onde posso arranjar algum?
                                    Existem muitas varia????es de passagens de Lorem Ipsum dispon??veis, mas a maioria sofreu altera????o de alguma forma, por humor injetado ou palavras aleat??rias que n??o parecem nem um pouco cr??veis. Se for usar uma passagem de Lorem Ipsum, voc?? precisa ter certeza de que n??o h?? nada embara??oso escondido no meio do texto. Todos os geradores Lorem Ipsum na Internet tendem a repetir blocos predefinidos conforme necess??rio, tornando este o primeiro gerador verdadeiro na Internet. Ele usa um dicion??rio de mais de 200 palavras latinas, combinado com um punhado de estruturas de frases modelo, para gerar Lorem Ipsum que parece razo??vel. O Lorem Ipsum gerado est??, portanto, sempre livre de repeti????o, humor injetado ou palavras n??o caracter??sticas, etc. Onde posso arranjar algum?
                                    Existem muitas varia????es de passagens de Lorem Ipsum dispon??veis, mas a maioria sofreu altera????o de alguma forma, por humor injetado ou palavras aleat??rias que n??o parecem nem um pouco cr??veis. Se for usar uma passagem de Lorem Ipsum, voc?? precisa ter certeza de que n??o h?? nada embara??oso escondido no meio do texto. Todos os geradores Lorem Ipsum na Internet tendem a repetir blocos predefinidos conforme necess??rio, tornando este o primeiro gerador verdadeiro na Internet. Ele usa um dicion??rio de mais de 200 palavras latinas, combinado com um punhado de estruturas de frases modelo, para gerar Lorem Ipsum que parece razo??vel. O Lorem Ipsum gerado est??, portanto, sempre livre de repeti????o, humor injetado ou palavras n??o caracter??sticas, etc. Onde posso arranjar algum?
                                    Existem muitas varia????es de passagens de Lorem Ipsum dispon??veis, mas a maioria sofreu altera????o de alguma forma, por humor injetado ou palavras aleat??rias que n??o parecem nem um pouco cr??veis. Se for usar uma passagem de Lorem Ipsum, voc?? precisa ter certeza de que n??o h?? nada embara??oso escondido no meio do texto. Todos os geradores Lorem Ipsum na Internet tendem a repetir blocos predefinidos conforme necess??rio, tornando este o primeiro gerador verdadeiro na Internet. Ele usa um dicion??rio de mais de 200 palavras latinas, combinado com um punhado de estruturas de frases modelo, para gerar Lorem Ipsum que parece razo??vel. O Lorem Ipsum gerado est??, portanto, sempre livre de repeti????o, humor injetado ou palavras n??o caracter??sticas, etc. Onde posso arranjar algum?
                                    Existem muitas varia????es de passagens de Lorem Ipsum dispon??veis, mas a maioria sofreu altera????o de alguma forma, por humor injetado ou palavras aleat??rias que n??o parecem nem um pouco cr??veis. Se for usar uma passagem de Lorem Ipsum, voc?? precisa ter certeza de que n??o h?? nada embara??oso escondido no meio do texto. Todos os geradores Lorem Ipsum na Internet tendem a repetir blocos predefinidos conforme necess??rio, tornando este o primeiro gerador verdadeiro na Internet. Ele usa um dicion??rio de mais de 200 palavras latinas, combinado com um punhado de estruturas de frases modelo, para gerar Lorem Ipsum que parece razo??vel. O Lorem Ipsum gerado est??, portanto, sempre livre de repeti????o, humor injetado ou palavras n??o caracter??sticas, etc. Onde posso arranjar algum?
                                    Existem muitas varia????es de passagens de Lorem Ipsum dispon??veis, mas a maioria sofreu altera????o de alguma forma, por humor injetado ou palavras aleat??rias que n??o parecem nem um pouco cr??veis. Se for usar uma passagem de Lorem Ipsum, voc?? precisa ter certeza de que n??o h?? nada embara??oso escondido no meio do texto. Todos os geradores Lorem Ipsum na Internet tendem a repetir blocos predefinidos conforme necess??rio, tornando este o primeiro gerador verdadeiro na Internet. Ele usa um dicion??rio de mais de 200 palavras latinas, combinado com um punhado de estruturas de frases modelo, para gerar Lorem Ipsum que parece razo??vel. O Lorem Ipsum gerado est??, portanto, sempre livre de repeti????o, humor injetado ou palavras n??o caracter??sticas, etc. Onde posso arranjar algum?
                                    Existem muitas varia????es de passagens de Lorem Ipsum dispon??veis, mas a maioria sofreu altera????o de alguma forma, por humor injetado ou palavras aleat??rias que n??o parecem nem um pouco cr??veis. Se for usar uma passagem de Lorem Ipsum, voc?? precisa ter certeza de que n??o h?? nada embara??oso escondido no meio do texto. Todos os geradores Lorem Ipsum na Internet tendem a repetir blocos predefinidos conforme necess??rio, tornando este o primeiro gerador verdadeiro na Internet. Ele usa um dicion??rio de mais de 200 palavras latinas, combinado com um punhado de estruturas de frases modelo, para gerar Lorem Ipsum que parece razo??vel. O Lorem Ipsum gerado est??, portanto, sempre livre de repeti????o, humor injetado ou palavras n??o caracter??sticas, etc. Onde posso arranjar algum?
                                    Existem muitas varia????es de passagens de Lorem Ipsum dispon??veis, mas a maioria sofreu altera????o de alguma forma, por humor injetado ou palavras aleat??rias que n??o parecem nem um pouco cr??veis. Se for usar uma passagem de Lorem Ipsum, voc?? precisa ter certeza de que n??o h?? nada embara??oso escondido no meio do texto. Todos os geradores Lorem Ipsum na Internet tendem a repetir blocos predefinidos conforme necess??rio, tornando este o primeiro gerador verdadeiro na Internet. Ele usa um dicion??rio de mais de 200 palavras latinas, combinado com um punhado de estruturas de frases modelo, para gerar Lorem Ipsum que parece razo??vel. O Lorem Ipsum gerado est??, portanto, sempre livre de repeti????o, humor injetado ou palavras n??o caracter??sticas, etc. Onde posso arranjar algum?
                                    Existem muitas varia????es de passagens de Lorem Ipsum dispon??veis, mas a maioria sofreu altera????o de alguma forma, por humor injetado ou palavras aleat??rias que n??o parecem nem um pouco cr??veis. Se for usar uma passagem de Lorem Ipsum, voc?? precisa ter certeza de que n??o h?? nada embara??oso escondido no meio do texto. Todos os geradores Lorem Ipsum na Internet tendem a repetir blocos predefinidos conforme necess??rio, tornando este o primeiro gerador verdadeiro na Internet. Ele usa um dicion??rio de mais de 200 palavras latinas, combinado com um punhado de estruturas de frases modelo, para gerar Lorem Ipsum que parece razo??vel. O Lorem Ipsum gerado est??, portanto, sempre livre de repeti????o, humor injetado ou palavras n??o caracter??sticas, etc.
                                    ?? um fato estabelecido h?? muito tempo que um leitor se distrair?? com o conte??do leg??vel de uma p??gina ao examinar seu layout. O objetivo de usar Lorem Ipsum ?? que ele tem uma distribui????o de letras mais ou menos normal, ao contr??rio de usar 'Conte??do aqui, conte??do aqui', fazendo com que pare??a ingl??s leg??vel. Muitos pacotes de editora????o eletr??nica e editores de p??ginas da web agora usam Lorem Ipsum como seu texto de modelo padr??o, e uma pesquisa por 'lorem ipsum' revelar?? muitos sites ainda em sua inf??ncia. V??rias vers??es evolu??ram ao longo dos anos, ??s vezes por acidente, ??s vezes de prop??sito (humor injetado e coisas do g??nero).
                                </Text>
                            </ScrollView>
                        </View>
                    </View>
                    <View style={styles.containerFooter}>
                        <View style={styles.inner}>
                            <TouchableOpacity 
                                style={styles.primaryButton}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.primaryButtonText}>N??o Aceito</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.primaryButton}
                                onPress={() => {
                                    connected(termo_ok);
                                    setModalVisible(!modalVisible);
                                }}>
                                <Text style={styles.primaryButtonText}>Li e Aceito</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>  
            </View> 

            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible1}
                    onRequestClose={() => setModalVisible1(!modalVisible1)}>

                    <View style={styles.centeredView}>
                        <View style={[styles.modalView, {backgroundColor: "#ecf0f1"}]}>
                            <Text style={[styles.modalText, {color: "#ecf0f1"}]}>Digite Sua Mensagem</Text>
                            <TextInput
                                style={{width: 250, height: 60, zIndex: 0, padding: 5, borderWidth: 1, backgroundColor: "#ecf0f1", borderRadius: 8}}
                                placeholder="Digite sua mensagem"
                                onChangeText={(text) => setMessage(text)}
                                value={message}
                            />
                            <SafeAreaView style={{padding: 10, marginTop: 20, height: 150, backgroundColor: "#ecf0f1", borderRadius: 8}}>
                                <ScrollView>
                                    <TouchableOpacity 
                                        style={[styles.buttonWhats, {justifyContent: "center", alignItems: "center"}]} 
                                        onPress={whats}>
                                        <Image source={WhatsApp} />  
                                    </TouchableOpacity>
                                </ScrollView>
                            </SafeAreaView>
                        </View>
                    </View>
                    <View style={styles.containerFooter}>
                        <View style={styles.inner}>
                            <TouchableOpacity  
                                style={styles.primaryButton}
                                onPress={() => setModalVisible1(!modalVisible1)}>
                                <Text style={styles.primaryButtonText}>Fechar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.primaryButton}
                                onPress={() => handleSend(chat)}>
                                <Text style={styles.primaryButtonText}>Enviar</Text>
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
        backgroundColor: "#e74c3c",
    },

    statusText:{
        fontSize: 18,
        fontWeight: "bold",
        color: "#ecf0f1",
        textAlign: 'center',
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

    containerButtonClose: {
        width: 150,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
    },

    buttonClose: {
        width: 100,
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        backgroundColor: "#2196F3",
    },

    modalText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },

    termo:{
        fontSize: 18,
        textAlign: "justify",
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
        backgroundColor: "#7f8c8d",//#bdc3c7 #7f8c8d
        marginBottom: "25%",
    }, 

    button2:{
        width: 170,
        height: 70,
        elevation: 5,
        padding: 5,
        marginRight: 20,
        borderRadius: 10,
        alignSelf: "center",
        textAlign: "center",
        marginTop: 20,
        backgroundColor: "#2ecc71",//#bdc3c7 #7f8c8d
        marginBottom: "25%",
    },

    buttonWhats:{
        width: 50,
        height: 50,
        elevation: 5,
        padding: 10,
        marginLeft: 0,
        borderRadius: 10,
        alignSelf: "center",
        textAlign: "center",
        marginTop: 20,
        backgroundColor: "#7f8c8d",//#bdc3c7 #7f8c8d
        marginBottom: "25%",
    }, 

    button1Text: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        color: "#000",
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    containerFooter: {
        backgroundColor: "#2980b9",
        paddingVertical: 10,
        zIndex: 10,
    },

    inner: {
        flexDirection: 'row',
        justifyContent: 'space-evenly', 
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

export default Pedidos_Abertos;