import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import ModalDropdown from 'react-native-modal-dropdown'
import HttpRequest from '../HttpRequest/HttpRequest'
import Dimensions from 'Dimensions'

var width = Dimensions.get('window').width;
const REQUST_TEAMMEMBER_URL = '/hdxt/api/baseservice/witness/team'

var memberArr = []
var allUserDic = {}

export default class MemberSelectView extends Component {
    static propTypes =
    {
        title: PropTypes.string,
        type: PropTypes.string,
        defaultMember: PropTypes.object,
        onSelected: PropTypes.func
    }

    constructor(props) {
        super(props)

        let member = this.props.defaultMember
        if (!member || !member.realname) {
            member = { "id": -1, "realname": "选择人员"}
        }


        this.state = {
            selectedMember: member,
            memberNameArr: []
        }
    }

    componentDidMount() {
        if (memberArr.length == 0) {
            this.getTeamMember()
        }
        else
        {
            this.updateMemberPicker()
        }
    }

    getTeamMember() {
        HttpRequest.get(REQUST_TEAMMEMBER_URL, {}, this.onGetMemberSuccess.bind(this),
            (e) => {
                try {
                    alert(e)
                }
                catch (err) {
                    console.log(err)
                }
            })
    }

    onGetMemberSuccess(response) {
        console.log('onGetMemberSuccess:' + JSON.stringify(response))

        let tempDic = {}
        if (response['code'] == '1000') {
            response['responseResult'].map((item, i) => {
                tempDic[item.type] = item.users
            })
        }

        allUserDic = tempDic
        memberArr  = tempDic[this.props.type]

        this.updateMemberPicker()
    }


    updateMemberPicker()
    {
        var nameArr = []
        memberArr.map((item, i) => {
            nameArr.push(item.realname)
        })

        this.setState({
            memberNameArr: nameArr
        })
    }


    onSelectDropDown(idx, value) {
        this.setState({ selectedMember: memberArr[idx] })
        this.props.onSelected(memberArr[idx])
    }

    render() {
        return (
            <View style={styles.container}>
                <Text  style={styles.title}>{this.props.title}:</Text>
                <ModalDropdown
                    options={this.state.memberNameArr}
                    textStyle={{ alignSelf: 'stretch', paddingLeft: 5 }}
                    dropdownStyle={styles.dropDownList}
                    style={styles.dropDown}
                    defaultValue={this.state.selectedMember['realname']}
                    onSelect={(idx, value) => this.onSelectDropDown(idx, value)} >
                </ModalDropdown>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor:'#ffffff',
        height: 50
    },
    dropDown: {
        justifyContent: 'center',
        // flex: 1,
        width: 120,
        height: 36,
        backgroundColor: 'lightgrey',
        marginLeft: 20,
        borderColor: 'lightgray',
        borderWidth: 0.5,
    },
    title: {
        margin:8,
        fontSize: 18,
        color: "#666"
    },
    dropDownList: {
        width: 119,
        borderColor: 'lightgray',
        borderWidth: 0.5,
    },
});
