import React from "react";
import { Table,Button,Popconfirm,message,Icon } from 'antd';
import AddModelForm from "./addModel";
import LookModel from "./lookModel";
import SearchForm from "../../components/search/search";
import "./articlemanager.scss";

const initObj={
    a_title:"",
    a_classid:"",
    a_tag:"",
    a_content:""
}
class ArticleManager extends React.Component {
    constructor(props){
        super(props);
        this.state={
            calist:[],//文章分类
            is_add_visible:false,
            is_look_visible:false,
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
          width:90,
          align:"center",
          key:"key"
        }, {
          title: '标题',
          dataIndex: 'a_title',
          key:"a_title"
        }, {
          title: '标签',
          dataIndex: 'a_tag',
          key:"a_tag"
        }, {
            title: '分类',
            dataIndex: 'ca_title',
            width:100,
            key:"a_classid",
        }, {
            title: '简介',
            dataIndex: 'a_desc',
            key:"a_desc",
        },{
            title:"发布时间",
            dataIndex:"a_datetime",
            key:"datetime",
        }, {
            title: '操作', 
            dataIndex: '', 
            width:130,
            align:"center",
            key: 'x', 
            render: (record) => {
                return (
                        <span>
                            <a href="javascript:void(0);" onClick={()=>this.setData('look',record)}style={{"marginRight":"10px"}}><Icon type="file-text" /></a><a href="javascript:void(0);" onClick={()=>this.setData('edit',record)}style={{"marginRight":"10px"}}><Icon type="edit" /></a>
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
        this.initCArticleList();
        this.initQueryList(1,"");
    }
    setData=(type,data)=>{
        let urlStr="";
        const _that=this;
        if(type === "edit" || type === "add"){
            _that.setState({
                is_add_visible:true,
                modelData:type === "edit"?Object.assign({},data,{url_type:"edit"}):Object.assign({},initObj,{url_type:"add"})
            });
            let inputValObj=type === "add"?initObj:data;
            console.log(this.domRef)
            _that.domRef.setFieldsValue({
                a_title:inputValObj.a_title?inputValObj.a_title:"",
                a_classid:parseInt(inputValObj.a_classid?inputValObj.a_classid:1),
                a_content:inputValObj.a_content?inputValObj.a_content:"",
                a_tag:inputValObj.a__tag?inputValObj.a_tag:""
            });
            return false;
        }else if(type == "look"){
            _that.setState({
                is_look_visible:true,
                modelData:Object.assign({},data)
            });
            console.log(this.state.modelData)
            return false;
        }else{
            urlStr="articlemanager/delete";
        }
        const sendData={a_id:data.id,a_userid:window.localStorage.getItem("userId")};
        window.$common.httpAjax(urlStr,"POST",sendData).then((res)=>{
            if(res.flag === "success"){
                _that.initQueryList(1,"");
            }else{
                message.error(res.msg);
            }
        }).catch((err)=>{
            console.error(err);
        });
    }
    initCArticleList=()=>{
        var sendData={
            userid:window.localStorage.getItem("userId"),
        };
        window.$common.httpAjax("classarticle/query","POST",sendData).then((res)=>{
            if(res.flag === "success"){
                console.log(res)
                this.setState({
                    calist:res.data
                });
            }else{
                message.error(res.msg);
            }
        }).catch((err)=>{
            console.error(err);
        });
    }
    initQueryList=(index,keyStr)=>{
        var sendData={
            ca_keystr:keyStr === undefined?"":keyStr,
            ca_userid:window.localStorage.getItem("userId"),
            ca_classid:"",
            pageno:index==undefined?1:index,
            pagesize:10
        };
        window.$common.httpAjax("articlemanager/query","POST",sendData).then((res)=>{
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
        return (
            <div>
                <div className="searContainer">
                    <SearchForm title="文章查询" handleFuns={this.onSearchCode} />
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
                />
                <AddModelForm visible={this.state.is_add_visible} cArticleList={this.state.calist} on_close={this.handleClose} ref={(dom)=>this.domRef=dom} data={this.state.modelData}></AddModelForm>
                <LookModel visible={this.state.is_look_visible} on_close={()=>{this.setState({is_look_visible:false})}} data={this.state.modelData}></LookModel>
            </div>
        );
    }
}
export default ArticleManager;