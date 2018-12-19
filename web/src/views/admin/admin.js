import React from "react";
import {HashRouter as Router,Switch,Route,Link,Redirect} from "react-router-dom";

import HeaderView from "../../components/header/header";
import SiderbarView from "../../components/sidebar/sidebar";
import CodeManager from "../codeManager/codemanager";
import AddCodePage from "../codeManager/addCodePage";
import LinkManager from "../linkManager/linkmanager";
import ArticleManager from "../articleManager/articlemanager";
import "./admin.scss";

class NormalAdminComponent extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        const {match,history}=this.props;
        const codeUrl=`${match.path}/codemanager`;
        const addCodeUrl=`${match.path}/codemanager/add`;
        const updateCodeUrl=`${match.path}/codemanager/update`;
        const linkUrl=`${match.path}/linkmanager`;
        const articleUrl=`${match.path}/articlemanager`;
        const el=(
            <div className="adminBox">
                <HeaderView></HeaderView>
                <SiderbarView history={history} match={match}></SiderbarView>
                <div className="c_box">
                    <Router>
                        <Switch>
                            <Route component={CodeManager} path={codeUrl} exact={true} />
                            <Route component={LinkManager} path={linkUrl} />
                            <Route component={AddCodePage} path={addCodeUrl} />
                            <Route component={AddCodePage} path={updateCodeUrl} />
                            <Route component={ArticleManager} path={articleUrl} />
                            <Route path="/" render={()=><Redirect to={codeUrl}/>} />
                        </Switch>
                    </Router>
                </div>
            </div>
        );
        return el;
    }
}

export default NormalAdminComponent;