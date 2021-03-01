import React, { Component } from 'react';
import { View, Dimensions, TouchableOpacity, Image } from 'react-native'
import Images from '../assets/images'
import { backScreenHome } from '../navigation'

class ShowPostCheckIn extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             screenWidth: Dimensions.get('window').width,
//             screenHeight: Dimensions.get('window').height,
//             modalVisible: false
//         }

//     }
//     close_show = () => {
//         backScreen(this.props.componentId)
//     }
//     render() {
//         console.log('item show post checkIN', this.props);
//         return (
//             <View
//                 style={{
//                     width: this.state.screenWidth,
//                     height: this.state.screenHeight,
//                     backgroundColor: 'red',
//                     position: 'absolute',
//                     top: 0
//                 }}>

//                 <TouchableOpacity style={{ backgroundColor: 'blue', width: 50, height: 50 }} onPress={() => backScreenHome(this.props.componentId)}>
//                     <Image
//                         source={Images.close}
//                         style={{ width: 50, height: 50, tintColor: 'white', backgroundColor: 'yellow' }}
//                     ></Image>
//                 </TouchableOpacity>
//                 <Image
//                     source={{ uri: this.props.type.photo.path }}
//                     style={{ width: 100, height: 100 }}
//                 ></Image>

//             </View>
//         );
//     }
}

export default ShowPostCheckIn; 