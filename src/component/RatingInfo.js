import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Platform,
  RefreshControl
} from 'react-native'
import Images from '../assets/images'
import Colors from '../constants/colors'
import HeaderView from './views/HeaderView';
import DismissKeyboard from 'dismissKeyboard';
import { backScreen, pushToUserProfile } from '../navigation';
import i18next from 'i18next';



export default class RatingInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {

      showSearch: false,
      refreshing: false,
      data: [],
      isLoadMore: true,
      showImg: false,
      dataRatingState: []
      // page: 1
    }
    this.page = 1
    // bind


  }

  componentDidMount() {
    const { user_id } = this.props.data || ''
    let data = {
      page: 1,
      user_id: user_id

    }
    this.setState({ isLoadMore: true })
    this.doGetListPostRating(null, data)


    // setTimeout(() => {
    //   this.setData()

    // }, 2000);
  }
  setData = () => {
    this.setState({
      dataRatingState: this.props.listPostRatingInfo
    })
  }
  renderItem = ({ item, index }) => {
    return (
      <RatingInfoMy
        componentId={this.props.componentId}
        // nextScreenUser={this.nextScreenUser}
        dataRating={item}
        index={index}
      />
    )
  }

  _keyExtractor = (item, idx) => idx.toString()
  doGetListPostRating = (data_, page) => {

    this.props.getListPostRatingInfo(data_, page)
      .then(data => {
        this.page = page.page + 1
        this.setState({
          // data: data,
          refreshing: false,
          isLoadMore: false,
          dataRatingState: this.props.listPostRatingInfo

        })
      })
      .catch(error => {
        this.setState({
          refreshing: false,
          isLoadMore: false,
          dataRatingState: this.props.listPostRatingInfo
        })
      });
  }
  _renderItem = ({ item }) => (
    <View>
    </View>
  )

  onPressBack = () => {
    DismissKeyboard()
    backScreen(this.props.componentId)
  }

  renderBottom = () => {
    const { isLoadMore } = this.state
    return (
      <View style={{ height: 40, justifyContent: 'center' }}>
        {isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
      </View>
    )
  }

  loadMore = () => {
    const { refreshing } = this.state
    const { user_id } = this.props.data || ''
    let data = {
      page: this.page,
      user_id: user_id

    }
    if (this.state.isLoadMore === true) {
      return
    }
    if (refreshing == false) {
      this.setState({ isLoadMore: true }, () => {
        this.doGetListPostRating(null, data)
      })
    }
  }
  pullRefresh = () => {
    const { refreshing, isLoadMore } = this.state;
    if (refreshing) {
      return
    }
    this.page = 1;
    const { user_id } = this.props.data || ''
    let data = {
      page: 1,
      user_id: user_id

    }
    if (isLoadMore == false) {
      this.setState({ refreshing: true }, () => {
        this.doGetListPostRating(null, data)
      })
    }
  }


  render() {
    const { listPostRatingInfo } = this.props || []
    const { refreshing, isLoadMore } = this.state
    return (
      <View style={styles.container}>
        <HeaderView
          title={i18next.t('Review')}
          tintColor={Colors.white}
          style={{ backgroundColor: Colors.green_1 }}
          back={true}
          onPressLeftBarButton={this.onPressBack}

        />
        <FlatList
          keyExtractor={this._keyExtractor}
          onEndReached={this.doGetListPostRating}
          ListFooterComponent={this.renderBottom}
          // onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 10}
          onEndReached={this.loadMore}
          removeClippedSubviews={false}
          data={this.state.dataRatingState}
          renderItem={this.renderItem}
          ListEmptyComponent={
            <View style={{ flex: 1 }}>
              {
                isLoadMore
                  ?
                  <View>

                  </View>
                  :
                  <View style={{ flex: 1, marginTop: 100 }}>

                    <Text style={{
                      textAlign: 'center',
                      marginTop: 10,
                      fontSize: 16,
                      color: '#ADBFD1'
                    }}>{i18next.t('ThereNoReviewsYet')}
                      {/* {i18next.t('No_result')} */}
                    </Text>
                  </View>
              }
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.pullRefresh}
            />
          }
        />
      </View>
    );
  }
}

class RatingInfoMy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: [],
      showDate: true,
    }
  }
  showDataDetail = () => {
    this.setState({
      showDate: !this.state.showDate
    })
  }
  nextScreenUser = () => {
    const { user_id } = this.props.dataRating.user_review || {}
    let dataUser = {
      user_id: user_id
    }
    pushToUserProfile(this.props.componentId, dataUser)
  }
  render() {
    // const { dataRating } = this.props || {}
    const { post, user_review } = this.props.dataRating || {}
    const { rating } = this.props.dataRating || []
    const { content, created_date, time_ago, } = this.props.dataRating || ''
    let dataStarPeople = []
    dataStarPeople = rating.map((star, index) => {
      return (
        <StarEvaluateRating
          dataface={star}
          key={index}
        />
      )
    })
    return (
      <View style={styles.headerView}>
        <View
          style={{
            marginHorizontal: 5,
            marginVertical: 5,
            flexDirection: "row",
            borderBottomWidth: 0.5,
            borderBottomColor: '#D5DBDB'
            // 
          }}
        >
          <TouchableOpacity
            onPress={this.nextScreenUser}
            style={{ flexDirection: 'row', flex: 1 }}>
            <View style={styles.personalPhoto}
            >
              <Image style={styles.image_header_personalPhoto}
                source={{ uri: user_review.avatar }}
              ></Image>
              {user_review.is_agent == "1" ?
                <Image
                  source={Images.logo_flag_header}
                  resizeMode='contain'
                  style={{
                    width: 16.5,
                    height: 16.5,
                    position: 'absolute',
                    bottom: -3,
                    right: 0
                  }}
                /> : null
              }
            </View>
            <View style={{ flex: 1, paddingHorizontal: 5, paddingVertical: 10, marginLeft: 5 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                  color: Colors.black
                }}
              >{user_review.name} </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 5
                }}
              >
                {dataStarPeople}
              </View>
            </View>
          </TouchableOpacity>
          {this.state.showDate ?
            <TouchableOpacity onPress={this.showDataDetail} style={styles.onPressDate

            }>
              <Text style={styles.textRating}>
                {time_ago}
              </Text>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={this.showDataDetail} style={styles.onPressDate}>
              <Text style={styles.textRating}>
                {created_date}
              </Text>
            </TouchableOpacity>
          }



        </View>
        <View>
          <View
            style={styles.titleView}
          >
            <Text
              style={{
                fontWeight: '500',
                fontSize: 17,
                color: 'black'
              }}
            >{post.content}</Text>
            <Text
              style={{
                fontSize: 12, color: '#737a7a'
              }}
            >{post.date_tour}</Text>

          </View>
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              paddingHorizontal: 5,
              paddingTop: 5,
              paddingBottom: 15,
              flex: 1,
              color: 'black',
              fontSize: 14
            }}
          >
            {content}
          </Text>
        </View>
      </View>
    )
  }
}

class StarEvaluateRating extends React.Component {
  render() {
    const { dataface } = this.props || ""
    return (
      <Image
        source={Images.ic_star_yellow}
        resizeMode='contain'
        style={dataface == 1 ? styles.imageStar : styles.imageStarHidden}
      />
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE'
  },
  headerView: {
    backgroundColor: 'white',
    paddingHorizontal: 5,
    marginHorizontal: 5,
    flex: 1,
    marginVertical: 5
  },
  titleView: {
    flex: 1,
    marginHorizontal: 5,
  },
  image_header: {
    width: 30,
    height: 30,
    borderRadius: 25,
  },
  onPressDate: {
    padding: 10,

  },
  textRating: {
    marginTop: 2,
    fontSize: 12,
    color: '#737a7a'
  },
  personalPhoto: {
    height: 45,
    width: 45,
    marginTop: 8,
  },
  image_header_personalPhoto: {
    height: 45,
    width: 45,
    borderRadius: 22.5,
    overflow: 'hidden',

  },
  logo_image_right: {
    position: 'absolute',
    top: 18,
    left: 17,
  },
  imageStar: {
    width: 16,
    height: 16,
    marginRight: 2
  },
  imageStarHidden: {
    width: 16,
    height: 16,
    marginRight: 2,
    tintColor: 'gray'
  },
});
