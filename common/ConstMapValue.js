

var Map_Plan_Col = {
    'GDJH':{col1:'图纸号',col2:'焊口/支架',col3:'房间号',col4:'规格',col5:'施工日期'},
    'TFJH':{col1:'图纸号',col2:'焊口/支架',col3:'房间号',col4:'规格',col5:'施工日期'},
    'ZXT':{col1:'图纸号',col2:'焊口/支架',col3:'房间号',col4:'规格',col5:'施工日期'},
    'JXJH':{col1:'图纸号',col2:'焊口/支架',col3:'房间号',col4:'规格',col5:'施工日期'},
    'DQJH':{col1:'图纸号',col2:'焊口/支架',col3:'房间号',col4:'规格',col5:'施工日期'},
    'YBJH':{col1:'图纸号',col2:'焊口/支架',col3:'房间号',col4:'规格',col5:'施工日期'},
    'TSJH':{col1:'图纸号',col2:'焊口/支架',col3:'房间号',col4:'规格',col5:'施工日期'},
    'BWJH':{col1:'图纸号',col2:'焊口/支架',col3:'房间号',col4:'规格',col5:'施工日期'},
}



module.exports = {

    Plan_Col_Map(type){

        return Map_Plan_Col[type]
    },



};
