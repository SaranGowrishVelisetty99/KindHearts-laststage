import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize';
import db from '../config'
import firebase from 'firebase'
import MyHeader from '../components/myheader'

export default class LogoutScreen extends Component {
    render(){
        return(
            <View style={styles.container}>
                <MyHeader navigation={this.props.navigation}/>
                <Text style={styles.title}>
                    Are You Sure To Logout?
                </Text>
            <View style={styles.logoutcontainer}>
                <TouchableOpacity
                        style={styles.logOutButton}
                        onPress={() => {
                            this.props.navigation.navigate('WelcomeScreen')
                            firebase.auth().signOut()
                        }}>
                        <Text style={styles.logOutText}>Log Out</Text>
                    </TouchableOpacity>
            </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },

    logOutContainer: {
        flex: 0.2,
        justifyContent: "flex-end",
        paddingBottom: 30,
    },
    logOutButton: {
        backgroundColor: 'lightgreen',
        borderWidth: 2,
        borderRadius: 50,
        borderColor: 'lightgreen',
        height: 50,
        justifyContent: "center",
        padding: 10,
        paddingLeft: 50,
        paddingRight: 50,
        alignText: 'center',
        marginTop: 10
    },

    logOutText: {
        fontSize: RFValue(18),
        fontWeight: "bold"
    },

    title: {
        marginTop: 250,
        fontWeight: 'bold',
        fontSize: 30
    }
});