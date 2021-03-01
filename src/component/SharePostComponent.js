import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Picker,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import _ from 'lodash'
import { dimissModal } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import Device from '../modules/Device'
import { i18next, Loading } from '../utils'
import DismissKeyboard from 'dismissKeyboard';
import CommonStyles from '../constants/styles'
import StringUtils from '../utils/StringUtils'
import PostShareView from './post-views/PostShareView'
import HeaderView from './views/HeaderView'
import Helper from '../utils/Helper';

export default class SharePostComponent extends Component {

  static options(passProps) {
    return {
      statusBar: {
        backgroundColor: 'transparent',
        visible: true,
        style: 'light'
      },
      topBar: {
        drawBehind: true,
        visible: false,
      },
    };
  }

  constructor(props) {
    super(props);

    // bind
    Navigation.events().bindComponent(this);
    this.onPressDismiss = this.onPressDismiss.bind(this)
    this.onPressShare = this.onPressShare.bind(this)
    this.doSharePost = this.doSharePost.bind(this)

    // init variables

    this.state = {
      content: '',
      enableShare: true,
      id_group: '0'
    }
  }

  // state = { user: '' }
  updateUser = (user) => {
    this.setState({ id_group: user })
  }
  componentDidMount() {
    this.props.getDatagroup()
  }
  componentDidAppear() {
  }
  componentDidDisappear() {
  }
  onPressShare = () => {
    DismissKeyboard()
    const comment_id = _.get(this.props, 'data.comment_id')
    const content_url = _.get(this.props, 'user.me.url_user')
    let group_id = this.state.id_group
    const parent_id = '0'
    const content = StringUtils.formatNewline(this.state.content) || ''
    let dataBody = {
      content_url,
      parent_id,
      comment_share_id: comment_id,
      typecomment: 'share',
      content,
      group_id
    }
    // console.log('data dataBody', dataBody);
    // create post
    this.doSharePost(dataBody)
  }

  onPressDismiss = () => {
    DismissKeyboard()
    dimissModal(this.props.componentId)
  }

  doSharePost = (data) => {
    // console.log('data dosharepost', data);
    Loading.showHud()
    // request
    this.props.createPost(data)
      .then(data => {

        Loading.hideHud()
        dimissModal(this.props.componentId)
        this.props.callback('SHARE_DONE')

      })
      .catch(error => {
        Loading.hideHud()
      });
  }

  // renderGroups = () => {
  //   if (this.props.listGroupJoined != 'Bạn chưa là thành viên của nhóm nào') {
  //     this.props.listGroupJoined.map((item) => {
  //       return (
  //         <Picker.Item label={item.title} value={item.id} />
  //       )
  //     })
  //   }
  // }


  render() {
    // const [selectedValue, setSelectedValue] = useState("java");
    const { data } = this.props
    const listGroupJoined = _.get(this.props, 'listGroupJoined')
    // console.log(this.state, '111111111111111111111111111111111', listGroupJoined);

    let renderGroups = []
    if (listGroupJoined != 'Bạn chưa là thành viên của nhóm nào') {
      renderGroups = listGroupJoined.map((item) => {
        return (
          <Picker.Item label={item.title} value={item.id} />
        )
      })
    }

    // console.log('renderrrrrrrrrrrrrrrrrrrrrrrr', renderGroups);

    return (
      <View style={[styles.container]} >
        <HeaderView
          title={i18next.t('CreatePost')}
          titleRight={i18next.t('Share')}
          titleLeft={i18next.t('Cancel')}
          tintColor={Colors.white}
          style={{ backgroundColor: Colors.green_1 }}
          onPressLeftBarButton={this.onPressDismiss}
          onPressRightBarButton={this.onPressShare}
        />

        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: 'column' }}
          behavior='padding'
          keyboardVerticalOffset={0} >

          <ScrollView
          // keyboardShouldPersistTaps='always'
          >
            <TextInput
              multiline
              autoFocus={true}
              ref={(textInput) => { this.textInput = textInput }}
              style={[styles.text_input]}
              placeholder={i18next.t('SaySomethingAboutThisPost')}
              selectionColor={Colors.black}
              value={this.state.content}
              onChangeText={(text) => this.setState({
                content: text
              })}
              underlineColorAndroid='transparent'
            />
            <View>

              <Picker
                // style

                selectedValue={this.state.id_group}
                onValueChange={(value) => this.updateUser(value)}
              >
                <Picker.Item label={'Chia sẻ vào trang cá nhân'} value={'0'} />
                {renderGroups}
                {/* {this.renderGroups()} */}
              </Picker>
            </View>

            <PostShareView
              style={{ marginBottom: 10 }}
              data={data}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.white,

  },
  text_input: {
    marginHorizontal: 12,
    marginTop: 20,
    // height: 100,
    minHeight: 40,
    maxHeight: 300,
    marginBottom: 10,
    textAlignVertical: 'top'
  },
})
