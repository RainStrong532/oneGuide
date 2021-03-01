
import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import {
	Platform,
	SafeAreaView,
	StyleSheet,
	Text,
	View,
	Alert, Image,
	TouchableOpacity, KeyboardAvoidingView,
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

export default class ChangePasswordComponent extends Component {


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
		this.newPassRef = React.createRef();
		this.newPassRetypeRef = React.createRef();
		this.onPressChangePassButton = this.onPressChangePassButton.bind(this)
		this.state = {
			oldpassword: '',
			newpassword: '',
			retypenewpass: ''
		};

	}

	componentDidMount() {

	}

	componentWillUnmount() {

	}

	onPressBack = () => {
		backScreen(this.props.componentId)
	}

	onPressChangePassButton = () => {
		const { oldpassword, newpassword, retypenewpass } = this.state

		if (oldpassword === '' || newpassword === '' || retypenewpass === '') {
			Helper.showErrorAlert('', i18next.t('ErrorInputPassword'))
		} else if (newpassword.length <= 5 || oldpassword.length <= 5) {
			Helper.showErrorAlert('', i18next.t('MinimumPasswordLength'))
		} else if (retypenewpass !== newpassword) {
			Helper.showErrorAlert('', i18next.t('ErrDiffRetypePass'))
		} else if (!newpassword.match(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
			// console.log("11111111111111111111111111111111111111111111111111111111111");
			Helper.showErrorAlert('', i18next.t('Mật khẩu mới phải chứa ít nhất 1 ký tự đặc biệt'))
		} else {

			Loading.showHud()
			this.props.changePassword(oldpassword, newpassword)
				.then(response => {
					Loading.hideHud()
					// console.log("sau khi change pass ", response);
					const message = _.get(response, 'data.message')
					const data = _.get(response, 'data')
					if (message === 'succes') {
						const callBack = () => {
							this.onPressBack()
						}
						Helper.showErrorAlert('', i18next.t('ChangePasswordSuccess'), callBack)
					} else if (data !== '') {
						Helper.showErrorAlert('', data)
					}
				})
				.catch(error => {
					Loading.hideHud()
					Helper.showErrorAlert('', error);
				})
		}
	}

	handleKeyPress = (e) => {
		if (e.nativeEvent.key === 'done') {
			DismissKeyboard()
		}
	}

	render() {
		const offset = (Platform.OS === 'android') ? 0 : 40;
		return (
			<View style={{ flex: 1, backgroundColor: Colors.white }}>
				<HeaderView
					title={i18next.t('ChangePassword').toUpperCase()}
					tintColor={Colors.white}
					style={{ backgroundColor: Colors.green_1 }}
					back={true}
					onPressLeftBarButton={this.onPressBack}
				/>
				<View style={{ flex: 1 }}>
					<TouchableOpacity
						style={styles.button_bg}
						activeOpacity={1}
						onPress={() => { DismissKeyboard() }}
					>
						<KeyboardAvoidingView style={styles.container} behavior={"padding"} keyboardVerticalOffset={offset} >
							<ScrollView style={{ flex: 1 }}>
								<View style={{
									flex: 1,
									flexDirection: 'column',
									backgroundColor: Colors.white,
									marginTop: 50
								}}>
									<TextInputForm
										style={styles.text_input_form_1}
										// rightImage={Images.icon_password}
										iconShowPass={Images.iconsEyeTrueEnd}
										isHidePass={Images.eyes_new_not_end_done}
										placeholder={i18next.t('OldPassword')}
										placeholderTextColor={Colors.light_gray_2}
										secureTextEntry={true}
										autoCapitalize='none'
										returnKeyType={'next'}
										onSubmitEditing={() => { this.newPassRef.current.focus() }}
										onChangeText={(value) => { this.setState({ oldpassword: value }) }}
									/>
									<TextInputForm
										ref={this.newPassRef}
										style={styles.text_input_form_1}
										// rightImage={Images.icon_password}
										iconShowPass={Images.iconsEyeTrueEnd}
										isHidePass={Images.eyes_new_not_end_done}
										placeholder={i18next.t('NewPassword')}
										placeholderTextColor={Colors.light_gray_2}
										secureTextEntry={true}
										autoCapitalize='none'
										returnKeyType={'next'}
										onSubmitEditing={() => { this.newPassRetypeRef.current.focus() }}
										onChangeText={(value) => { this.setState({ newpassword: value }) }}
									/>
									<TextInputForm
										ref={this.newPassRetypeRef}
										style={styles.text_input_form_1}
										// rightImage={Images.icon_password}
										iconShowPass={Images.iconsEyeTrueEnd}
										isHidePass={Images.eyes_new_not_end_done}
										placeholder={i18next.t('RetypeNewPassword')}
										placeholderTextColor={Colors.light_gray_2}
										secureTextEntry={true}
										autoCapitalize='none'
										returnKeyType={'done'}
										onKeyPress={this.handleKeyPress}
										onChangeText={(value) => { this.setState({ retypenewpass: value }) }}
									/>
									<TouchableOpacity
										style={styles.login_button}
										onPress={this.onPressChangePassButton}>
										<Text style={[CommonStyles.textJp14, styles.login_text]}>
											{i18next.t('ChangePassword')}
										</Text>
									</TouchableOpacity>
								</View>
							</ScrollView>
						</KeyboardAvoidingView>
					</TouchableOpacity>
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

