import Colors from '../constants/colors'
import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  border_gray_46: {
    borderRadius: 4,
    borderColor: Colors.gray_1,
    borderWidth: 0.5,
    height: 46,
  },
  border_gray: {
    borderColor: Colors.gray,
    borderWidth: 0.5,
  },
  border_light_gray: {
    borderColor: Colors.light_gray,
    borderWidth: 0.5,
  },
  border_green_1_1: {
    borderColor: Colors.green_1,
    borderWidth: 1,
  },
  border_light_gray_bottom: {
    borderColor: Colors.light_gray,
    borderBottomWidth: 0.5,
  },
  text_nav_bar: {
    color: Colors.green_1,
    fontSize: 17,
  },
  title_nav_bar: {
    color: Colors.green_1,
    fontSize: 17,
    fontWeight: 'bold'
  },
  sub_title_nav_bar: {
    color: Colors.green_1,
    fontSize: 16,
    fontWeight: 'bold'
  },
  position_absolute_full: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  },
  position_absolute_bottom: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0
  },
  position_absolute_top: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
