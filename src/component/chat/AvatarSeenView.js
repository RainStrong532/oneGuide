import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native'
import Colors from '../../constants/colors'
import Device from '../../modules/Device'

export default class AvatarSeenView extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { data } = this.props
    return (
      <View>
        {
          data && data.length > 0 ?
            data.map(item => {
              <Image
                source={{ uri: item.source }}
                style={{
                  width: item.height,
                  height: item.height,
                  borderRadius: item.height / 2,
                  margin: 10
                }}
              />
            })
            : null
        }
      </View>
    )
  }


}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginRight: 10,
    marginBottom: 8,
  },
})