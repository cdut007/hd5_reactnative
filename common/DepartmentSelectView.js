import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import ModalDropdown from 'react-native-modal-dropdown'
import HttpRequest from '../HttpRequest/HttpRequest'
import Global from './globals.js'
import Dimensions from 'Dimensions'

var width = Dimensions.get('window').width;
const REQUST_DEPARTMENT_URL = '/hdxt/api/core/department'
const REQUST_DEPARTMENT_MEMBER_URL = '/hdxt/api/core/user'

var departmentArr = []
var departmentMemberDic = {}

export default class DepartmentSelectView extends Component {
    static propTypes =
    {
        onSelected: PropTypes.func
    }

    constructor(props) {
        super(props)

        this.state = {
            selectedDepartment: { "id": -1, "name": "选择部门", "departmentResult": null },
            selectedPerson: { "id": -1, "name": "选择人员", "departmentResult": null },
            departmentNameArr: [],
            memberNameArr: []
        }
    }

    componentDidMount() {
        if (departmentArr.length == 0) {
            this.getDepartment()
        }
        else
        {
            this.updateDepartmentPicker()
        }
    }

    getDepartment() {
        HttpRequest.get(REQUST_DEPARTMENT_URL, {}, this.onGetDepartMentSuccess.bind(this),
            (e) => {
                try {
                    Global.alert(e)
                }
                catch (err) {
                    console.log(err)
                }
            })
    }

    onGetDepartMentSuccess(response) {
        console.log('onGetDepartMentSuccess:' + JSON.stringify(response))


        if (response['code'] == '1000') {
            departmentArr = response['responseResult']
        }

        this.updateDepartmentPicker()
    }

    getDepartmentMember(id)
    {
        var param = {'departmentId': id}
        HttpRequest.get(REQUST_DEPARTMENT_MEMBER_URL, param, this.onGetMemberSuccess.bind(this),
            (e) => {
                try {
                    Global.alert(e)
                }
                catch (err) {
                    console.log(err)
                }
            })
    }

    onGetMemberSuccess(response) {
        console.log('onGetMemberSuccess:' + JSON.stringify(response))


        if (response['code'] == '1000') {
            departmentMemberDic[this.state.selectedDepartment.id] = response['responseResult']
        }

        this.updateMemberPicker(this.state.selectedDepartment.id)
    }

    updateDepartmentPicker()
    {
        var nameArr = []
        departmentArr.map((item, i) => {
            nameArr.push(item.name)
        })

        this.setState({
            departmentNameArr: nameArr
        })
    }

    updateMemberPicker(id)
    {
        var nameArr = []
        departmentMemberDic[id].map((item, i) => {
            nameArr.push(item.name)
        })

        this.setState({
            memberNameArr: nameArr
        })
    }

    onSelectDropDown1(idx, value) {
        let department = departmentArr[idx]
        this.setState({ selectedDepartment: department })

        if (departmentMemberDic[department.id])
        {
            this.updateMemberPicker(department.id)
        }
        else
        {
            this.getDepartmentMember(department.id)
        }
    }

    onSelectDropDown2(idx, value) {
        let memberArr = departmentMemberDic[this.state.selectedDepartment.id]
        this.setState({ selectedPerson: memberArr[idx] })
        this.props.onSelected(memberArr[idx])
    }

    render() {
        let secondPicker = this.state.selectedDepartment['id'] == -1 ? (<View/>) :
            (<ModalDropdown
                options={this.state.memberNameArr}
                textStyle={{ alignSelf: 'stretch', paddingLeft: 5 }}
                dropdownStyle={styles.dropDownList}
                style={styles.dropDown}
                defaultValue={this.state.selectedPerson['name']}
                onSelect={(idx, value) => this.onSelectDropDown2(idx, value)} >
                {/*<Image source={require('../images/numBtn.png')} style={{width: 20, height: 36, alignSelf: 'flex-end'}}/>*/}
            </ModalDropdown>)


        return (
            <View style={styles.container}>
                <ModalDropdown
                    options={this.state.departmentNameArr}
                    textStyle={{ alignSelf: 'stretch', paddingLeft: 5 }}
                    dropdownStyle={styles.dropDownList}
                    style={styles.dropDown}
                    defaultValue={this.state.selectedDepartment['name']}
                    onSelect={(idx, value) => this.onSelectDropDown1(idx, value)} >
                    {/*<Image source={require('../images/numBtn.png')} style={{width: 20, height: 36, alignSelf: 'flex-end'}}/>*/}
                </ModalDropdown>
                {secondPicker}
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
        height: 44
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
    dropDownList: {
        width: 119,
        borderColor: 'lightgray',
        borderWidth: 0.5,
    },
});
