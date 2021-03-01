import { Navigation } from 'react-native-navigation';

// ScreenName
import ScreenName from './screens-name'

// Container
import LaunchContainer from '../containers/LaunchContainer'
import LoginContainer from '../containers/LoginContainer'
import HomeContainer from '../containers/HomeContainer'
import TourContainer from '../containers/TourContainer'
import InboxContainer from '../containers/InboxContainer'
import ProfileContainer from '../containers/ProfileContainer'
import MoreContainer from '../containers/MoreContainer'
import NotificationContainer from '../containers/NotificationContainer'
import PostListContainer from '../containers/PostListContainer'
import PostDetailContainer from '../containers/PostDetailContainer'
import PostCreateContainer from '../containers/PostCreateContainer'
import SearchContainer from '../containers/SearchContainer'
import SelectProviderContainer from '../containers/SelectProviderContainer'
import RegisterContainer from '../containers/RegisterContainer';
import ViewPhotoContainer from '../containers/ViewPhotoContainer'
import SelectLanguageContainer from '../containers/SelectLanguageContainer';
import ChatContainer from '../containers/ChatContainer';
import TutorialContainer from '../containers/TutorialContainer.js';
import SettingProfileContainer from '../containers/SettingProfileContainer.js';
import RegisterAgentContainer from '../containers/RegisterAgentContainer';
import RegisterGuiderContainer from '../containers/RegisterGuiderContainer';
import UserProfileContainer from '../containers/UserProfileContainer';
import SharePostContainer from '../containers/SharePostContainer';
import SharePostAsLinkContainer from '../containers/SharePostAsLinkContainer';
import FreeDayListContainer from '../containers/FreeDayListContainer';

import ProfileInformationContainer from '../containers/ProfileInformationContainer';
import TourReviewContainer from '../containers/TourReviewContainer';
import CalandarDayFreeContainer from '../containers/CalandarDayFreeContainer';
import AddEventContainer from '../containers/AddEventContainer';
import GalleryContainer from '../containers/GalleryContainer';
import GalleryGroupContainer from '../containers/GalleryGroupContainer';
import PostDetailGroupContainer from '../containers/PostDetailGroupContainer'

// Action sheet
import PostMoreOptionActionSheetContainer from '../component/action-sheet/PostMoreOptionActionSheet'
import PostShareActionSheetContainer from '../component/action-sheet/PostShareActionSheet'
import ModalCommentContainer from '../component/action-sheet/ModalComment'
import ModalCommentContainerPostCheckIn from '../component/action-sheet/ModalPostCheckIn'
import ModalCommentGroupContainer from '../component/action-sheet/VerifyRequest'
import ModalCancelBackGroupContainer from '../component/action-sheet/ModalCancelBackGroup'

// Commponent
// import WebViewComponent from '../component/WebViewComponent';
import CheckInComponent from '../component/CheckInComponent';
import SelectTourTimeComponent from '../component/SelectTourTimeComponent';
import LaunchProfileComponent from '../component/LaunchProfileComponent';
import CameraRollComponent from '../component/CameraRollComponent';
import CameraComponent from '../component/CameraComponent';
import RegisterSelectCardActionSheet from '../component/action-sheet/RegisterSelectCardActionSheet';
import DatePickerActionSheet from '../component/action-sheet/DatePickerActionSheet';
import DateActionSheet from '../component/action-sheet/DateActionSheet'
import LocationListComponent from '../component/LocationListComponent'
import ActionSheet from '../component/action-sheet/ActionSheet'
import CreateAlbum from '../component/photos-view/CreateAlbum'
import ImageGalleryComponent from '../component/photos-view/ImageGalleryComponent'



// View
import { LoadingView } from '../utils'
import UserApplyListContainer from '../containers/UserApplyListContainer';
import SelectOptionContainer from '../containers/SelectOptionContainer';
import PostLikeListContainer from '../containers/PostLikeListContainer';
import PostApplyListContainer from '../containers/PostApplyListContainer';
import UserFriendListContainer from '../containers/UserFriendListContainer';
import PostSavedContainer from '../containers/PostSavedContainer';
import ResetPasswordContainer from '../containers/ResetPasswordContainer';
import ChangePasswordContainer from '../containers/ChangePasswordContainer';
import FriendContainer from '../containers/FriendContainer'
import RatingInfoContainer from '../containers/RatingContainer'
import InvitedUserContainer from '../component/InvitedUserOther'
import ModalCancelPostContainer from '../component/action-sheet/ModalCancelPost';
import CheckInPostContainer from '../containers/PostCheckInContainer';
import ShowImageCheckInContainer from '../containers/ShowImageCheckInContainer';
import PostTripContainer from '../containers/PostTripContainer';
import MoreInfoContainer from '../containers/MoreInfoContainer';
import PublicProfileContainer from '../containers/PublicProfileContainer';
import GuideContainer from '../containers/GuideContainer';
import AgentContainer from '../containers/AgentContainer';
import ProfileLikeContainer from '../containers/ProfileLikeContainer';
import AccountVerificationContainer from '../containers/AccountVerificationContainer';
import GroupContainer from '../containers/GroupContainer';
import HomeGroupContainer from '../containers/HomeGroupContainer';
import InformationGroupContainer from '../containers/InformationGroupContainer';
import SearchAllUserContainer from '../containers/SearchAllUserContainer'
import SearchAllPostContainer from '../containers/SearchAllPostContainer'
import SearchAllTourContainer from '../containers/SearchAllTourContainer'
import PostDetailAgentGuide from '../containers/PostDetailAgentGuide'
import ActiveAccountContainer from '../containers/ActiveAccountContainer';
import AskedToJoinTheGroupContainert from '../containers/AskedToJoinTheGroupContainert';
import PostApprovalContainer from '../containers/PostApprovalContainer';
import GroupMemberContainer from '../containers/GroupMemberContainer';
import InviteMemberContainer from '../containers/InviteMemberContainer'
import DetailPhotosContainer from '../containers/DetailPhotosContainer';
import ModalMoreOptionGallery from '../component/action-sheet/ModalMoreOptionGallery';
import ListTourAgentApplyGuideContainer from '../containers/ListTourAgentApplyGuideContainer';
//hiếu q
import RequestAddFriendListContainer from '../containers/ListRequestAddFriendContainer'
import TermPolicyContainer from '../containers/TermPolicyContainer';

// toàn
import PostDetailHomeGroupContainer from '../containers/PostDetailHomeGroupContainer'
// phong
import ShareGroupContainer from '../containers/ShareGroupContainer'
import AddGuiderContainer from '../containers/AddGuiderContainer'


//
import SelectLanguagInviteGuider from '../containers/SelectLanguagInviteGuider'
import InvitationtoJoinTourContainer from '../containers/InvitationtoJoinTourContainer'
import ListGuideApplyContainer from '../containers/ListGuideApplyContainer';

import ShowModalUserProfileContainer from '../containers/ShowModalUserProfileContainer'
import ListGuideInvitedContainer from '../containers/ListGuideInvitedContainer'
import ListGuideApplyTourContainer from '../containers/ListGuideApplyTourContainer';
import ListGuideTourContainer from '../containers/ListGuideTourContainer'
import DetailTourInvited from '../component/DetailTourInvited';



import TrackingHistoryGuideContainer from '../containers/TrackingHistoryGuideContainer'
import TrackingHistoryAgentContainer from '../containers/TrackingHistoryAgentContainer'
import PostDetailTipContainer from '../containers/PostDetailTipContainer'
import ListGuideUpcomingContainer from '../containers/ListGuideUpcomingContainer';
import ReportContainer from '../containers/ReportContainer'
import SeeAllPostTipContainer from '../containers/SeeAllPostTipContainer'
import ListReportContainer from '../containers/ListReportContainer'
import ReviewContainer from '../containers/ReviewContainer'
import HotPostRelatedContainer from '../containers/TrackingHistoryGuideContainer'
import GuideFinishContainer from '../containers/GuideFinishContainer';
import ModalCommentContainerReport from '../component/action-sheet/ModalReport'
// register screens 
export function registerScreensWithStore(provider, store) {

  // register Component
  Navigation.registerComponent(ScreenName.loading_hud, () => LoadingView)
  Navigation.registerComponent(ScreenName.checkIn, () => CheckInComponent)
  Navigation.registerComponent(ScreenName.select_tour_time, () => SelectTourTimeComponent)
  Navigation.registerComponent(ScreenName.launchProfile, () => LaunchProfileComponent)
  Navigation.registerComponent(ScreenName.cameraroll, () => CameraRollComponent)
  Navigation.registerComponent(ScreenName.register_select_card, () => RegisterSelectCardActionSheet)
  Navigation.registerComponent(ScreenName.camera, () => CameraComponent)
  Navigation.registerComponent(ScreenName.date_picker, () => DatePickerActionSheet)
  Navigation.registerComponent(ScreenName.date, () => DateActionSheet)
  Navigation.registerComponent(ScreenName.location_list_component, () => LocationListComponent)
  Navigation.registerComponent(ScreenName.ActionSheet, () => ActionSheet)
  Navigation.registerComponent(ScreenName.CreateAlbum, () => CreateAlbum)
  Navigation.registerComponent(ScreenName.ImageGalleryComponent, () => ImageGalleryComponent)
  // Navigation.registerComponent(ScreenName.WebViewComponent, () => WebViewComponent)
  Navigation.registerComponent(ScreenName.DetailTourInvited, () => DetailTourInvited)


  // register with Redux
  Navigation.registerComponentWithRedux(ScreenName.launch, () => LaunchContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.login, () => LoginContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.register, () => RegisterContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.home, () => HomeContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.tour, () => TourContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.inbox, () => InboxContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.profile, () => ProfileContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.more, () => MoreContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.notification, () => NotificationContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.post_list, () => PostListContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.post_detail, () => PostDetailContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.post_create, () => PostCreateContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.search, () => SearchContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.select_provider, () => SelectProviderContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.view_photo, () => ViewPhotoContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.post_more_option, () => PostMoreOptionActionSheetContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.select_language, () => SelectLanguageContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.chat, () => ChatContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.tutorial, () => TutorialContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.profile_update, () => SettingProfileContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.register_agent, () => RegisterAgentContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.register_guide, () => RegisterGuiderContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.user_profie, () => UserProfileContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.post_share_action_sheet, () => PostShareActionSheetContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.share_post, () => SharePostContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.share_post_as_link, () => SharePostAsLinkContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.profile_infomation, () => ProfileInformationContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.user_apply, () => UserApplyListContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.select_options, () => SelectOptionContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.like_list_post, () => PostLikeListContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.apply_list_post, () => PostApplyListContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.user_friend_list, () => UserFriendListContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.post_saved, () => PostSavedContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.reset_password, () => ResetPasswordContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.change_password, () => ChangePasswordContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.tour_review_component, () => TourReviewContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.CalandarDayFreeComponent, () => CalandarDayFreeContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.AddEventComponent, () => AddEventContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.FreeDayListComponent, () => FreeDayListContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.modal_comment, () => ModalCommentContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.modal_postcheckin, () => ModalCommentContainerPostCheckIn, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.FriendList, () => FriendContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.RatingInfo, () => RatingInfoContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.InvitedUserOther, () => InvitedUserContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.modal_cancel_post, () => ModalCancelPostContainer, provider, store),
    Navigation.registerComponentWithRedux(ScreenName.PostCheckInComponent, () => CheckInPostContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.ShowImageCheckInComponent, () => ShowImageCheckInContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.PostTrip, () => PostTripContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.MoreInfo, () => MoreInfoContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.PublicProfile, () => PublicProfileContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.Guide_Home, () => GuideContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.Agent_Home, () => AgentContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.Group, () => GroupContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.HomeGroup, () => HomeGroupContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.InformationGroup, () => InformationGroupContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.SearchAllUser, () => SearchAllUserContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.SearchAllTour, () => SearchAllTourContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.SearchAllPost, () => SearchAllPostContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.AccountVerificationComponent, () => AccountVerificationContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.tour_guide_like, () => ProfileLikeContainer, provider, store),
    Navigation.registerComponentWithRedux(ScreenName.GalleryComponent, () => GalleryContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.GalleryGroupComponent, () => GalleryGroupContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.ActiveAccount, () => ActiveAccountContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.GroupPostApproval, () => PostApprovalContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.AskedToJoinTheGroup, () => AskedToJoinTheGroupContainert, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.GroupMembersApproval, () => GroupMemberContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.modal_comment_group_container, () => ModalCommentGroupContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.InviteMemberMe, () => InviteMemberContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.DetailPhotos, () => DetailPhotosContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.MoreOptionGallery, () => ModalMoreOptionGallery, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.PostDetailGroupComponent, () => PostDetailGroupContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.modal_cancel_back_group_post, () => ModalCancelBackGroupContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.DetailGuideAgent, () => PostDetailAgentGuide, provider, store),

    Navigation.registerComponentWithRedux(ScreenName.ListTourAgentApplyGuider, () => ListTourAgentApplyGuideContainer, provider, store)
  //hiếu q

  Navigation.registerComponentWithRedux(ScreenName.request_add_friend_list, () => RequestAddFriendListContainer, provider, store)
  //hieu dang them

  Navigation.registerComponentWithRedux(ScreenName.TermPolicy, () => TermPolicyContainer, provider, store)

  // toàn
  Navigation.registerComponentWithRedux(ScreenName.PostDetailHomeGroup, () => PostDetailHomeGroupContainer, provider, store)

  // phong
  Navigation.registerComponentWithRedux(ScreenName.pushShareGroup, () => ShareGroupContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.AddGuiderComponent, () => AddGuiderContainer, provider, store)


  //

  Navigation.registerComponentWithRedux(ScreenName.SelectLanguageInviteGuider, () => SelectLanguagInviteGuider, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.Invitationtojointour, () => InvitationtoJoinTourContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.ListGuideApply, () => ListGuideApplyContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.ShowModalUserProfile, () => ShowModalUserProfileContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.ListGuideInvited, () => ListGuideInvitedContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.ListGuideApplyTour, () => ListGuideApplyTourContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.ListGuideTour, () => ListGuideTourContainer, provider, store)


  Navigation.registerComponentWithRedux(ScreenName.ShowTrackingHistoryGuide, () => TrackingHistoryGuideContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.ShowTrackingHistoryAgent, () => TrackingHistoryAgentContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.PostDetailTipComponent, () => PostDetailTipContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.ReportComponent, () => ReportContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.SeeAllPostTip, () => SeeAllPostTipContainer, provider, store)

  Navigation.registerComponentWithRedux(ScreenName.ListGuideUpcoming, () => ListGuideUpcomingContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.ListReportComponent, () => ListReportContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.ReviewComponent, () => ReviewContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.ShowHotPostRelateds, () => HotPostRelatedContainer, provider, store)

  Navigation.registerComponentWithRedux(ScreenName.GuideFinishComponent, () => GuideFinishContainer, provider, store)
  Navigation.registerComponentWithRedux(ScreenName.modal_Report, () => ModalCommentContainerReport, provider, store)

}

export default { registerScreensWithStore }