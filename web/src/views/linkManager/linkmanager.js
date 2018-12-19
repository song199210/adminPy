import React from "react";
import { Table,Button,Popconfirm,message,Icon } from 'antd';
import AddModelForm from "./addModel";
import SearchForm from "../../components/search/search";
import "./searchform.scss";

const initObj={
    l_title:"",
    l_url:"",
    l_tag:"",
    l_rate:"",
    l_desc:""
}
class LinkManager extends React.Component {
    constructor(props){
        super(props);
        this.state={
            is_add_visible:false,
            data:[],
            totalList:0,
            currPage:0,
            modelData:initObj
        };
        this.onSearchCode=this.onSearchCode.bind(this);
        this.onChange=this.onChange.bind(this);
        this.handleClose=this.handleClose.bind(this);
        this.columns = [{
          title: '序号',
          dataIndex: 'key',
          width:100
        }, {
          title: '标题',
          dataIndex: 'l_title',
          defaultSortOrder: 'descend'
        }, {
          title: '标签',
          dataIndex: 'l_tag'
        }, {
            title: '收藏时间',
            dataIndex: 'l_datetime',
            key:"datetime"
        }, {
            title: '操作', 
            dataIndex: '', 
            render: (record) => {
                return (
                    <span>
                        <a href="javascript:void(0);" onClick={()=>this.setData('edit',record)}style={{"marginRight":"10px"}}><Icon type="file-text" /></a>
                        <Popconfirm title="确认删除?" onConfirm={()=>this.setData('del',record)} okText="确定" cancelText="取消">
                            <a href="javascript:void(0);"><Icon type="delete" title="删除" /></a>
                        </Popconfirm>
                    </span>
                    );
                }
            }
        ];
    }
    componentDidMount(){
        this.initQueryList(1,"");
    }
    setData=(type,data)=>{
        let urlStr="";
        if(type === "edit" || type === "add"){
            this.setState({
                is_add_visible:true,
                modelData:type === "edit"?Object.assign({},data,{url_type:"edit"}):Object.assign({},initObj,{url_type:"add"})
            });
            let inputValObj=type === "add"?initObj:data;
            this.domRef.setFieldsValue({
                title:inputValObj.l_title?inputValObj.l_title:"",
                url:inputValObj.l_url?inputValObj.l_url:"",
                desc:inputValObj.l_desc?inputValObj.l_desc:"",
                rate:inputValObj.l_rate?inputValObj.l_rate:0
            });
            return false;
        }else{
            urlStr="linkmanager/delete";
        }
        let sendData={id:data.id};
        window.$common.httpAjax(urlStr,"POST",sendData).then((res)=>{
            if(res.flag === "success"){
                this.initQueryList(1,"");
            }else{
                message.error(res.msg);
            }
        }).catch((err)=>{
            console.error(err);
        });
    }
    initQueryList=(index,keyStr)=>{
        var sendData={
            index:index==undefined?1:index,
            key:keyStr === undefined?"":keyStr,
            tpage:10
        };
        window.$common.httpAjax("linkmanager/query","POST",sendData).then((res)=>{
            if(res.flag === "success"){
                res.data.map((item,index)=>{
                    item['key']=index+1;
                });
                this.setState({
                    data:res.data,
                    totalList:res.totalList,
                    currPage:index
                });
            }else{
                message.error(res.msg);
            }
        }).catch((err)=>{
            console.error(err);
        });
    }
    onSearchCode(key){
        this.initQueryList(1,key);
    }
    onChange(pagination, filters, sorter) {
        this.initQueryList(pagination.current,"");
    }
    handleClose(type){
        this.setState({
            is_add_visible:false
        });
        if(type){
            this.initQueryList();
            this.setState({
                modelData:initObj
            });
        }
    }
    render(){
        console.log(this.state.modelData)
        return (
            <div>
                <div className="searContainer">
                    <SearchForm title="网址查询" handleFuns={this.onSearchCode} />
                    <div className="right_add">
                        <Button type="primary" onClick={()=>this.setData("add")}>新增</Button>
                    </div>
                </div>
                <Table 
                columns={this.columns} 
                bordered 
                dataSource={this.state.data} 
                onChange={this.onChange} 
                pagination={{total:this.state.totalList,defaultCurrent:this.state.currPage,pageSize:10}}
                expandedRowRender={record => <a target="_blank" style={{ margin: 0 }} href={record.l_url}>{record.l_url}</a>}
                />
                <AddModelForm visible={this.state.is_add_visible} on_close={this.handleClose} ref={(dom)=>this.domRef=dom} data={this.state.modelData}></AddModelForm>
            </div>
        );
    }
}
export default LinkManager;