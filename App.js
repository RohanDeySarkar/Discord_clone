import React from 'react'
import Chatkit, { TokenProvider } from '@pusher/chatkit-client'
import MessageList from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'
import RoomList from './components/RoomList'
import NewRoomForm from './components/NewRoomForm'

import { tokenUrl, instanceLocator } from './config'

class App extends React.Component {
    
    constructor() {
        super()
        this.state = {
            roomId: "",
            messages: [],
            joinableRooms: [],
            joinedRooms: []
        }
    this.sendMessage = this.sendMessage.bind(this)
    this.subscribeToRoom = this.subscribeToRoom.bind(this)
    this.getRooms = this.getRooms.bind(this)
    this.createRoom = this.createRoom.bind(this)
    } 
    
    componentDidMount() {
        const chatManager = new Chatkit.ChatManager({
            instanceLocator,
            userId: 'rohan',
            tokenProvider: new TokenProvider({
                url: tokenUrl
            })
        })
        
        chatManager.connect()
        .then(currentUser => {
            this.currentUser = currentUser
            this.getRooms()
        })
        .catch(err => console.log('error on connecting', err))
    }
    
    getRooms(){
        this.currentUser.getJoinableRooms() 
        .then(joinableRooms => {
            this.setState({
                // joinableRooms: joinableRooms //same thing
                joinableRooms,
                joinedRooms: this.currentUser.rooms
            })
        })
        .catch(err => console.log('error in joinable rooms', err))
    }

    subscribeToRoom(roomId){
        this.setState({ messages: [] })
        this.currentUser.subscribeToRoom({
            roomId: roomId,
            hooks: {
                onNewMessage: message => {
                    this.setState({
                        messages: [...this.state.messages, message] // storing new message 
                    })
                }
            }
        })
        .then( room => {
            this.setState({
                roomId: roomId
            })
            this.getRooms()
            })
        .catch(err => console.log('error on subscribing to rooms', err))
    }
    
    // In sendMessage func data is flowing from child to parent(inverse)
    sendMessage(text) {
        this.currentUser.sendSimpleMessage({   
            text,    // this is for sending new message
            roomId: this.state.roomId
        })
    }
    
    createRoom(name){
    this.currentUser.createRoom({
        name
    })
    .then(room => this.subscribeToRoom(room.id))
    .catch(err => console.log('error with create room', err))
    }
    
    render() {
        return (
            <div className="app">
                <RoomList 
                    roomId = {this.state.roomId}
                    subscribeToRoom = {this.subscribeToRoom}
                    rooms = {[...this.state.joinableRooms, ...this.state.joinedRooms]} 
                />
                <MessageList 
                    messages = {this.state.messages}
                    roomid = {this.state.roomId}
                 />
                <SendMessageForm sendMessage = {this.sendMessage} />
                <NewRoomForm createRoom = {this.createRoom} />
            </div>
        )
    }
}

export default App