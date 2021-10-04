import React, {useState, useEffect, useRef, useCallback}  from 'react';
import {View, Text, FlatList, Modal, Alert, RefreshControl, ActivityIndicator, Dimensions, ScrollView, ImageBackground, Image, TouchableOpacity, BackHandler, StyleSheet} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import NumberFormat from 'react-number-format';
import Check from '../../Images/check.png';
import Delete from '../../Images/delete.png';
import Contato from '../../Images/fone.png';
import CameraIcon from '../../Images/camera.png';
import Galeria from '../../Images/foto2.png';
import CameraButton from '../../Images/Camera-Button.png';
import Foto from '../../Images/foto.png';
import AlternarCamera from '../../Images/switch-camera-icon.png';
import ModaFooter from '../ModalFooter/ModalFooter';
import AsyncStorage from '@react-native-community/async-storage';
import { Camera } from 'expo-camera';
import Footer from '../Footer/footer';
import Header from '../Header/Header';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import Genios from '../../Images/Genios.png';
import Spinner from 'react-native-loading-spinner-overlay';
import * as ScreenOrientation from 'expo-screen-orientation';
import NetInfo from '@react-native-community/netinfo';
import Api from '../Api/index';
import moment from 'moment';

const screen = Dimensions.get('screen');
//const width = (screen.width / 100 * 30) + screen.width; // Largura da tela + 30% para ajustar a proporcao
//const margin = (width / 100) * 15; // largura da tela * 15% metade da porcentagem acima para ajustar o botao na tela
//console.log("Screen: ", width);
//console.log("Margem: ", margin);

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const Pedidos_Pendencias = ({navigation, route}) => { 

    const entry = route.params.entry; //Parametros recebidos na naveação da tela anterior

    const [msg, setMsg] = useState();
    const camRef = useRef(null); //Referencia para o componente Camera
    const [image, setImage] = useState(null);  // Imagem da Camera 'Salva' ou Selecionada
    const [modalVisible, setModalVisible] = useState(false); 
    const [modalVisible1, setModalVisible1] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [hasPermission, setHasPermission] = useState(null); // Seta o resultado da Permissão se Sim ou Não
    const [type, setType] = useState(Camera.Constants.Type.back);// Opção para escolher camera frontal ou Não
    const [capturedImage, setCapturedImage] = useState(null); // Imagem da Camera 'CAPTURADA'
    const [previewVisible, setPreviewVisible] = useState(false); //Visualiza e define se salva ou exclui
    const [listaImages, setListaImages] = useState(); // Retorna a Lista de Imagens
    const [imageID, setImageID] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshing1, setRefreshing1] = useState(false);
    const [state, setState] = useState(false);
    const [id, setId] = useState(0);
    const [tela, setTela] = useState();
   
    const openCamera = async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === 'granted');

        if (hasPermission === true || hasPermission === null) {
            setModalVisible(!modalVisible);
            changeScreenOrientation();
        }
        if (hasPermission === false) {
            alert("Acesso não Permitido");
        }  
    };
    
    async function changeScreenOrientation() {
        const orientation = await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.ALL);

        return orientation;
            
    };

    async function getOrientatonScreen() {
        const getOrientation = await ScreenOrientation.getOrientationAsync();

        setTela(getOrientation);
    };

    async function lockScreenOrientation() {
        const lockOrientation = await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        return lockOrientation;      
    };

    const capturarFoto = async () => {
     
        setState(true); //inicia o spinner (loading enquanto carrega a imagem preview)
        //getOrientatonScreen();

        if(camRef){
            const photo = await camRef.current.takePictureAsync({ 
                skipProcessing: true,// Documentacao recomenda False
                forceUpOrientation: true, 
                fixOrientation: true, 
                exif: true  
            });

                setId(entry.id);// Id que valida se a mensagem para Confirmar pedido é true ou false
                setCapturedImage(photo);
                setPreviewVisible(true);

                setTimeout(() => {
                    setState(false);//Por Segurança encerra o spinner em 4s tempo medio para carregamento da imagem
                }, 4000);

                //console.log("Foto: ", {orientValue: photo.exif.Orientation});

                //if({orientValue: photo.exif.Orientation} === 6){
                    //const manipResult = await ImageManipulator.manipulateAsync(
                        //photo,
                        //[{ rotate: 90 }, { flip: ImageManipulator.FlipType.Vertical }]
                    //);
                //};

                //const ratios = await camRef.current.getSupportedRatiosAsync();
                //console.log("Ratios: ", ratios);
                //console.log({orientValue: photo.exif.Orientation});
        };    
    };

    const deleteFoto = () => {
        setCapturedImage(null);
        setPreviewVisible(false);
        setState(false);
        setImage(null);
    };

    const atualizaDados = () => {
        setTimeout(() => {
            onRefresh();
            setModalVisible3(false);   
        }, 6000);
    };
    
    useEffect(() => {

        async function getData(){

            const req = await fetch(Api.url+"/api/images/?agendamento="+entry.id,{
                method: "GET",
                body: JSON.stringify(),
                headers: { 'Content-Type' : 'application/json' }
            });
        
            const json = await req.json();
    
            setListaImages(json);
                
            //console.log("Api de Imagens retorna: ", json[0].os);
        };
        getData();

    }, [refreshing, image, loading, capturedImage, previewVisible, imageID, hasPermission, state]); 
    
    //seleciona a imagem
    const selectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.cancelled) {
            manipulatorImageSelect(result);
            setModalVisible3(!modalVisible3);
            atualizaDados();
            setModalVisible(!modalVisible);
            setImage(result);    
        };
    };
    
    //formata a imagem
    const manipulatorImageSelect = async (result) => {
        const manipResult = await ImageManipulator.manipulateAsync(
            result.uri,
            [{ resize: { width: 900, height: 900 } }],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        ); 
        postImageSelect(manipResult);
    };

    useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {

            onRefresh1();
            onRefresh(); 
        });
        return unsubscribe;

    }, [navigation]);// Quando a tela recebe o foco ela chama a função onRefresh e atualiza a tela

    const onRefresh1 = useCallback(async () => {
        setRefreshing1(true);

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

            wait(2000).then(() => setRefreshing1(false));

    }, [refreshing1, msg]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setId(entry.id);

        const req = await fetch(Api.url+"/api/images/?agendamento="+entry.id,{
            method: "GET",
            body: JSON.stringify(),
            headers: { 'Content-Type' : 'application/json' }
        });

            const json = await req.json();

            const filter = async (json) => {

                const found = await json.find(element => element.status === false);
                //const found = await json.filter(element => element.status === true);
        
                if(found === undefined && id === entry.id){

                    Alert.alert(
                        "Todas Imagens Enviadas!",
                        "Vamos Confirmar Instalação ? ",
                        [
                            { text: "OK", onPress: () => callback()}// Chama a funcao callback
                        ],
                    );

                    setTimeout(() => {
                        callback()
                    }, 3000);
    
                }
                else{
                    console.log("Ainda existe fotos com status false");
                }
            };
            filter(json);
            
            setListaImages(json);
            
            wait(3000).then(() => {
                setRefreshing(false);
            });
            

    }, [refreshing, image, loading, capturedImage, previewVisible, imageID, hasPermission, state, id]);
    
    const instalados = async (apiInstalados) => {

        const req = await fetch(Api.url+"/api/pendente-instalado/"+entry.id,{
            method: "PUT",
            body: JSON.stringify(),
            headers: { 'Content-Type' : 'application/json' }
        });
            try{
                const json = await req.json();
                return json
            }
            catch(e){
                console.log("ERROR: ", e);
        }

        apiInstalados();
    };

    const apiInstalados = async () => { 
        const tkn = await AsyncStorage.getItem('token');

        const requisicao = await fetch(Api.url+"/api/instalado/"+entry.id,{
            method: "GET",
            body: JSON.stringify(),
            headers: { 
            'Authorization': 'Token '+tkn,
            'Content-Type' : 'application/json' }
        });

        const retorno = await requisicao.json(); 
        navigation.reset({
            index: 0,
            routes: [{name: "Pedidos_Instalados", params: {entry: retorno}}],// reset no historico de navegaçao e passa parametros
        })  
        //navigation.navigate("Pedidos_Instalados", {entry: retorno}) //Só depois que o PUT e feito e depois o GET entao com o retorno do GET feita a navegaçao
    };

    const callback = () => {// executa o PUT na funcao instalados e leva como parametro a funcao GET apiInstalados
        instalados(apiInstalados);
    };
    
    const savePhoto = (photo) => {
        setImage(photo); 
        setState(false);
        setModalVisible(!modalVisible);
        setCapturedImage(null);
        setPreviewVisible(false);
        manipulator(photo);
        setModalVisible3(!modalVisible3);
        lockScreenOrientation();
        atualizaDados();
    };

    const manipulator = async (photo) => {
        const manipResult = await ImageManipulator.manipulateAsync(
            photo.uri,
            [{ resize: { width: 900 } }],//, height: 900
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );    
        post(manipResult);
    };
    
    const post = async (photo) => {

        const form = new FormData();

        form.append('image', {
            uri: photo.uri,
            type: 'image/jpg',
            name: 'image.jpg',
        });
        
        const req = await fetch(Api.url+"/api/image/"+imageID, {
            method: 'PUT',
            body: form,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        try{
            const json = await req.json();
            console.log(json);
        }
        catch(e){
            console.log("ERROR: ", e);
            setLoading1(false); 
        }
    };

    const getImage = async (item) => {

        const req = await fetch(Api.url+"/api/image/"+item.id,{
            method: 'GET',
            body: JSON.stringify(),
            headers:{
                Accept: 'application/json',
                'Content-Type' : 'application/json',
            }
        })

        const json = await req.json();

        setTimeout(() => {
            setLoading(false);
        }, 3000);
        
        setModalVisible1(!modalVisible1);
        setImage(json.image);
      
    };

    const fecharModal = () => {
        lockScreenOrientation();
        setModalVisible(false);
        setModalVisible1(false);
        setImage(null);
        setImageID();
    };

    useEffect(() => {
        const backAction = () => {
            lockScreenOrientation();
        };
    
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, []);
    
    const status_service_true = async (get_status_true) => {

        const req = await fetch(Api.url+"/api/pendente-instalado/"+entry.id,{
            method: "POST",
            body: JSON.stringify(),
            headers: { 'Content-Type' : 'application/json' }
        });

            try{
                const json = await req.json();
                return json
            }
            catch(e){
                console.log("ERROR: ", e);
        }
        get_status_true();
    };

    const get_status_true = async () => {

        const tkn = await AsyncStorage.getItem('token');

        const req = await fetch(Api.url+"/api/pendente-instalado/"+entry.id,{
            method: "GET",
            body: JSON.stringify(),
            headers: { 
            'Authorization': 'Token '+tkn,
            'Content-Type' : 'application/json' }
        });

        const res = await req.json();
        entry.serv_concluido = res.serv_concluido;
    };

    const callback_callback = () => {

        status_service_true(get_status_true); 

        onRefresh();
        
        Alert.alert(
            "Atenção",
            "Não esqueça de finalizar o agendamento nos enviando as imagens abaixo. Muito Obrigado",
            [{ text: "OK", onPress: () => console.log("OK")}]
        );
    };

    const connected = async (callback_callback) => { // VERIFICA CONEXAO COM A REDE

        await NetInfo.fetch().then(state => {

            if(state.isConnected === true){
                callback_callback();
            }
            else{
                alert("Falha na Conexão, sem acesso a internet.");
            }
        });
    };

    const conexao_rede = async (alertaImagesPendentes) => { // VERIFICA CONEXAO COM A REDE

        await NetInfo.fetch().then(state => {

            if(state.isConnected === true){
                alertaImagesPendentes();
            }
            else{
                alert("Falha na Conexão, sem acesso a internet.");
            }
        });
    };

    const alertaImagesPendentes = () => {
        Alert.alert(
            "Por favor!",
            "Envie todas as imagens e confirme a instalação.",
            [{ text: "OK", onPress: () => console.log("OK")}]
        );
    };

    const CameraPreview = ({photo}) => {

        return(
            <View style={{ flex: 1, backgroundColor: 'transparent', width: '100%', height: '100%'}}>       
                <ImageBackground source={{uri: photo && photo.uri}} 
                    style={{ flex: 1, width: "100%"}}>
                    
                </ImageBackground>  
                    <View style={{flexDirection: "row", justifyContent: "space-around", padding: 5, backgroundColor: "#000",}}>
                        <TouchableOpacity
                            style={styles.buttonDeletarFoto}
                            onPress={deleteFoto}>
                            <Image source={Delete}/>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.buttonSalvarFoto}
                            onPress={() => savePhoto(photo)}>
                            <Image source={Check}/>
                        </TouchableOpacity>      
                    </View>               
            </View>
        )
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

            <Header navigation={navigation} title="Serviço Pendente"></Header>

            {entry.serv_concluido === true ?
            <View style={{flexDirection: "row", justifyContent: "center"}}>
                <TouchableOpacity 
                    style={styles.button3}
                    onPress={() => conexao_rede(alertaImagesPendentes)}>
                    <Text style={styles.button1Text}>Finalizar Serviço</Text>
                </TouchableOpacity>
            </View>
            :
            <View style={{flexDirection: "row", justifyContent: "center"}}>
                <TouchableOpacity 
                    style={styles.button2}
                    onPress={() => connected(callback_callback)}>
                    <Text style={styles.button1Text}>Finalizar Serviço</Text>
                </TouchableOpacity>
            </View>
            }

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
                                        <Text style={styles.txt}>Cliente</Text>    
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.tableButton, {borderLeftWidth: 1, borderLeftColor: "#000", borderStyle: "solid", alignItems: "flex-end"}]}>
                                        <Text style={styles.txt}>{item.cliente_loc}</Text>
                                    </TouchableOpacity>
                                </View>

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

                                <View style={{flexDirection: "row",  marginLeft: 20, marginRight: 20, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderStyle: "solid", borderColor: "#000", backgroundColor: "#fff", borderBottomLeftRadius: 8, borderBottomRightRadius: 8,}}>
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

            
            {entry.serv_concluido === true ? 
            
            <View style={styles.twoList}>
                <FlatList
                    data={listaImages}
                    extraData={[entry]}
                    keyExtractor={item => JSON.stringify(item.id)}
                    renderItem={({item}) =>
                                                                                            
                    <View style={item.aceito === true && item.status === true ? styles.buttonsAcessarCamera : item.aceito === false && item.status === true ? styles.acessarCameraFalse : item.aceito === false && item.status === false ? styles.buttonStatus : styles.buttonElse}>
                        <Text style={styles.textText}>{item.nome_fantasia}</Text>
                        <TouchableOpacity
                            style={styles.buttonAdicionar}
                            onPress={() => openCamera() && setImageID(item.id)}>
                            <Image source={CameraButton} style={{marginTop: 5}}/>
                        </TouchableOpacity>    

                        <TouchableOpacity
                            style={styles.buttonVizualizar} 
                            onPress={() =>  {
                                setModalVisible1(!modalVisible1);
                                getImage(item);
                                setImageID(item.id);
                                }}>
                            <Image source={Foto} style={{marginTop: 9}}/>
                        </TouchableOpacity>
                    </View>
                    }>
                </FlatList>
            </View>
            :
            <View></View>
            }
            
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={fecharModal}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.containerCameraView}>
                        {previewVisible && capturedImage ? (
                        <CameraPreview photo={capturedImage} savePhoto={savePhoto} retakePicture={deleteFoto}/>
                          
                        ) : (
                           
                            <Camera 
                                style={{flex: 1, width: "100%"}} 
                                type={type} 
                                ref={camRef}
                                
                                autofocus={Camera.Constants.AutoFocus.on}
                                flashMode={Camera.Constants.FlashMode.off}>
                                
                                <TouchableOpacity
                                    style={styles.buttonCloseCamera}
                                    onPress={fecharModal}>
                                    <Image source={Delete}/>
                                </TouchableOpacity>

                                <Spinner
                                    visible={state}
                                    size="large"
                                    cancelable={true}
                                    textStyle={styles.spinnerTextStyle}
                                />
                                <View style={styles.buttonContainer}></View> 
                                    <View style={styles.footerCamera}>
                                        <TouchableOpacity
                                            onPress={capturarFoto}>
                                                <Image source={CameraIcon}/>        
                                        </TouchableOpacity>                        
                                    </View>      
                            </Camera>
                        )}
                                 
                        </View>           
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible1}
                onRequestClose={() => setModalVisible1(!modalVisible1)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.containerCamera}>
                            <View style={{ backgroundColor: 'transparent', flex: 1, width: '100%', height: '100%'}}>
                                {loading === true ? 
                                <View style={{flex: 1, alignItems: "center", backgroundColor: "#3498db"}}>
                                    <Image source={Genios} style={{marginTop: 150}}/>
                                    <ActivityIndicator size="large" color="#fff"/>
                                    <Text style={{textAlign: "center", marginTop: 20, fontSize: 20, color: "#fff"}}>Carregando Imagem...</Text>   
                                </View>
                                :
                                <View style={{flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center"}}> 
                                
                                    <ImageZoom cropWidth={Dimensions.get('window').width}
                                        cropHeight={Dimensions.get('window').height}
                                        imageWidth={Dimensions.get('window').width}
                                        imageHeight={300}
                                        >
                                            <Image style={{width:"100%", height: 300}}
                                        source={{ uri: Api.url+image}}/>
                                    </ImageZoom>
                                    
                                </View>
                                }
                            </View>
                        </View>           
                    </View>
                </View>
                <ModaFooter onPress={fecharModal}/>
            </Modal>


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible3}
                onRequestClose={() => setModalVisible3(!modalVisible3)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.containerCamera}>
                            <View style={{ backgroundColor: 'transparent', flex: 1, width: '100%', height: '100%'}}>
                                {loading1 === true ? 
                                <View style={{flex: 1, alignItems: "center", backgroundColor: "#3498db"}}>
                                    <Image source={Genios} style={{marginTop: 150}}/>
                                    <ActivityIndicator size="large" color="#fff"/>
                                    <Text style={{textAlign: "center", marginTop: 20, fontSize: 20, color: "#fff"}}>Enviando Imagem...</Text>   
                                </View>
                                :
                                <View style={{flex: 1, alignItems: "center", backgroundColor: "#3498db"}}>
                                    <Image source={Genios} style={{marginTop: 150}}/>
                                    <Text style={{fontSize: 24, marginTop: 20, color: "#fff"}}>Obrigado Parceiro!</Text>
                                    <Text style={{fontSize: 20, color: "#fff"}}>Aguarde um momento</Text>
                                    <Text style={{fontSize: 20, textAlign: "center", color: "#fff", marginBottom: 20}}>Estamos enviando sua imagem.</Text>
                                    <ActivityIndicator size="large" color="#fff"/>
                                </View>
                                }
                            </View>
                        </View>           
                    </View>
                </View>
            </Modal>

            <View style={{flexDirection: "row", justifyContent: "center"}}>
                <TouchableOpacity 
                    style={styles.button1} 
                    onPress={() => navigation.navigate("Contato", {entry: entry, tela: "Pedidos_Pendencias"})}>
                    <Image source={Contato} />                    
	            </TouchableOpacity>
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

    spinnerTextStyle: {
        color: '#FFF',
    },

    txt:{
        fontSize: 18,
        color: "#000",
    },

    tableButton:{
        flex: 1,
        padding: 5,
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
        marginBottom: 100,
        backgroundColor: "#7f8c8d",
    }, 

    button2:{
        width: 200,
        height: 60,
        elevation: 5,
        padding: 10,
        borderRadius: 10,
        alignSelf: "center",
        textAlign: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 15,
        backgroundColor: "#FFFF00",
    },

    button3:{
        width: 200,
        height: 60,
        padding: 10,
        borderRadius: 10,
        alignSelf: "center",
        textAlign: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 15,
        backgroundColor: "#bdc3c7",
    },

    button1Text: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        color: "#000",
    },

    buttonsAcessarCamera:{
        marginBottom: 2,
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#2ecc71",
    },

    acessarCameraFalse:{
        marginBottom: 2,
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#f1c40f",
    },

    buttonStatus:{
        marginBottom: 2,
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#e74c3c",
    },

    buttonElse:{
        marginBottom: 2,
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "transparent",
    },

    buttonAdicionar: {
        width: 60,
        height: 50, 
    },

    buttonVizualizar: {
        width: 60,
        height: 50,
    },

    textText:{
        width: 160,
        fontSize: 18,
        color: "#000",
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
        borderRadius: 20,
        padding: 5,
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

    modalView: {
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
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
        borderColor: "black",
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },

    // Container  ---- Camera  ---- View

    containerCameraView:{
        flex: 1,
        width: "100%",
        //height: screen.width,
    },

    // Container  ---- Camera  ---- View

    containerCamera:{
        flex: 1,
        width: "100%",
    },

    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },

    text: {
        fontSize: 18,
        color: 'white',
    },

    containerButtonCamera:{
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        padding: 20,
        justifyContent: 'space-between'
    },

    containerButtonCamera2:{
        alignSelf: 'center',
        flex: 1,
        alignItems: 'center'
    },

    buttonCamera:{
        width: 70,
        height: 70,
        bottom: 0,
        borderRadius: 50,
        backgroundColor: '#fff'
    },

    buttonSalvarFoto:{
        padding: 5,
    },

    buttonCloseCamera:{
        //marginRight: margin,
        alignItems: "flex-end",
        padding: 10
    },

    buttonDeletarFoto:{
        padding: 5,
    },

    buttonCapturarImage:{
        width: 70,
        height: 70,
        alignSelf: "center",
        borderRadius: 50,
        backgroundColor: '#fff',
    },

    footerCamera:{
        width: "100%",
        height: 90,
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingRight: 20,
        alignItems: "center",
    },

    status:{
        flexDirection: "row",
        justifyContent: "center",
    },

    statusViewPendente:{
        paddingLeft: "15%",
        paddingRight: "15%",
        borderRadius: 8,
        justifyContent: "center",
        backgroundColor: "#FFFF00",
    },

    statusText:{
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
        textAlign: 'center',
    },

    oneList:{
        width: "100%",
        height: 300,
        borderBottomColor: "#2980b9",
        borderBottomWidth: 10,
    },

    twoList:{
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        backgroundColor: "#3498db",
    },
});

export default Pedidos_Pendencias;