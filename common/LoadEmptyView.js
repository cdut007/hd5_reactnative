import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
class LoadEmptyView extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.footer}>
                <Text style={styles.footerTitle}>暂无数据</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },
    footerTitle: {
        marginLeft: 10,
        fontSize: 15,
        color: 'gray'
    }
})

export default LoadEmptyView
