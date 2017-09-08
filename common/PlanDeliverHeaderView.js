import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default class PlanDeliverHeaderView extends Component {


    render() {
        return (
            <View style={styles.titleflexContainer}>
                <View style={styles.cell}>
                    <Text style={styles.label}>
                        序号
                    </Text>
                </View>
                <View style={styles.cell2}>

                    <Text style={styles.label}>
                        焊口/支架
                    </Text>
                </View>
                <View style={styles.cell3}>
                    <Text style={styles.label}>
                        图纸号
                    </Text>
                </View>
                <View style={styles.cell4}>
                    <Text style={styles.label}>
                        分配
                    </Text>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    label: {
        color: '#ffffff',
        fontSize: 16,
    },
    titleflexContainer: {
        height: 50,
        backgroundColor: '#00a629',
        flexDirection: 'row',
    },

    cell: {
        flex: 1,
        height: 50,
        justifyContent: "center",
        alignItems: 'center',
    },
    cell2: {
        flex: 2,
        height: 50,
        justifyContent: "center",
        alignItems: 'center',
    },
    cell3: {
        flex: 4,
        height: 50,
        justifyContent: "center",
        alignItems: 'center',
    },
    cell4: {
        flex: 1,
        height: 50,
        justifyContent: "center",
        alignItems: 'center',
    },
    cellLine: {
        width: 1,
        height: 80,
        backgroundColor: '#cccccc',
    },
})