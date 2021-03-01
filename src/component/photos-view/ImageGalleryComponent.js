import { Modal, View, Text, Image, TouchableOpacity } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Images from '../../assets/images'
import React from 'react';
import { backScreen, showMoreOptionsPost, } from '../../navigation';
import Colors from '../../constants/colors';
import FastImage from 'react-native-fast-image';

export default class ImageGalleryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: true
    }
  }
  renderIndicator = (currentIndex) => {
    const { listImage } = this.props.data;
    return (
      <View
        style={
          {
            backgroundColor: Colors.black_1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            paddingLeft: 5
          }
        }
      >
        <View>
          <TouchableOpacity
            onPress={this.onPressCloseImage}
          >
            <Image source={Images.back}
              style={{
                width: 25,
                height: 25,
                tintColor: 'white'
              }}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={{
              color: 'white',
              fontSize: 18
            }}
          >
            {currentIndex + "/" + listImage.length}
          </Text>
        </View>
        <View>
          <Text>
          </Text>
        </View>
      </View>
    )
  }

  onPressCloseImage = () => {
    this.setState({ showModal: false });
    backScreen(this.props.componentId);
  }

  render() {
    let { listImage, index } = this.props.data;
    listImage = listImage.map(item => {
      return {
        url: item.path
      }
    })
    return (
      <View>
        <Modal visible={this.state.showModal}
          transparent={false}
          animationType="slide"
          onRequestClose={() => {
            this.onPressCloseImage();
          }}
          onShow={() => {
          }}
          onDismiss={() => {
            this.onPressCloseImage();
          }}>
          <ImageViewer
            renderHeader={
              this.renderHeader
            }
            backgroundColor={Colors.black_1}
            index={index}
            renderIndicator={this.renderIndicator}
            renderHeader={this.renderIndicator}
            renderImage={this.renderImage}
            imageUrls={listImage} />
        </Modal>
      </View>
    )
  }
}