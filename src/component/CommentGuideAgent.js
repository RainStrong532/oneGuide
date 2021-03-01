import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, SectionList, Keyboard, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import { Navigation } from 'react-native-navigation';
import {
  viewPhoto,
  gotoPostDetail,
  showMoreOptionsPost,
  showSharePost,
  backScreen,
  showModalSharePost,
  showModalPostCreate,
  pushListLocation,
  pushToUserProfile,
  showModalComment,
  gotoCameraRollScreen,
  showModalLikeList,
  showModalApplyList,
  pushToAccountVerify
} from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import _ from 'lodash'
import Device from '../modules/Device'
import DismissKeyboard from 'dismissKeyboard';
import PostHeaderView from './post-views/PostHeaderView'
import PostContentView from './post-views/PostContentView'
import PostActionView from './post-views/PostActionView'
import PostImageView from './post-views/PostImageView'
import PostTourView from './post-views/PostTourView'
import PostShareView from './post-views/PostShareView'
import PostLikeCommentCountView from './post-views/PostLikeCommentCountView'
import PostLikeReplyActionView from './post-views/PostLikeReplyActionView'
import PostCommentView from './post-views/PostCommentView'
import InputMessageView from './views/InputMessageView'
import { Loading, i18next } from '../utils';
import CommonStyles from '../constants/styles'
import StringUtils from '../utils/StringUtils'
import Helper from '../utils/Helper';
import ImageUtils from '../utils/ImageUtils'
import SocketManager from '../modules/SocketManager'


const VIEW_MORE_REPLIES = 'ViewMoreReplies'
const VIEW_PREV_COMMENT = 'ViewPrevComment'
const FAKE_COMMENT_ID = 'fakeComment'

const viewMoreRepliesObject = {
  comment_id: VIEW_MORE_REPLIES,
  value: VIEW_MORE_REPLIES,
  page: 1,
  loading: false
}


const viewPrevCommentObject = {
  comment_id: VIEW_PREV_COMMENT,
  value: VIEW_PREV_COMMENT,
}

export default class PostDetailComponent extends Component {

  static options(passProps) {
    return {
      statusBar: {
        backgroundColor: 'transparent',
        visible: true,
        style: 'dark'
      },
    };
  }

  constructor(props) {
    super(props);

    // bind
    Navigation.events().bindComponent(this);
    this.onPressBack = this.onPressBack.bind(this)
    this.renderHeader = this.renderHeader.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
    this.renderEmpty = this.renderEmpty.bind(this)
    this.renderSectionHeader = this.renderSectionHeader.bind(this)
    this.keyboardDidShow = this.keyboardDidShow.bind(this)
    this.keyboardDidHide = this.keyboardDidHide.bind(this)
    this.getComment = this.getComment.bind(this)
    this.onPressSendMessage = this.onPressSendMessage.bind(this)
    this.scrollToEnd = this.scrollToEnd.bind(this)
    this.onPressReplyComment = this.onPressReplyComment.bind(this)
    this.doGetListReplyComment = this.doGetListReplyComment.bind(this)
    this.onPressLikeComment = this.onPressLikeComment.bind(this)
    this.onPressLoadPrevComment = this.onPressLoadPrevComment.bind(this)

    // set state
    const postDetail = _.get(props, 'data.comment')
    this.page = 1
    this.reply_comment = null
    this.state = {
      comments: [],
      isLoadMore: true,
      isLoadPrevMore: false,
      reply_name: null,
      postDetail,
      content: '',
      isEdit: false,
      listReplyComment: '',
      isLike: '',
      firstTime: true
    }
  }
  componentDidMount() {

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );

    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );
  }

  componentDidAppear() {

    if (!this.didAppearFirst) {
      this.didAppearFirst = true
      this.doGetPostDetail()
      this.doGetListCommentPost(this.page)

      const showKeyboard = _.get(this.props, 'options.showKeyboard')
      if (showKeyboard) {
        this.inputMessageView.focus()
      }
    }

  }

  static getDerivedStateFromProps(props, state) {

    // const comment_id = _.get(state, 'postDetail.comment_id')
    // let postDetail;
    // if (props.posts) {
    //   postDetail = _.find(props.posts.newfeeds, { comment_id });
    // }
    // if (postDetail && !_.isEqual(postDetail, state.postDetail)) {
    //   console.log("12334", postDetail);
    //   return {
    //     ...state,
    //    // postDetail
    //   }
    // }
    // console.log("calllll");
    if (props.data
      //&& state.firstTime
    )
      return {
        ...state,
        // postDetail: props.data.comment,
        //firstTime: false,
      }
    // return {
    //   ...state 
    // };
  }

  componentDidDisappear() {
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow() {
    if (this.sectionList) {
      // setTimeout(this.scrollToEnd, 0)
    }
  }

  keyboardDidHide() {
    // this.reply_comment_id = null
    // this.setState({
    //   reply_name: null
    // })
  }

  scrollToEnd = () => {
    try {
      const comments = this.state.comments
      const sectionIndex = comments.length - 2
      //const sectionIndex = comments.length - 1

      if (comments.length === 1) {
        this.scrollToLocation(0, 0)
      }

      if (sectionIndex < 0) {
        return
      }
      // const itemIndex = comments[sectionIndex].data.length - 1

      // if (itemIndex < 0) {
      //   return
      // }
      this.scrollToLocation(sectionIndex, 1) //Scroll to bottom of selected section
    } catch (error) {

    }

  }

  scrollToLocation = (sectionIndex, itemIndex) => {

    this.sectionList.scrollToLocation({
      animated: true,
      sectionIndex,
      itemIndex,
      viewPosition: 1
    })
  }

  // getPost = (comment_id) => {
  //   let post = _.find(this.props.posts.newfeeds, { comment_id });
  //   if (!post) {
  //     post = _.get(this.props, 'data.comment')
  //   }
  //   return post
  // }

  getComment = (comment_id) => {
    let comments = this.state.comments
    const index = _.findIndex(comments, function (cmt) { return cmt.header.comment_id === comment_id });
    let comment = comments[index]
    return comment
  }

  doGetPostDetail = () => {
    // if (!this.props.data.isNotifycation)
    //   return


    const comment_id = _.get(this.state, 'postDetail.comment_id')
    // request
    this.props.commentDetail(comment_id)
      .then(response => {
        // console.log("response", response);
        const comment = _.get(response, 'data.data.comments')
        this.setState({
          // postDetail: comment
        })
      })
      .catch(error => {
      });
  }


  doGetListCommentPost = (page) => {
    const comment_id = _.get(this.state, 'postDetail.comment_id')
    const total_comments = parseInt(_.get(this.state, 'postDetail.total_comments')) || 0

    // request
    this.props.getListCommentPost(comment_id, page)
      .then(comment_data => {
        // new comments

        const newComments = _.map(comment_data, function (comment) {

          let replies = comment.replies || []

          if (comment.total_comment > replies.length) {
            replies.push(_.cloneDeep(viewMoreRepliesObject))
          }

          return { header: comment, data: replies }
        })
        _.reverse(newComments)

        // current comments
        let comments = this.state.comments || []
        _.remove(comments, function (n) {
          return n.header.comment_id === VIEW_PREV_COMMENT
        });
        comments = newComments.concat(comments)


        // check load prev
        if (total_comments > comments.length) {
          const viewPrevCmt = { header: viewPrevCommentObject, data: [] }
          comments.splice(0, 0, viewPrevCmt)
        }


        this.setState({
          comments,
          isLoadMore: false,
          isLoadPrevMore: false
        })

        this.page += 1
      })
      .catch(error => {
      });
  }

  doGetListReplyComment = (page, comment_id) => {

    // request
    this.props.getListReplyComment(comment_id, page)
      .then(replyComments => {

        let comments = this.state.comments
        const index = _.findIndex(comments, function (cmt) { return cmt.header.comment_id === comment_id });
        let comment = comments[index]

        // replies
        let replies = comment.data.map(item => {
          return { ...item, parentId: comment_id, }
        }) || []
        if (page === 1) {
          replies = []
        }

        _.remove(replies, function (n) {
          return n.value === VIEW_MORE_REPLIES
        });
        const newReplyComments = replyComments.map(item => {
          return { ...item, parentId: comment_id, }
        })
        replies = replies.concat(newReplyComments)
        if (parseInt(comment.header.total_comment) > replies.length) {
          replies.push({ ..._.cloneDeep(viewMoreRepliesObject), page: page + 1 })
        }

        comment = { ...comment, data: replies }
        comments.splice(index, 1, comment);

        this.setState({
          comments
        })
      })
      .catch(error => {
      });
  }

  doLikePost = (comment_id) => {

    // request
    this.props.likePost(comment_id)
      .then(data => {
        //console.log("response sau khi call API", data);
        const newLikePost = data.find(item => item.comment_id === comment_id)
        // console.log("12345678", newLikePost);
        this.setState({
          postDetail: newLikePost,
        })
      })
      .catch(error => {
      });
  }

  doLikeComment = (section) => {

    const comment_id = section.header.comment_id

    let comments = this.state.comments
    const index = _.findIndex(comments, function (cmt) { return cmt.header.comment_id === comment_id });
    let comment = _.cloneDeep(comments[index])

    // request
    this.props.likeComment(comment_id)
      .then(like_comment => {

        let total_likes = parseInt(comment.header.total_likes) || 0
        if (like_comment === 'active') {
          total_likes = total_likes + 1
        } else {
          total_likes = total_likes - 1
        }

        comment.header.total_likes = total_likes
        comment.header.like_comment = like_comment
        comments.splice(index, 1, comment);

        this.setState({
          comments
        })

      })
      .catch(error => {
      });
  }


  doLikeReplyComment = (item, section, itemIndex) => {

    const comment_id = item.comment_id

    let comments = this.state.comments
    const index = _.findIndex(comments, function (cmt) { return cmt.header.comment_id === section.header.comment_id });
    let comment = _.cloneDeep(comments[index])
    let itemTemp = _.cloneDeep(item)
    // request
    this.props.likeComment(comment_id)
      .then(like_comment => {

        let total_likes = parseInt(itemTemp.total_likes) || 0
        if (like_comment === 'active') {
          total_likes = total_likes + 1
        } else {
          total_likes = total_likes - 1
        }

        itemTemp.total_likes = total_likes
        itemTemp.like_comment = like_comment

        let replies = comment.data || []
        replies.splice(itemIndex, 1, itemTemp);
        comment = { ...comment, data: replies }
        comments.splice(index, 1, comment);

        this.setState({
          comments
        })

      })
      .catch(error => {
      });
  }
  //creat comment
  doCreateComment = (data) => {
    const { user_id } = this.props.user.me
    let comments = this.state.comments
    // request
    this.props.createComment(data)
      .then(comment => {
        // remove fake comment
        _.remove(comments, function (n) {
          return (n.header.comment_id === FAKE_COMMENT_ID)
        });

        const replies = comment.replies || []
        const cmt = { header: { ...comment, user_id }, data: replies }
        comments.push(cmt)
        this.setState({
          comments
        })
        SocketManager.sendComment()
      })
      .catch(error => {
        // remove fake comment
        _.remove(comments, function (n) {
          return (n.header.comment_id === FAKE_COMMENT_ID)
        });

        this.setState({
          comments
        })
      });
  }

  doCreateReplyComment = (data) => {

    const comment_id = _.get(data, 'parent_id')
    let comments = this.state.comments
    const index = _.findIndex(comments, function (cmt) { return cmt.header.comment_id === comment_id });
    let comment = comments[index]
    let replies = comment.data || []

    // request
    this.props.createReplyComment(data)
      .then(replyComment => {

        const replyCommentNew = { ...replyComment, user_id: this.props.user.me.user_id, parentId: comment_id }
        _.remove(replies, function (n) {
          return (n.value === VIEW_MORE_REPLIES || n.comment_id === FAKE_COMMENT_ID)
        });
        replies.push(replyCommentNew)
        comment.header.total_comment = (parseInt(comment.header.total_comment) || 0) + 1
        if (parseInt(comment.header.total_comment) > replies.length) {
          replies.push(_.cloneDeep(viewMoreRepliesObject))
        }

        comment = { ...comment, data: replies, }
        comments.splice(index, 1, comment);

        this.setState({
          comments
        })

      })
      .catch(error => {
        // remove fake comment
        _.remove(replies, function (n) {
          return (n.comment_id === FAKE_COMMENT_ID)
        });

        comment = { ...comment, data: replies }
        comments.splice(index, 1, comment);

        this.setState({
          comments
        })


      });
  }

  onPressBack = () => {
    backScreen(this.props.componentId)
  }

  onPressLikeButton = () => {

    const comment_id = _.get(this.state, 'postDetail.comment_id')
    //console.log("call lann 2", comment_id);
    this.doLikePost(comment_id)
  }

  onPressCommentButton = (data) => {
    this.reply_comment = null
    this.inputMessageView.focus()
    this.setState({
      reply_name: null
    })
  }

  onPressSharePostButton = (data) => {
    gotoPostDetail(this.props.componentId, { comment: data })
  }

  onPressSendMessage = () => {
    const content = this.inputMessageView.getText().trim()
    if (!content) {
      return
    }

    const comment_id = _.get(this.reply_comment, 'comment_id') || _.get(this.state, 'postDetail.comment_id')
    const content_url = _.get(this.reply_comment, 'link') || _.get(this.state, 'postDetail.link')
    const dataBody = {
      content_url,
      parent_id: comment_id,
      typecomment: 'text',
      content: StringUtils.formatNewline(content)
    }


    const fakeComment = {
      comment_id: FAKE_COMMENT_ID,
      content,
      display_name: this.props.user.me.username,
      avatar: this.props.user.me.avatar,
      isLongText: false
    }

    let comments = this.state.comments
    // create reply comment
    if (this.reply_comment) {

      // const comment_id = this.reply_comment
      const index = _.findIndex(comments, function (value) { return value.header.comment_id === comment_id });
      let comment = comments[index]
      let replies = comment.data || []
      _.remove(replies, function (n) {
        return n.value === VIEW_MORE_REPLIES
      });
      replies.push(fakeComment)

      if (parseInt(comment.header.total_comment) >= replies.length) {
        replies.push(_.cloneDeep(viewMoreRepliesObject))
      }

      comment = { ...comment, data: replies }
      comments.splice(index, 1, comment);

      this.setState({
        comments
      }, (finished) => {
        setTimeout(() => {
          this.scrollToLocation(index, replies.length)
        }, 400);
      })

      // request
      setTimeout(() => {
        this.doCreateReplyComment(dataBody)
      }, 1000);

    } else { // create comment

      const fakeCmt = { header: fakeComment, data: [] }
      comments.push(fakeCmt)

      this.setState({
        comments
      }, (finished) => {
        setTimeout(this.scrollToEnd, 400)
      })

      // request
      setTimeout(() => {
        this.doCreateComment(dataBody)
      }, 1000);
    }
    this.setState({
      content: ''
    })
    this.inputMessageView.clear()

  }

  onPressImage = (index) => {

    const comment = this.state.postDetail

    const photo = _.get(comment, 'photo')
    viewPhoto({ index, photo })
  }

  onPressLoadMoreReply = ({ item, section, index }) => {
    const comment_id = section.header.comment_id
    item.loading = true
    this.setState({ comments: this.state.comments })

    this.doGetListReplyComment(item.page || 1, comment_id)

  }

  onPressLoadPrevComment = () => {
    this.setState({
      isLoadPrevMore: true
    })

    this.doGetListCommentPost(this.page)
  }

  onPressReplyComment = ({ section, itemIndex }, replyComment) => {
    this.reply_comment = _.cloneDeep(section.header)
    const reply_name = replyComment ? _.get(section, `data[${itemIndex}].display_name`) : section.header.display_name
    this.setState({
      reply_name
    })
    this.inputMessageView.focus()

    const index = _.findIndex(this.state.comments, function (value) { return value.header.comment_id === section.header.comment_id });
    setTimeout(() => {
      this.scrollToLocation(index, itemIndex)
    }, 400);
  }

  onPressRemoveReply = () => {
    this.reply_comment = null
    this.setState({
      reply_name: null
    })

  }

  onPressLikeComment = ({ section }) => {
    this.doLikeComment(section)
  }

  onPressLikeReplyComment = ({ item, section, index }) => {
    this.doLikeReplyComment(item, section, index)
  }

  onPressMoreOptionsButton = () => {
    DismissKeyboard()
    const comment = this.state.postDetail

    const callback = (type) => {
      // if (type === 'DELETE_DONE') {
      //   this.onPressBack()
      // }
      if (type === 'SAVE_DONE') {
        this.onPressBack()
      }

      if (type === 'edit') {
        showModalPostCreate(type, comment.comment_id)
      } else if (type === 'delete') {
        this.showAlertDeletePost(comment)
      }
    }

    const user_me = _.get(this.props, 'user.me')
    showMoreOptionsPost(comment, user_me, callback)
  }

  onPressShareButton = () => {
    DismissKeyboard()
    const comment = this.state.postDetail
    const callback = (type) => {
      if (type === 'WRITE_POST') {
        showModalSharePost(comment, (type) => {
          this.onPressBack()
        })
      }
    }

    const user_me = _.get(this.props, 'user.me')
    showSharePost(comment, user_me, callback)
  }

  deleteComment = (value) => {
    const comment_id = value.comment_id
    this.props.deleteComment(value.comment_id)
      .then(response => {
        let newComments

        if (value.parentId) {
          newComments = this.state.comments.map(item => {
            if (item.header.comment_id === value.parentId) {

              return { ...item, data: item.data.filter(reply => reply.comment_id !== comment_id) }
            }
            return item
          })
        } else {
          newComments = this.state.comments.filter(item => item.header.comment_id !== comment_id);
          if (newComments.length >= postDetail.total_comments) {
            _.remove(newComments, function (n) {
              return n.header.comment_id === VIEW_PREV_COMMENT
            });
          }
        }

        this.setState({
          comments: newComments,
        })
      })
  }

  editComment = (data) => {

    //   //call API

    this.props.editComment(data)
      .then(response => {

        //let commentEdit = response;
        let arr = this.state.comments;
        //edit replyComment
        if (data.parentId == response.data.data.comment.parent_id) {
          const commentEdit = arr.findIndex(item => item.header.comment_id == response.data.data.comment.parent_id)

          const idx = arr[commentEdit].data.findIndex(el => el.comment_id == response.data.data.comment.comment_id)

          arr[commentEdit].data[idx] = { ...arr[commentEdit].data[idx], content: response.data.data.comment.content }

        }
        //edit comment
        else {
          const commentEdit = arr.findIndex(item => item.header.comment_id == response.data.data.comment.comment_id)
          if (arr[commentEdit]) {

            arr[commentEdit] = {
              ...arr[commentEdit], header: {
                ...arr[commentEdit].header,
                content: response.data.data.comment.content
              }
            }
          }
          else {
            this.onPressSendMessage()

          }
        }
        this.setState({
          comments: arr,
          content: '',
          isEdit: false
        })
      })
    Keyboard.dismiss()
  }

  onPressComment = (value) => {

    const callback = (type) => {
      if (type === 'EDIT_COMMENT') {
        // show content comment on inputText 
        this.setState({
          content: {
            value: value.content,
            //check comment_id
            comment_id: value.comment_id,
            parentId: value.parentId
          },
          isEdit: true,

        }, () => {

          const showKeyboard = _.get(this.props, 'options.showKeyboard')
          if (showKeyboard) {
            this.inputMessageView.focus()
          }
        })

      }
      if (type === 'DELETE_COMMENT') {
        this.deleteComment(value)
      }
    }
    const { user_id } = this.props.user.me
    if (user_id === value.user_id) {
      showModalComment(value, callback)
    }
    DismissKeyboard()
  }

  onPressTourLocation = (data) => {
    if (data.location) {
      const locations = data.location.split('-')
      pushListLocation(this.props.componentId, { locations })
    }
  }

  onPressAvatarButton = (data) => {
    pushToUserProfile(this.props.componentId, data)
  }

  showAlertDeletePost = (comment) => {
    Helper.showAlert('', i18next.t('AreYouSureDeletePost'),
      [
        { text: i18next.t('Cancel'), onPress: null },
        {
          text: i18next.t('Ok'), onPress: () => {
            this.setState({ showOptions: false },
              () => {
                const comment_id = _.get(comment, 'comment_id')
                this.doDeleteComment(comment_id)
              })
          }
        }
      ]
    )
  }

  doDeleteComment = (comment_id) => {
    Loading.showHud()

    // request
    this.props.deletePost(comment_id)
      .then(data => {
        Loading.hideHud()
        this.onPressBack()
      })
      .catch(error => {
        Loading.hideHud()
      });
  }

  handleAvatar = (value) => {
    pushToUserProfile(this.props.componentId, { ...value, onPressApplyButton: this.applyPost })
  }
  //ddax hoat động
  // handleApply = () => {
  //   console.log("propshere", this.props);
  //   if (this.props.data.onPressApplyButton) {
  //     this.props.data.onPressApplyButton(this.props.data)

  //   }
  // }

  //apply button on Tour




  onPressCancelPhotos = () => {
    return
  }
  onPressDonePhotos = (photos) => {
    if (photos.length === 0) {
      return
    }
    this.all_photos = _.cloneDeep(photos);

    let photoUploading = this.all_photos[0]


  }

  onPressAddImage = () => {
    //TODO
  }

  handleChange = (text) => {

    this.setState({
      content: {
        value: text.value,
        comment_id: text.comment_id,
        parentId: text.parentId
      }
    })
  }

  onPressLikeList = () => {
    //("calll like list", this.props);

    showModalLikeList(this.props.componentId, this.props.data)
  }

  pushToAccountVerify = () => {
    pushToAccountVerify(this.props.componentId);
  }
  //apply tour 
  applyPost = () => {
    const is_verify = _.get(this.props, 'user.me.is_verify');
    if (is_verify.toString() === "0") {
      Helper.showAlert('', i18next.t('NeedToVerify'),
        [
          { text: i18next.t(i18next.t('Cancelled')), onPress: null },
          { text: i18next.t(i18next.t('verify')), onPress: this.pushToAccountVerify }
        ])
      return;
    }
    if (is_verify.toString() === "2") {
      Helper.showAlert('', i18next.t('AccountWaitVerify'),
        [
          { text: i18next.t(i18next.t('OK')), onPress: null },
        ])
      return;
    }
    // console.log("call here", this.props);
    // console.log("post", this.state.postDetail);
    const comment = this.state.postDetail
    // const { data } = this.props

    const user_id = this.props.user.me.user_id
    const user_id_create_tuor = comment.user_id

    const comment_id = comment.comment_id

    if (user_id !== user_id_create_tuor) {
      if (comment.apply) {

        const apply_type = comment.apply.type || ''

        if (apply_type.toString() === '4') {
          return
        }
      }

      const user_apply = comment.user_apply

      if (user_apply === 'active') {


        Helper.showAlert('', i18next.t('DoYouWantToCancelThisTour'),
          [
            {
              text: i18next.t('Ok'),
              onPress: () => {

                this.doApplyPost(comment_id)
              },
              style: 'destructive'
            },
            {
              text: i18next.t('No'), onPress: () => {
              },
            },
          ]
        )
      } else {

        this.doApplyPost(comment_id)
      }

    }
    else {
      showModalApplyList(this.props.componentId, { comment_id }, '')
    }
  }

  doApplyPost = (comment_id) => {

    Loading.showHud()

    // request
    this.props.applyPost(comment_id)
      .then(data => {
        if (data.currentComments) {
          const newPost = data.currentComments.find(item => item.comment_id === comment_id)
          this.setState({
            postDetail: newPost
          })
        }

        Loading.hideHud()

        if (data.error) {
          // console.log("call error", data.messages);
          Helper.showAlert('',
            JSON.stringify(data.messages),
            [
              {
                text: 'OK', onPress: () => {
                }
              }
            ]
          )
        }
      })
      .catch(error => {
        Loading.hideHud()

        if (error) {
          Helper.showAlert('', error,
            [
              {
                text: 'OK', onPress: () => {
                }
              }
            ]
          )
        }

      });
  }


  render() {
    const statusBarHeight = Device.statusBarSize().height
    const comment = this.state.postDetail
    const { comments, reply_name } = this.state
    return (
      <View style={[{ marginTop: statusBarHeight }, styles.container]}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {this.renderBackButton()}
          <PostHeaderView
            data={comment}
            onPressSharePostButton={this.onPressSharePostButton}
            onPressMoreOptionsButton={this.onPressMoreOptionsButton}
            onPressAva={this.handleAvatar}
          />
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: 'column', }}
          behavior='padding'
          keyboardVerticalOffset={statusBarHeight}
        >

          <SectionList
            bounces={false}
            extraData={{ comment, comments }}
            ref={(sectionList) => this.sectionList = sectionList}
            stickySectionHeadersEnabled={false}
            onScrollToIndexFailed={() => { }}
            sections={comments}
            keyExtractor={this.keyExtractor}
            ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            renderSectionHeader={this.renderSectionHeader}
            renderItem={this.renderItem}
            ListEmptyComponent={this.renderEmpty}
            keyboardShouldPersistTaps='handled'
          />
          <InputMessageView
            ref={ref => this.inputMessageView = ref}
            reply_name={reply_name}
            mentions={[reply_name]}
            onPressSendMessage={this.onPressSendMessage}
            onPressRemoveReply={this.onPressRemoveReply}
            onPressAddImage={this.onPressAddImage}
            content={this.state.content}
            isEdit={this.state.isEdit}
            onChangeText={this.handleChange}
            editComment={this.editComment}
            iscomment
          />
        </KeyboardAvoidingView>
      </View>
    )
  }

  keyExtractor = (item, index) => item['comment_id'].toString() + index.toString();
  renderBackButton() {
    return (
      <TouchableOpacity
        // style={{
        //   justifyContent: 'center',
        //   alignItems: 'center',
        //   marginTop: 20,
        //   height: 40,
        //   width: 40
        // }} 
        onPress={this.onPressBack} >
        <Image
          source={Images.back}
          resizeMode='center'
          style={{
            flex: 1,
            marginLeft: 5,
            height: 16,
            width: 16,
            marginTop: 5,
            justifyContent: 'center',
            tintColor: Colors.black_1
          }}></Image>
      </TouchableOpacity>
    );
  }

  renderHeader() {
    // const comment_id = _.get(this.props, 'data.comment.comment_id')
    // const comment = this.getPost(comment_id)
    const comment = this.state.postDetail

    const photos = _.get(comment, 'photo.photos')
    const detailCommentShare = _.get(comment, 'detailCommentShare')
    return (
      <View style={{ flexDirection: 'column' }}>
        <PostTourView
          data={comment}
          showFull={true}
          onPressTourLocation={this.onPressTourLocation}
        // share

        />
        <PostContentView
          data={comment}
          showFull={true}
          isContent
        />
        <PostImageView
          photos={photos}
          style={{ marginBottom: 8 }}
          onPressImage={this.onPressImage}
        />
        <PostShareView
          data={detailCommentShare}
          componentId={this.props.componentId}
          share

        />
        <PostLikeCommentCountView
          data={comment}
          onPressLikeList={this.onPressLikeList}
        />
        <PostActionView
          data={comment}
          style={{ marginBottom: 8 }}
          onPressLikeButton={this.onPressLikeButton}
          onPressCommentButton={this.onPressCommentButton}
          onPressShareButton={this.onPressShareButton}
          componentId={this.props.componentId}
          me={this.props.user.me.user_id}
          applyPost={this.applyPost}
          onPressApplyButton={this.applyPost}
        />
      </View>
    );
  }

  renderSectionHeader = (info) => {
    if (info.section.header.comment_id === VIEW_PREV_COMMENT) {
      return this.renderShowPrevCommentView()
    }

    const fakeComment = info.section.header.comment_id === FAKE_COMMENT_ID
    const liked = (info.section.header.like_comment === 'active')

    return (
      <View>
        <PostCommentView
          data={info.section.header}
          onPressAvatarButton={this.onPressAvatarButton}
          // user_me={this.props.user.me.user_id}
          onPressComment={this.onPressComment}
        />
        {
          fakeComment ? <Text style={{ marginLeft: 65, height: 40 }}>{i18next.t('Posting')}</Text> :
            <PostLikeReplyActionView
              liked={liked}
              onPressReply={() => {
                this.onPressReplyComment({ section: info.section, itemIndex: 0 })
              }}
              onPressLike={() => {
                this.onPressLikeComment({ section: info.section })
              }}
            />
        }
      </View>
    )
  }

  renderItem = ({ item, section, index }) => {

    const fakeComment = item.comment_id === FAKE_COMMENT_ID

    if (item.value === VIEW_MORE_REPLIES) {
      return this.renderViewMoreView({ item, section, index })
    }

    const liked = (item.like_comment === 'active')
    return (
      <View>
        <View style={{ flex: 1, marginLeft: 40, }}>
          <PostCommentView
            data={item}
            isReplyComment={true}
            onPressAvatarButton={this.onPressAvatarButton}
            //user_me={this.props.user.me.user_id}
            onPressComment={this.onPressComment}
          />
          {
            fakeComment ? <Text style={{ marginLeft: 65, height: 40 }}>{i18next.t('Posting')}</Text> :
              <PostLikeReplyActionView
                liked={liked}
                onPressReply={() => {
                  this.onPressReplyComment({ section, itemIndex: index }, true)
                }}
                onPressLike={() => {
                  this.onPressLikeReplyComment({ item, section, index })
                }}
              />
          }

        </View>
      </View>
    )
  }

  renderFooter() {

    const { isLoadMore } = this.state
    if (!isLoadMore) {
      return null
    }

    return (<View style={{ height: 40, justifyContent: 'center' }}>
      <ActivityIndicator animating size="small" color={Colors.gray} />
    </View>)
  }

  renderEmpty() {

    const { isLoadMore } = this.state
    if (isLoadMore) {
      return null
    }

    return (<View style={{ flex: 1, justifyContent: 'center', marginTop: 10 }}>
      <Image
        source={Images.comment_not_null_end}
        style={{ alignSelf: 'center', width: 100, height: 100, tintColor: '#EEECEC' }}
      ></Image>
      <Text style={{ padding: 10, fontSize: 14, color: Colors.black_1, textAlign: 'center' }}>
        {i18next.t('ThereIsNoComments')}
      </Text>
    </View>)
  }

  renderShowPrevCommentView() {
    const { isLoadPrevMore } = this.state

    return (
      <View style={{ flex: 1, height: 30, justifyContent: 'center', marginLeft: 15 }} >
        {
          isLoadPrevMore ?
            <ActivityIndicator style={{}} animating size="small" color={Colors.gray} /> :
            <TouchableOpacity onPress={this.onPressLoadPrevComment}>
              <Text style={{ fontSize: 14, color: Colors.black, fontWeight: 'bold' }}>
                {i18next.t('ShowPreviousComments')}
              </Text>
            </TouchableOpacity>
        }
      </View>
    )
  }

  renderViewMoreView({ item, section, index }) {

    return (
      <View style={{ flex: 1, marginLeft: 65, height: 30 }} >
        {
          item.loading ?
            <ActivityIndicator style={{ marginRight: 20 }} animating size="small" color={Colors.gray} /> :
            <TouchableOpacity onPress={() => { this.onPressLoadMoreReply({ item, section, index }) }}>
              <Text style={{ fontSize: 12, color: Colors.black, fontWeight: 'bold' }}>
                {i18next.t('ShowMoreReplies')}
              </Text>
            </TouchableOpacity>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  image_bg: {
    position: 'absolute',
    alignSelf: 'center',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  logo_text: {
    position: 'absolute',
    alignSelf: 'center',
  },
  activityIndicator: {
    marginTop: 100
  },
})
