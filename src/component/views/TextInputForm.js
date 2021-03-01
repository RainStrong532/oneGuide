import React, { Component } from 'react';
import { TextInput, TouchableOpacity, Text, View, StyleSheet, Image, Platform } from 'react-native';
import Fonts from '../../constants/fonts';
import Colors from '../../constants/colors';
import Images from '../../assets/images'
import CommonStyles from '../../constants/styles';
import { TouchableHighlight } from 'react-native';

class CustomTextInput extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isShow: true,
      selection: {
        start: 0, end: 0
      },
      preSelection: null,
      value: ''
    }
  }

  componentDidMount() {
    this.handlePropsToState()
  }

  handlePropsToState = () => {
    this.setState({
      isShow: this.props.secureTextEntry
    })
  }

  render() {
    // if (this.props.secure === true) {
    //   return this.renderSecureTextEntry()
    // }

    return this.renderNormal()
  }

  renderNormal() {
    const { title, rightImage, leftPadding, disableUpFstChr, isHidePass, iconShowPass } = this.props;
    const style = [leftPadding ? { paddingLeft: 70, paddingRight: 16, fontSize: 14 } : styles.text_input, { marginRight: 25, height: 50 }];
    const newProps = { ...this.props, style };
    let isShow = this.state.isShow
    let iconPassword
    if (isShow == true) {
      iconPassword = isHidePass
    }
    if (isShow == false) {
      iconPassword = iconShowPass
    }

    return (
      <View style={[this.props.style, styles.container, CommonStyles.border_gray_46]}>
        {/* {
          this.props.isRequired ?
            <View style={styles.viewTitle}>
              <Text style={[CommonStyles.textJp12, styles.title]} numberOfLines={1}>{title}</Text>
              <Text style={[CommonStyles.textJp12, { color: Colors.red_1 }]}>*</Text>
            </View> :
            <Text style={[CommonStyles.textJp12, styles.title]} numberOfLines={1}>{title}</Text>
        } */}
        <TextInput
          underlineColorAndroid="transparent"
          ref={this.props.innerRef}
          {...newProps}
          secureTextEntry={isShow}


        />
        <View
          style={{ position: 'absolute', right: 10, }}
        >
          <TouchableOpacity
            // style={{ borderColor: 'red', borderWidth: 3 }}
            disabled={rightImage ? true : false}
            onPress={() => this.setState({ isShow: !isShow })}>
            <Image
              source={rightImage ? rightImage : iconPassword}
              resizeMode='center'
              style={{
                width: 30, height: 30,
                // tintColor: Colors.gray 
              }}
            >
            </Image>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  changed = false;
  preV = '';
  isLock = -1;
  isUpdated = false;
  // renderSecureTextEntry() {
  //   const { title, rightImage } = this.props;
  //   let { isShow } = this.state;
  //   return (
  //     <View style={[this.props.style, styles.container]}>
  //       {/* {
  //         this.props.isRequired ?
  //           <View style={styles.viewTitle}>
  //             <Text style={[CommonStyles.textJp12, styles.title]} numberOfLines={1}>{title}</Text>
  //             <Text style={[CommonStyles.textJp12, { color: Colors.red_1 }]}>*</Text>
  //           </View> :
  //           <Text style={[CommonStyles.textJp12, styles.title]} numberOfLines={1}>{title}</Text>
  //       } */}
  //       {/* <Text style={[CommonStyles.textJp12, styles.title]} numberOfLines={1}>{title}</Text> */}

  //       {/* <View style={[CommonStyles.border_gray_46, styles.container]}> */}
  //       {/* <this.renderSecretInput /> */}
  //       {/* <TouchableOpacity
  //         onPress={() => this.setState({ isShow: !this.state.isShow })}
  //       > */}
  //       <Image
  //         source={rightImage}
  //         resizeMode='center'
  //         style={{ position: 'absolute', width: 20, height: 14, right: 10 }}>
  //       </Image>
  //       {/* </TouchableOpacity> */}
  //       {/* <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => {
  //           this.changed = true;
  //           this.setState({ isShow: !isShow })
  //         }} >
  //           <Image
  //             source={isShow ? Images.show_pass : Images.hide_pass}
  //             style={styles.image} />
  //         </TouchableOpacity> */}
  //       {/* </View> */}
  //     </View>
  //   );
  // }

  // renderSecretInput = () => {
  //   const style = [styles.text_input_secure];
  //   const newProps = { ...this.props, style };
  //   let { isShow } = this.state;
  //   if (Platform.OS === 'ios') {
  //     return (
  //       <TextInput
  //         secureTextEntry={isShow ? true : false}
  //         underlineColorAndroid="transparent"
  //         ref={this.props.innerRef}
  //         {...newProps}
  //       />
  //     );
  //   } else {
  //     let { value, selection, preSelection } = this.state;
  //     if (this.isLock !== -1 || value === '') {
  //       selection = {
  //         start: 0,
  //         end: 0
  //       };
  //       if (value === '') {
  //         this.isUpdated = false;
  //       }
  //     }
  //     return (
  //       <TextInput
  //         secureTextEntry={isShow ? true : false}
  //         underlineColorAndroid="transparent"
  //         // autoCapitalize='none'
  //         ref={this.props.innerRef}
  //         {...newProps}
  //         onChangeText={(text) => {
  //           this.setState({
  //             value: text
  //           });
  //           if (this.props.onChangeText) {
  //             this.props.onChangeText(text);
  //           }
  //         }}
  //         onTouchStart={() => this.changed = false}
  //         value={value}
  //         selection={this.getSelection(preSelection, selection)}
  //         onSelectionChange={({ nativeEvent: { selection } }) => {
  //           if (selection.start === 0 && this.changed) {
  //             this.preV = value;
  //             this.isLock = 0;
  //             this.setState({
  //               value: value + ' '
  //             });
  //             return;
  //           }
  //           this.setState({ selection })
  //         }}
  //       />
  //     );
  //   }
  // }

  getSelection = (pre, selection) => {
    if (this.isUpdated) {
      this.isUpdated = false;
      return pre;
    } else {
      return selection;
    }
  }

  componentDidUpdate() {
    if (this.isLock == 1) {
      setTimeout(() => {
        this.setState({
          value: this.state.value.toString().trim()
        })
      }, 0);
      this.isLock = 1;
    } else if (this.isLock == 0) {
      setTimeout(() => {
        this.isLock = -1;
        this.isUpdated = true;
        this.changed = false;
        let { start, end } = this.state.selection;
        if (start > 0 && end > 0 && start < this.state.value.length && end < this.state.value.length) {
          start++;
          end++;
        }
        const selection = { start, end };
        this.setState({
          value: this.state.value.toString().trim(),
          preSelection: selection,
          selection
        });
      }, 0)
    }
  }
}

export default TextInputForm = React.forwardRef((props, ref) => {
  return (
    <CustomTextInput innerRef={ref} {...props} />
  )
})

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  sub_container: {
    // alignItems: 'center',
    justifyContent: 'center',
    // flexDirection: 'row',
    // paddingLeft: 16,
  },
  title: {
    marginBottom: 4,
    color: Colors.gray_2,
    // fontFamily: Fonts.hiraKakuProW6,
  },
  text_input: {
    paddingHorizontal: 16,
    // fontFamily: Fonts.hiraKakuProW6,
    fontSize: 14,
  },
  text_input_secure: {
    flex: 1,
    color: Colors.black_1,
    // fontFamily: Fonts.hiraKakuProW6,
    fontSize: 14,
  },
  image: {
    marginHorizontal: 16
  },
  viewTitle: {
    // flex: 1,
    flexDirection: 'row'
  }
});