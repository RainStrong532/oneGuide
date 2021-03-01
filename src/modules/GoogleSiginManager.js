// import { GoogleSignin, statusCodes } from 'react-native-google-signin';

// const configure = () => {
//   GoogleSignin.configure({
//     webClientId:"1043858467992-fvlvgi02atshnt2lt9k71dbta9lln0se.apps.googleusercontent.com",
//     offlineAccess:true
//   });
// }

// signIn = async () => {
//   try {
//     await GoogleSignin.hasPlayServices();
//     const userInfo = await GoogleSignin.signIn();
//     const token = await GoogleSignin.getTokens();

//     return Promise.resolve({ ...userInfo, token })
//   } catch (error) {

//     return Promise.reject(error)
//     // if (error.code === statusCodes.SIGN_IN_CANCELLED) {

//     // } else if (error.code === statusCodes.IN_PROGRESS) {
//     //   // operation (f.e. sign in) is in progress already
//     // } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//     //   // play services not available or outdated
//     // } else {
//     //   // some other error happened
//     // }
//   }
// };

// signOut = async () => {
//   try {
//     await GoogleSignin.revokeAccess();
//     await GoogleSignin.signOut();
//   } catch (error) {
//     // console.error(error);
//   }
// };

// export default {
//   signOut,
//   signIn,
//   configure
// }
