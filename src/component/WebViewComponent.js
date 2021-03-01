
import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import {
	Platform,
	StyleSheet,
	// WebView,
	View,
	Alert, Image,
	TouchableOpacity, ActivityIndicator,
	BackHandler, Dimensions, ScrollView
} from 'react-native';
import { ReachabilityView, i18next, Loading } from '../utils'
import { setRootToHomeScreen, gotoRegisterScreen, gotoTutorialScreen, gotoSelectProviderScreen, backScreen, setRootToLoginScreen } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import DismissKeyboard from 'dismissKeyboard';
import Fonts from '../constants/fonts'
import CommonStyles from '../constants/styles'
import TextInputForm from './views/TextInputForm'
import HeaderView from './views/HeaderView'
import Helper from '../utils/Helper'
import _ from 'lodash';

export default class WebViewComponent extends Component {


	static options(passProps) {
		return {
			statusBar: {
				backgroundColor: 'transparent',
				visible: true,
				style: 'light'
			},
		};
	}

	constructor(props) {
		super(props);
		Navigation.events().bindComponent(this);
		this.onLoadSuccess = this.onLoadSuccess.bind(this)
		const url = _.get(this.props, 'data.url')
		this.state = {
			fetching: true,
			error: !url
		};

	}

	componentDidMount() {

	}

	componentWillUnmount() {

	}

	onPressBack = () => {
		backScreen(this.props.componentId)
	}

	onLoadSuccess = (e) => {
		this.setState({
			fetching: false,
		})
	}

	onLoadError = () => {
		return (
			<View style={styles.container}>
				<Text numberOfLines={2} style={{ textAlign: 'center', paddingHorizontal: 30 }}>{i18next.t('ErrorLoadURL')}</Text>
			</View>
		)
	}
	onError = () => {
		this.setState({
			error: true,
		})
	}

	render() {
		const { fetching, error } = this.state
		let Wrapper = fetching ? ScrollView : View;
		const title = _.get(this.props, 'data.title')
		const url = _.get(this.props, 'data.url')

		return (
			<View style={{ flex: 1, backgroundColor: Colors.white }}>
				<HeaderView
					title={title}
					tintColor={Colors.white}
					style={{ backgroundColor: Colors.green_1 }}
					back={true}
					onPressLeftBarButton={this.onPressBack}
				/>
				<View style={{ flex: 1 }}>
					<Wrapper style={{ flex: 1 }}>
						{!error ? null
						// <WebView
						// 	originWhitelist={['*']}
						// 	onError={this.onError}
						// 	onLoadEnd={this.onLoadSuccess}
						// 	source={{ uri: url }}
						// 	javaScriptEnabled={true}
						// 	useWebKit={true}
						// /> 
						: this.onLoadError()}
					</Wrapper>
					<ActivityIndicator
						animating={fetching}
						size="small"
						style={{ position: 'absolute', alignSelf: 'center', top: 20 }} />
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	button_bg: {
		justifyContent: 'center',
		flex: 1,
	},
	login_title: {
		marginTop: 52,
		alignSelf: 'center',
		fontSize: 25,
		fontWeight: 'bold'
	},
	logo_text: {
		marginTop: 50,
		alignSelf: 'center',
		tintColor: Colors.green_1
	},
	text_input_form_1: {
		marginTop: 10,
		marginHorizontal: 25,
	},
	login_button: {
		marginTop: 15,
		marginHorizontal: 25,
		height: 50,
		backgroundColor: Colors.blue,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4
	},
	login_text: {
		color: 'white',
		letterSpacing: 1.1,
		fontSize: 15,
		fontWeight: 'bold',
		textAlign: 'center',
		position: 'absolute',
		left: 0, right: 0
	}

});

