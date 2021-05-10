import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ScrollView, FlatList, StyleSheet } from 'react-native';
import MyHeader from '../components/myheader'
import firebase from 'firebase'
import { ListItem, Icon } from 'react-native-elements';
import db from '../config'

export default class Contributions extends Component {
    static navigationOptions = { header: null };
    constructor() {
        super();
        this.state = {
            userId: firebase.auth().currentUser.email,
            allDonations: [],
            donorName: ''
        }
        this.requestRef = null;
    }
    getDonorDetails = (userId) => {
        db.collection("donors").where("emailId", "==", userId).get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    this.setState({
                        "donorName": doc.data().FirstName + " " + doc.data().LastName
                    })
                });
            })
    }

    getAllDonations =()=>{
        this.requestRef = db.collection("allDonations").where("donorId" ,'==', this.state.userId)
        .onSnapshot((snapshot)=>{
          //var allDonations = snapshot.docs.map(document => document.data());
          var allDonations = [];
           snapshot.docs.map((doc) => {
             var donation = doc.data();
             donation['docId'] = doc.id;
             allDonations.push(donation);
           });
          this.setState({
            allDonations : allDonations,
          });
        })
      }
    sendItem = (bookDetails) => {
        if (bookDetails.request_status === "Book Sent") {
            var request_status = "Donor Interested";
            console.log(bookDetails)
            db.collection("allSonations").doc(bookDetails.docSd).update({
                'requestStatus': "Donor Interested"
            })
            this.sendNotification(bookDetails, request_status)
            console.log('Here')
        }
        else {
            var requestStatus = "Book Sent";
            console.log("Book Send: ", bookDetails.docId)
            db.collection("allDonations").doc(bookDetails.docId).update({
                'requestStatus': "Book Sent"
            })
            this.sendNotification(bookDetails, requestStatus)
            console.log('Here Book Send')
        }
    }

    sendNotification = (bookDetails, request_status) => {
        var requestId = bookDetails.requestId;
        var donorId = bookDetails.donorId;
        db.collection("allNotifications")
            .where("requestId", "==", requestId)
            .where("donorId", "==", donorId)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    var message = ""
                    if (request_status === "Book Sent") {
                        message = this.state.donorName + " sent you book"
                    } else {
                        message = this.state.donorName + " has shown interest in donating the book"
                    }
                    db.collection("allNotifications").doc(doc.id).update({
                        "message": message,
                        "notificationStatus": "unread",
                        "date": firebase.firestore.FieldValue.serverTimestamp()
                    })
                });
            })
    }
    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item, i }) => (
        <ListItem
            key={i}
            title={item.itemName}
            subtitle={"Requested By: " + item.requestedBy + "\nStatus : " + item.requestStatus}
            leftElement={<Icon name="book" type="font-awesome" color='#696969' />}
            titleStyle={{ color: 'black', fontWeight: 'bold' }}
            rightElement={
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            backgroundColor: item.requestStatus === "Book Sent" ? "green" : "#ff5722"
                        }
                    ]}
                    onPress={() => {
                        this.sendItem(item)
                    }}
                >
                    <Text style={{ color: '#ffff' }}>
                        {
                            item.requestStatus === "Book Sent" ? "Book Sent" : "Send Book"
                        }
                    </Text>
                </TouchableOpacity>
            }
            bottomDivider
        />
    )


    componentDidMount() {
        this.getDonorDetails(this.state.userId);
        this.getAllDonations();
    }

    componentWillUnmount() {
        this.requestRef();
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <MyHeader navigation={this.props.navigation}/>
                <View style={{ flex: 1 }}>
                    {
                        this.state.allDonations.length === 0
                            ? (
                                <View style={styles.subtitle}>
                                    <Text style={{ fontSize: 20 }}>List Of All Book Donations</Text>
                                </View>
                            )
                            : (
                                <FlatList
                                    keyExtractor={this.keyExtractor}
                                    data={this.state.allDonations}
                                    renderItem={this.renderItem}
                                />
                            )
                    }
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    button: {
        width: 100,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#ff5722",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8
        },
        elevation: 16
    },
    subtitle: {
        flex: 1,
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
})