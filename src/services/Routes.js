import React from 'react';
import { View, Image, Text, TouchableOpacity, StatusBar, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {Button, Icon} from 'native-base';

import Genios from '../../Images/Genios.png';

import Agendamentos from '../Agendamentos';
import Configuracoes from '../Configuracoes';
import Financeiro from '../Financeiro/Financeiro';
import Resumo from '../Resumo';
import Contato from '../Contato';
import Pedidos_Abertos from '../Pages/Pedidos_Abertos';
import Pedidos_Agendados from '../Pages/Pedidos_Agendados';
import Pedidos_Aprovados from '../Pages/Pedidos_Aprovados';
import Pedidos_Instalados from '../Pages/Pedidos_Instalados';
import Pedidos_Negados from '../Pages/Pedidos_Negados';
import Pedidos_Pendencias from '../Pages/Pedidos_Pendencias';
import Pedidos_Finalizados from '../Pages/Pedidos_Finalizados';
import Notification from '../Pages/Notification';
import Login from '../Login';
import Agenda from '../Agenda';
import Chat from '../Pages/Chat';

const ContainerMenu = ({navigation}) => {

  return(
    <View style={styles.containerMenu}>

      <View style={styles.menuHeader}>
        <Image source={Genios}/>
      </View>

      <View style={styles.menuPages}>
        <TouchableOpacity
          style={styles.pagesButton}
          onPress={() => navigation.navigate("Agendamentos")}>
          <Text style={styles.pagesText}>Meus Serviços</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.pagesButton}
          onPress={() => navigation.navigate("Agenda")}>
          <Text style={styles.pagesText}>Agenda</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.pagesButton}
          onPress={() => navigation.navigate("Financeiro")}>
          <Text style={styles.pagesText}>Financeiro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.pagesButton}
          onPress={() => navigation.navigate("Notification")}>
          <Text style={styles.pagesText}>Contato</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.pagesButton}
          onPress={() => navigation.navigate("Login")}>
          <Text style={styles.pagesText}>Sair</Text>
        </TouchableOpacity>
      </View>

    
      
      <View style={styles.goBack}>
        <Button 
          iconLeft light
          style={styles.buttonGoBack}
          onPress={() => navigation.toggleDrawer()}>
          <Icon name='arrow-back' style={styles.buttonIcon}/>
          <Text style={styles.goBackText}>Fechar</Text>
        </Button>
      </View>
    </View>
   
  )
};

const Drawer = createDrawerNavigator();

export function Menu() {
  return(
    <Drawer.Navigator
        drawerType="slide"
        drawerContent={ContainerMenu}
        drawerStyle={styles.menu}> 
        <Drawer.Screen name="Agendamentos" component={Agendamentos}/>
        <Drawer.Screen name="Agenda" component={Agenda}/>
        <Drawer.Screen name="Financeiro" component={Financeiro}/>
        <Drawer.Screen name="Resumo" component={Resumo}/>
        <Drawer.Screen name="Configuracoes" component={Configuracoes}/>
        <Drawer.Screen name="Contato" component={Contato}/> 
        <Drawer.Screen name="Pedidos_Abertos" component={Pedidos_Abertos}/>
        <Drawer.Screen name="Pedidos_Agendados" component={Pedidos_Agendados}/>
        <Drawer.Screen name="Pedidos_Aprovados" component={Pedidos_Aprovados}/>
        <Drawer.Screen name="Pedidos_Instalados" component={Pedidos_Instalados}/>
        <Drawer.Screen name="Pedidos_Negados" component={Pedidos_Negados}/>
        <Drawer.Screen name="Pedidos_Pendencias" component={Pedidos_Pendencias}/>  
        <Drawer.Screen name="Pedidos_Finalizados" component={Pedidos_Finalizados}/>
        <Drawer.Screen name="Notification" component={Notification}/>
        <Drawer.Screen name="Chat" component={Chat}/>
    </Drawer.Navigator> 
  )
};

const Stack = createStackNavigator();

const StackScreens = () => {
  return (
    <Stack.Navigator 
      screenOptions={{headerShown: false}} 
      initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Agendamentos"  component={Menu}/>
      <Stack.Screen name="Financeiro" component={Financeiro}/>
      <Stack.Screen name="Resumo" component={Resumo}/>
      <Stack.Screen name="Configuracoes" component={Configuracoes}/>
      <Stack.Screen name="Contato" component={Contato}/> 
      <Stack.Screen name="Pedidos_Abertos" component={Pedidos_Abertos}/>
      <Stack.Screen name="Pedidos_Agendados" component={Pedidos_Agendados}/>
      <Stack.Screen name="Pedidos_Aprovados" component={Pedidos_Aprovados}/>
      <Stack.Screen name="Pedidos_Instalados" component={Pedidos_Instalados}/>
      <Stack.Screen name="Pedidos_Negados" component={Pedidos_Negados}/>
      <Stack.Screen name="Pedidos_Pendencias" component={Pedidos_Pendencias}/>  
      <Stack.Screen name="Pedidos_Finalizados" component={Pedidos_Finalizados}/> 
      <Stack.Screen name="Notification" component={Notification}/>
      <Stack.Screen name="Chat" component={Chat}/>
    </Stack.Navigator>
  );
};

const Routes = () => {
  return(
    <NavigationContainer>
        <StackScreens/>
    </NavigationContainer>
  )
};

const styles = StyleSheet.create({
  containerMenu:{
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },

  menuHeader:{
    width: 200,
    height: 100,
    marginTop: "10%",
    justifyContent: "center",
    alignItems: "center",
  },

  menuPages: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "flex-start",
  },  

  pagesButton:{
    width: 200,
    height: 40,
    padding: 10,
    justifyContent: 'center',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 20,
    borderColor: "#2980b9",
  },

  pagesText:{
    fontSize: 18,
    color: "#2980b9",
    textAlign: 'center',
  },  
  
  menu:{
    width: "100%",
    backgroundColor: "#fff",
  },

  goBack:{
    justifyContent: "center",
  },

  buttonGoBack: {
    width: 130,
    paddingRight: 30,
    marginBottom: 30,
    backgroundColor: "#2980b9",
  },

  buttonIcon:{
    color: "#fff",
  },

  goBackText:{
    color: "#fff",
  },
});

export default Routes;