import { connect } from 'react-redux';
import {
  getNewPosts, likePost,
  createPost, applyPost, deletePost, findUser,
  sendEmail, getRecommenFriend, addFriend,
  getListNotifications,
  addPostStorage,
  // callAPITEST,
  getCheckIn,
  likePostSearch,
  likeTourSearch,
  SearchAllUser,
  // likeTotalPost
  joinGroupContainer,
  getInfomationGroup,
  joinGroupSearch,
  outGroupSearch,

  // joinGroupContainer

} from '../actions';

import HomeComponent from '../component/HomeComponent'
const mapStateToProps = state => {
  const { user, posts, notification, recommend, app, tours } = state
  // //const user = state.user
  return {
    user: user || null,
    //user: user
    posts,
    notification,
    recommend,
    listPost: posts && posts.listPostSearch ? posts.listPostSearch : [],
    listTour: posts && posts.listTourSearch ? posts.listTourSearch : [],
    listUser: posts && posts.listUserSearch ? posts.listUserSearch : [],
    listGroup: posts && posts.listUserGroup ? posts.listUserGroup : [],
    totalUser: posts && posts.totalUser ? posts.totalUser : [],
    //highlights: app && app.highlights ? app.highlights : [],
    highlights_user: app && app.highlights ? app.highlights_user : [],
    Allhighlights: app ? app.Allhighlights : [],
    infoGroup: tours && tours.infoGroup ? tours.infoGroup : []
  };
};

const HomeContainer = connect(
  mapStateToProps,
  {
    getListNotifications,
    getNewPosts,
    likePost,
    createPost,
    applyPost,
    deletePost,
    findUser,
    sendEmail,
    getRecommenFriend,
    addFriend,
    // getListNotifications,
    addPostStorage,
    // callAPITEST,
    getCheckIn,
    likePostSearch,
    likeTourSearch,
    SearchAllUser,
    joinGroupContainer,
    getInfomationGroup,
    joinGroupSearch,
    outGroupSearch,
    // joinGroupContainer
    // likeTotalPost
  }
)(HomeComponent);

export default HomeContainer;
