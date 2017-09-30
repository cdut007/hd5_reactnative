
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Modal
} from 'react-native';

import ImageViewer from 'react-native-image-zoom-viewer';


export default class ImageShowsUtil extends Component {

  constructor(props) {
      super(props)
      }



    render() {
        return (
            <Modal visible={true} transparent={true}>
                <ImageViewer
                  imageUrls={this.props.images}
                   enableImageZoom={true} // 是否开启手势缩放
                  index={this.props.imageIndex} // 初始显示第几张
                   onClick={() => { // 图片单击事件
                      this.props.navigator.pop();
                  }}
                  />
            </Modal>
        )
    }
}
