import React from "react";
import {Modal} from "antd";

class LookModel extends React.Component {
    constructor(props){
        super(props);
        this.state={
            title:"",
            content:"",
            datetime:""
        }
    }
    componentWillReceiveProps(nextProps){
        if(JSON.stringify(nextProps) !== JSON.stringify(this.props)){
            const title=nextProps.data.a_title;
            const content=nextProps.data.a_content;
            const datetime=nextProps.data.a_datetime;
            this.setState({
                title,
                content,
                datetime,
            })
        }
    }
    render(){
        return (
            
            <Modal
            title="查看文章"
            width="860px"
            visible={this.props.visible}
            onCancel={()=>this.props.on_close(false)}
            onOk={()=>this.props.on_close(false)}
            okButtonProps={{ hidden:true }}
            cancelButtonProps={{ disabled: true }}
            >
            <p style={{borderBottom:"1px solid #ccc",paddingBottom:"10px"}}><span>标题:{this.state.title}</span><span style={{display:"inline-block",marginLeft:"16px"}}>时间:{this.state.datetime}</span></p>
            <div dangerouslySetInnerHTML={{__html:this.state.content}}></div>
        </Modal>
        );
    }
}
export default LookModel;