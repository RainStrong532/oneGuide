import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import images from '../../assets/images';
import i18next from 'i18next';
import Device from '../../modules/Device'
import Images from '../../assets/images'
import FastImage from 'react-native-fast-image';
import Colors from '../../constants/colors'

const initialLayout = {
    height: Device.screenSize().height,
    width: Device.screenSize().width,
  };


export default class ImageAlbum extends React.Component{

    onPressAlbum = () => {
        if(this.props.onPressAlbum){
            if(this.props.item){
                this.props.onPressAlbum(this.props.item);
            }else{
                this.props.onPressAlbum();
            }
        }
    }

    render(){
        const double_line = this.props.image_line ? images.double_line_gallery : images.add_double_line_gallery;
        const image = this.props.image ?  {uri: this.props.image} : this.props.image === "" ? "" : images.add_gallery;
        const title = this.props.item ? this.props.item.title ? this.props.item.title :this.props.item.content : i18next.t('CreateAlbum');
        const width =  initialLayout.width-40;
        const color = this.props.image_line ? '#333' : '#44c2d2';

        return(
        <View style={{display: 'flex', alignItems: 'center', maxWidth: width/2, marginHorizontal: 10}}>
            <TouchableOpacity
                onPress={this.onPressAlbum}
                style={{display: 'flex', alignItems: 'center'}}
            >
            <Image 
                source={double_line}
                style={{marginBottom: 2}}
            />
            <View style={{width: width/2, height: width/2, backgroundColor: image ? 'none' :Colors.black_1}}>
                <FastImage
                    resizeMode={FastImage.resizeMode.cover}
                    source={image}
                    style={{ width: '100%', height: '100%'}}
                />
            </View>
            </TouchableOpacity>
        <Text
            style={{color: color, fontSize: 16, marginTop: 5, marginBottom: 20}}
        >{title}</Text>
        </View>)
    }
}