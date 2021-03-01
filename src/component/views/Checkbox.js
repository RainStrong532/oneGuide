
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Text, TouchableHighlight, View, Image } from 'react-native';
import Images from '../../assets/images'

var BACKGROUND_COLOR, BORDER_RADIUS, BORDER_WIDTH, COLOR, MARGIN, SIZE, BORDER_COLOR;

class Checkbox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      backgroundColor: '#FFF',
      borderRadius: 0,
      borderWidth: 2,
      checked: false,
      color: '#000',
      margin: 2,
      name: '',
      onChange: null,
      size: 20,
      borderColor: '#000'
    };
  }

  componentDidMount() {
    const styleCheckbox = this.props.style

    this.setState({
      backgroundColor: styleCheckbox.backgroundColor ? styleCheckbox.backgroundColor : this.state.backgroundColor,
      borderRadius: styleCheckbox.borderRadius ? styleCheckbox.borderRadius : this.state.borderRadius,
      borderWidth: styleCheckbox.borderWidth ? styleCheckbox.borderWidth : this.state.borderWidth,
      checked: styleCheckbox.checked ? styleCheckbox.checked : this.state.checked,
      color: styleCheckbox.color ? styleCheckbox.color : this.state.color,
      margin: styleCheckbox.margin ? styleCheckbox.margin : this.state.margin,
      name: styleCheckbox.name ? styleCheckbox.name : this.state.name,
      onChange: styleCheckbox.onChange ? styleCheckbox.onChange : this.state.onChange,
      size: styleCheckbox.size ? styleCheckbox.size : this.state.size,
      borderColor: styleCheckbox.borderColor ? styleCheckbox.borderColor : this.state.borderColor
    })
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    this.setState({ checked: nextProps.checked });
  }

  render() {
    BACKGROUND_COLOR = this.state.backgroundColor;
    BORDER_RADIUS = this.state.borderRadius;
    BORDER_WIDTH = this.state.borderWidth;
    COLOR = this.state.color;
    MARGIN = this.state.margin;
    SIZE = this.state.size;
    BORDER_COLOR = this.state.borderColor;
    return (
      <TouchableHighlight underlayColor='transparent'
        onPress={() => { this._toggleCheck() }}
        style={{
          backgroundColor: BACKGROUND_COLOR, borderColor: BORDER_COLOR,
          borderRadius: BORDER_RADIUS, borderWidth: BORDER_WIDTH,
          height: SIZE, margin: MARGIN, width: SIZE, alignSelf: 'center'
        }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          {this.state.checked &&
            <Image
              source={Images.icon_check}
              resizeMode='center'
              style={{ width: SIZE - 2, height: SIZE - 2 }}>
            </Image>
          }
        </View>
      </TouchableHighlight>
    );
  }

  _toggleCheck() {
    var checked = !this.state.checked;
    this.setState({ checked: checked });
    this.props.onChange && this.props.onChange(this.props.name, checked);
  }
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  size: PropTypes.number,
  style: PropTypes.object,
}

module.exports = Checkbox;