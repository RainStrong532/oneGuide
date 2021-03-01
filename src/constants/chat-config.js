
import Colors from './colors'

const styte_send_status_sending = {
  borderColor: Colors.blue,
  borderWidth: 1.5,
  height: 10,
  width: 10,
  borderRadius: 5,
}

const styte_send_status_received = {
  backgroundColor: Colors.blue,
  height: 10,
  width: 10,
  borderRadius: 5,
}

const style_text = {
  fontSize: 14,
  lineHeight: 18,
  marginHorizontal: 16,
}

const Message = {
  border_radius: 16,
  styte_send_status_sending,
  styte_send_status_received,
  style_text
};

const SendStatus = {
  sending: 'sending',
  sent: 'sent',
  recevied: 'recevied',
  seen: 'seen',
};

export default {
  Message,
  SendStatus
};
