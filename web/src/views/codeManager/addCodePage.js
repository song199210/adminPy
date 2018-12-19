import React from "react";
import AceEditor from 'react-ace';
import brace from "brace";
import {
    Form,Input, Button, Upload, Icon, Rate,
    Tag, Tooltip,message,Select,Radio,InputNumber 
    } from "antd";
import "./codemanager.scss";
import {codeTheme,codeType} from "./codeConfig";
const FormItem = Form.Item;
const {TextArea} = Input;
const Option=Select.Option;
const RadioGroup=Radio.Group;
class AddCodePage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            c_id:"",//数据id
            title:"",
            tags:[],
            inputVisible: false,
            inputValue: '',
            cideVal:"",
            codeTypeVal:"html",
            codeThemeVal:"github",
            codeSizeVal:12  
        };
    }
    componentDidMount(){
        const {pathname}=this.props.location;
        if(typeof pathname !== "undefined" && pathname.indexOf("update") !== -1){
            var codeDetail=JSON.parse(window.localStorage.getItem("codeDetail"));
            if(codeDetail != undefined && JSON.stringify(codeDetail) != "{}"){
                this.props.form.setFieldsValue({
                    c_title:codeDetail.c_title,
                    c_desc:codeDetail.c_desc,
                    code_type:codeDetail.c_code_type,
                    code_theme:codeDetail.c_code_theme,
                    code_fsize:codeDetail.c_code_fsize
                });
                this.setState({
                    c_id:codeDetail.id,
                    tags:codeDetail.c_tag.split(","),
                    codeVal:codeDetail.c_code,
                    codeTypeVal:codeDetail.c_code_type,
                    codeThemeVal:codeDetail.c_code_theme,
                    codeSizeVal:codeDetail.c_code_fsize
                })
            }
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
        const {form,location,history}=this.props;
        const {c_id,tags,codeVal}=this.state;
        form.validateFields((err, values) => {
            if (!err) {
                values.userid=window.localStorage.getItem("userId");
                if(tags.length == 0){
                    message.error("至少定义一个标签!")
                    return false;
                }
                const tagStr=tags.join(",");
                values.c_tags=tagStr;
                values.code=codeVal;
                let urlStr="codemanager/add"
                if(location.pathname.indexOf("update") != -1){
                    urlStr="codemanager/update";
                    values['c_id']=c_id;
                }
                window.$common.httpAjax(urlStr,"POST",values).then((res)=>{
                    if(res.flag === "success"){
                        message.success(res.msg);
                        console.log(history)
                        history.go(-1);
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
    handleTypeChange=(type)=>{   //设置代码类型
        this.setState({
            codeVal:""
        });
        this.setState({
            codeTypeVal:type
        });
    }
    handleThemeChange=(theme)=>{ //设置代码主题
        this.setState({
            codeThemeVal:theme
        })
    }
    handleSizeChange=(size)=>{  //设置代码字体大小
        this.setState({
            codeSizeVal:size
        })
    }
    handleCodeChange=(val)=>{
        this.setState({
            codeVal:val
        });
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 16 },
        };
        const themeKey=Object.keys(codeTheme),typeKey=Object.keys(codeType);
        let codeThemeList=themeKey.map((item,index)=>{
            return (<Option key={index} value={item}>{codeTheme[item]}</Option>);
        });
        let codeTypeList=typeKey.map((item,index)=>{
            return (<Option key={index} value={item}>{codeType[item]}</Option>);
        });
        const { inputVisible, inputValue,tags,codeVal,codeTypeVal,codeThemeVal,codeSizeVal} = this.state;
        return (
            <div className="addCodePage">
                <div className="codeContainer">
                    <div className="leftInfo">
                        <div className="basicInfo">
                            <h4>基本信息</h4>
                            <Form>
                                <FormItem
                                    {...formItemLayout}
                                    label="标题">
                                    {getFieldDecorator('c_title', {
                                        initialValue:"",
                                        rules: [{ required: true, message: '标题不能为空!' }],
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
                                    {getFieldDecorator('c_desc', {
                                        initialValue: "",
                                    })(
                                        <TextArea />
                                    )}
                                </FormItem>
                                <div className="btnGroup">
                                    <Button type="primary" onClick={()=>{this.props.history.goBack()}}>返回</Button>
                                    <Button type="primary" onClick={this.handleSubmit}>保存</Button>
                                </div>
                            </Form>
                        </div>
                        <div className="setCodeContro">
                            <h4>代码设置</h4>
                            <Form>
                                <FormItem
                                    {...formItemLayout}
                                    label="代码类型">
                                    {getFieldDecorator('code_type',{
                                        initialValue:"html"
                                    })(
                                        <Select defaultValue="lucy" style={{ width: "100%" }} onChange={this.handleTypeChange}>
                                            {codeTypeList}
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="代码主题">
                                    {getFieldDecorator('code_theme',{
                                        initialValue:"github"
                                    })(
                                        <Select defaultValue="lucy" style={{ width: "100%" }} onChange={this.handleThemeChange}>
                                            {codeThemeList}
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="字体大小">
                                    {getFieldDecorator('code_fsize', {
                                        initialValue:12
                                    })(
                                        <InputNumber min={12} defaultValue={codeSizeVal} onChange={this.handleSizeChange} />,
                                    )}
                                </FormItem>
                            </Form>
                        </div>
                    </div>
                    <div className="rightCode">
                        <h4>代码区域</h4>
                        <div className="ace-editor">
                            <AceEditor
                                mode={codeTypeVal}
                                value={codeVal}
                                theme={codeThemeVal}
                                fontSize={codeSizeVal}
                                width="100%"
                                height="100%"
                                showPrintMargin={false}
                                name="UNIQUE_ID_OF_DIV"
                                onChange={this.handleCodeChange}
                                enableBasicAutocompletion={true}
                                enableLiveAutocompletion={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const AddCodeModel = Form.create()(AddCodePage);
export default AddCodeModel;