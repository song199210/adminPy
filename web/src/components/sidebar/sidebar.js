import React from "react";
import { Menu, Icon } from 'antd';
import "./sidebar.scss";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class SiderbarComponent extends React.Component {
    constructor(props){
        super(props)
    }
    handleClick = (e) => {
        if(e.key){
            const url=`${this.props.match.path}/${e.key}`;
            this.props.history.push(url);
        }
    }
    render(){
        const el=(
            <div className="sidebar">
                <Menu
                    onClick={this.handleClick}
                    style={{ width: 200 }}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                >
                    <Menu.Item key="codemanager"><Icon type="code-o" />代码管理</Menu.Item>
                    <Menu.Item key="linkmanager"><Icon type="folder-add" />网址收藏</Menu.Item>
                    <Menu.Item key="articlemanager"><Icon type="file-word" />文章管理</Menu.Item>
                </Menu>
            </div>
        );
        return el;
    }
}

export default SiderbarComponent;