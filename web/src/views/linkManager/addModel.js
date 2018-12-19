import React from "react";
import {
    Modal,Form, Select, Input, Switch, Radio,
    Slider, Button, Upload, Icon, Rate, Tag, Tooltip,
    message
  } from 'antd';
  
const FormItem = Form.Item;
const {TextArea} = Input;

class addModel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            title:"",
            tags:[],
            inputVisible: false,
            inputValue: ''
        };
    }
    componentWillReceiveProps(nextProps){
        if(JSON.stringify(nextProps) !== JSON.stringify(this.props)){
            const tags=nextProps.data.l_tag;
            this.setState({
                tags:tags === ""?[]:tags.split(",")
            })
        }
    }
    handleClose = (removedTag) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({ tags });
    }

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    }

    handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value });
    }

    handleInputConfirm = () => {
        const state = this.state;
        const inputValue = state.inputValue;
        let tags = state.tags;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    }
    handleSubmit=()=>{
        const {form,data}=this.props;
        const {tags}=this.state;
        form.validateFields((err, values) => {
            if (!err) {
                values.userid=window.localStorage.getItem("userId");
                if(tags.length == 0){
                    message.error("至少定义一个标签!")
                    return false;
                }
                const tagStr=tags.join(",");
                let urlStr="linkmanager/add";
                values.tags=tagStr;
                const {url_type}=data;
                if(url_type == "edit"){
                    urlStr="linkmanager/update";
                    values["l_id"]=data.id;
                }
                window.$common.httpAjax(urlStr,"POST",values).then((res)=>{
                    if(res.flag === "success"){
                        message.success(res.msg);
                        this.props.on_close(true)
                    }else{
                        message.error(res.msg);
                    }
                }).catch((err)=>{
                    console.error(err);
                });
            }
          });
    }
    saveInputRef = input => this.input = input
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 14 },
        };
        const { inputVisible, inputValue,tags} = this.state;
        return (
            <div>
                <Modal
                title="新增网址"
                width="680px"
                visible={this.props.visible}
                onOk={this.handleSubmit}
                onCancel={()=>this.props.on_close(false)}
                >
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="标题">
                            {getFieldDecorator('title', {
                                initialValue:"",
                                rules: [{ required: true, message: '标题不能为空!' }],
                            })(
                            <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="网址">
                            {getFieldDecorator('url', {
                                initialValue:"",
                                rules: [{ required: true, message: '网址不能为空!' }],
                            })(
                            <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="标签">
                            {tags.map((tag, index) => {
                                const isLongTag = tag.length > 20;
                                const tagElem = (
                                    <Tag key={tag} closable afterClose={() => this.handleClose(tag)}>
                                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                    </Tag>
                                );
                                return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                            })}
                            {inputVisible && (
                            <Input
                                ref={this.saveInputRef}
                                type="text"
                                size="small"
                                style={{ width: 78 }}
                                value={inputValue}
                                onChange={this.handleInputChange}
                                onBlur={this.handleInputConfirm}
                                onPressEnter={this.handleInputConfirm}
                            />
                            )}
                            {!inputVisible && (
                            <Tag
                                onClick={this.showInput}
                                style={{ background: '#fff', borderStyle: 'dashed' }}
                            >
                                <Icon type="plus" /> New Tag
                            </Tag>
                            )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注">
                        {getFieldDecorator('desc', {
                            initialValue: "",
                        })(
                            <TextArea />
                        )}
                    </FormItem>

                    <FormItem
                    {...formItemLayout}
                    label="优先级"
                    >
                    {getFieldDecorator('rate', {
                        initialValue: 0,
                    })(
                        <Rate />
                    )}
                    </FormItem>
                </Form>
            </Modal>
        </div>
        );
    }
}
const WrappedAddModel = Form.create()(addModel);
export default WrappedAddModel;