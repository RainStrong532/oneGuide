import io from 'socket.io-client';
import _ from 'lodash'
import Config from 'react-native-config'
import OAuthHandler from './OAuthHandler'
import { dispatchAction } from '../store/store'
import { MESSAGE_CHAT_RECEIVED, MESSAGE_CHAT_SEEN, GET_NEW_NOTIFICATIONS } from '../actions/action-types'
import { getMyInfo, } from '../actions/user-action'

const CHANNEL_CREATED_MESSAGE = 'created_message'
const CHANNEL_CONNECT = 'connect'
const CHANNEL_DISCONNECT = 'disconnect'
const CREATE_COMMENT = 'get_notifications'
const MAX_RECONNECT_COUNT = 5
const CREATE_ACTION_LIKE = ''
const CREATE_INVITED_TOUR = ''
const CREATE_GUIDE_APPLY_TOUR = ''
const CREATE_ADD_FRIEND = ''
const CREATE_AGENT_CANCEL_TOUR = ''
const CREATE_AGENT_APPLY_GUIDE = ''
const CREATE_GUIDE_CANCEL_TOUR = ''
let number_reconnect_attempt = 0

const connect = async () => {
    initSocket()
    listen()
}

const initSocket = () => {
    this.socket = io(Config.SOCKET_SERVER, { transports: ['websocket'] });
}

const sendMessage = (data) => {

    // get access token
    OAuthHandler.getAccessToken().then(token => {
        const dataBody = { ...data, token }
        // console.log("send message", token, data);
        this.socket.emit(CHANNEL_CREATED_MESSAGE, dataBody);
    })
}

const sendComment = () => {
    OAuthHandler.getAccessToken().then(data => {
        const dataBody = { token: data }
        this.socket.emit(CREATE_COMMENT, dataBody)
    })
}


const listen = () => {

    this.socket.on(CHANNEL_CONNECT, () => {
        // console.log('Socket CHANNEL_CONNECT')
        number_reconnect_attempt = 0
    });

    this.socket.on(CHANNEL_DISCONNECT, () => {
        // console.log('Socket CHANNEL_DISCONNECT')
        if (number_reconnect_attempt <= MAX_RECONNECT_COUNT) {
            number_reconnect_attempt += 1
            initSocket()
        }
    });

    this.socket.on(CHANNEL_CREATED_MESSAGE, (data) => {
        // console.log('Socket CHANNEL_CREATED_MESSAGE', data)
        // get message
        let messageChat = _.get(data, 'data.data.conversation')
        if (messageChat) {

            const message_temp_id = _.get(data, 'data.message_temp_id')
            const message_id = _.get(messageChat, 'message_id') || _.get(messageChat, 'last_message_id')
            messageChat = { ...messageChat, message_id }
            if (message_temp_id) {
                messageChat = { ...messageChat, message_temp_id }
            }

            // console.log('Socket messageChat', messageChat)

            // action
            const action = () => ({
                type: MESSAGE_CHAT_RECEIVED,
                payload: { message: messageChat }
            })

            // dispatch action
            dispatchAction(action())

            /// fake for seen action
            setTimeout(() => {

                // action
                const action = () => ({
                    type: MESSAGE_CHAT_SEEN,
                    payload: { message: messageChat }
                })

                // dispatch action
                dispatchAction(action())

            }, 200);
        }

    });

    this.socket.on(CREATE_COMMENT, (data) => {

        dispatchAction(getMyInfo())
        console.log("get_notifications:", data);
        // const action = () => ({
        //     type: GET_NEW_NOTIFICATIONS,
        //     payload: {}
        // })

        // // dispatch action
        // dispatchAction(action())


    });

}

export default {
    connect,
    sendMessage,
    sendComment,
}