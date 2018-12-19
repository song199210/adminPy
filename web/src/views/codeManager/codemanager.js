import React from "react";
import { Card, Col, Row,Popconfirm,Button,message } from 'antd';
import SearchForm from "../../components/search/search";

class NormalEmailForm extends React.Component {
    constructor(props){
        super(props);
        this.state={
            dataList:[]
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
    }
    componentDidMount(){
        this.queryDataList(1);
    }
    onSearchCode(key){
        
    }
    queryDataList=()=>{
        const values={
            keyStr:"",
            userid:window.localStorage.getItem("userId")
        }
        const _that=this;
        window.$common.httpAjax("codemanager/query","POST",values).then((res)=>{
            if(res.flag === "success"){
                _that.setState({
                    dataList:res.data
                });
            }else{
                message.error(res.msg);
            }
        }).catch((err)=>{
            console.error(err);
        });
    }
    setData=(type)=>{
        if(type === "add"){
            const url=`${this.props.match.path}/add`;
            this.props.history.push(url);
        }
    }
    editData=(row)=>{
        const {history}=this.props;   
        window.localStorage.setItem("codeDetail",JSON.stringify(row));
        history.push("codemanager/update");
    }
    deleteData=(row)=>{
        console.log(row)
        const values={
            c_id:row.id,
            userid:window.localStorage.getItem("userId")
        }
        const _that=this;
        window.$common.httpAjax("codemanager/delete","POST",values).then((res)=>{
            if(res.flag === "success"){
                message.success(res.msg);
                _that.queryDataList();
            }else{
                message.error(res.msg);
            }
        }).catch((err)=>{
            console.error(err);
        });
    }
    render() {
        const {dataList}=this.state;
        const cardList=dataList.map((item,index)=>{
            return (
                <Col span={6} key={index}>
                    <Card title={item.c_title} bordered={false}>
                        <p className="code_desc">{item.c_desc}</p>
                        <div>
                            <p>分类：{item.c_code_type}；时间：{item.c_datetime}</p>
                            <p>标签：{item.c_tag}</p>
                            <div className="btn_group">
                                <Button type="primary" onClick={()=>{this.editData(item)}}>编辑</Button>
                                <Popconfirm title="确认删除?" onConfirm={()=>{this.deleteData(item)}} okText="确定" cancelText="取消">
                                    <Button type="primary">删除</Button>
                                </Popconfirm>
                            </div>
                        </div>
                    </Card>
                </Col>
            );
        })
        return (
            <div>
                <div className="searContainer">
                    <SearchForm title="代码查询" handleFuns={this.onSearchCode} />
                    <div className="right_add">
                        <Button type="primary" onClick={()=>this.setData("add")}>新增</Button>
                    </div>
                </div>
                <div className="CardGroup" style={{ background: '#ECECEC', padding: '30px'}}>
                    <Row gutter={16}>{cardList}</Row>
                </div>
            </div>
        );
    }
}

export default NormalEmailForm