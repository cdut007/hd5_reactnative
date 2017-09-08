import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';

import dateformat from 'dateformat'
import DateTimePicker from 'react-native-modal-datetime-picker'


export default class DateTimePickerView extends Component {
    static propTypes =
    {
        type: PropTypes.string,  //'date', 'time', 'datetime'
        onSelected: PropTypes.func
    }

    constructor(props) {
        super(props)

        // if (!this.props.type) {
        //     this.props.type = 'date'
        // }

        this.state = {
            currentDate: '选择时间',
            isDateTimePickerVisible: false
        }
    }


    onSelectedDate(date) {
        console.log('A date has been picked: ', date);

        this.props.onSelected(date)

        let fmtStr
        if (this.props.type == 'time') {
            fmtStr = 'HH:MM'
        }
        else if (this.props.type == 'datetime') {
            fmtStr = 'yyyy-mm-dd HH:MM'
        }
        else {
            fmtStr = 'yyyy-mm-dd'
        }

        this.setState({
            currentDate: dateformat(date, fmtStr),
            isDateTimePickerVisible: false
        })
    }


    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style = {{width:160, height: 36, backgroundColor: 'lightgrey', alignItems: 'center', justifyContent: 'center'}} onPress={() => this.setState({ isDateTimePickerVisible: true })}>
                    <Text>{this.state.currentDate}</Text>
                </TouchableOpacity>
                <DateTimePicker
                    cancelTextIOS={'取消'}
                    confirmTextIOS={'确定'}
                    titleIOS={''}
                    datePickerModeAndroid={'spinner'}
                    mode = {this.props.type}
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={(date) => this.onSelectedDate(date)}
                    onCancel={() => this.setState({ isDateTimePickerVisible: false })}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50
    },
})
