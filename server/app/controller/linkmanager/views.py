# -*- coding: utf-8 -*-
from flask import Blueprint,request,jsonify,current_app
from app.models import CLink,session
from ..common import requestBody
from sqlalchemy import or_,exc
import json
linkmanager=Blueprint("linkmanager",__name__)

@linkmanager.route("/add",methods=['POST'])
def addLinkModel():
    if request.method == "POST":
        resJson=addLink(request)
        return jsonify(resJson)

def addLink(request):
    reqJson=requestBody(request)
    resJson={"flag":"error","msg":"数据新增失败"}
    l_title=reqJson.get("title")
    l_url=reqJson.get("url")
    l_tag=reqJson.get("tags")
    l_desc=reqJson.get("desc")
    l_rate=reqJson.get("rate")
    l_userid=reqJson.get("userid")
    if l_userid == None or l_userid == "":
        resJson['msg']="用户标识ID不存在"
        return resJson
    try:
        link = CLink(l_title, l_url, l_tag, l_desc, l_rate, l_userid)
        session.add(link)
        session.commit()
    except exc.InvalidRequestError:
        session.rollback()
    except Exception as e:
        print(str(type(e)))
        resJson['msg']=repr(e)
        session.rollback()
    resJson["flag"]="success"
    resJson["msg"]="数据新增成功"
    return resJson

@linkmanager.route("/query",methods=["POST"])
def queryLinkModel():
    if request.method == "POST":
        resJson=queryLink(request)
        return jsonify(resJson)

def queryLink(request):
    reqJson=requestBody(request)
    keyStr=reqJson['key']
    index=reqJson['index']
    tpage=reqJson['tpage']
    offset=(index-1)*tpage
    resJson = {
        "flag":"error",
        "msg":""
    }
    try:
        querySQL = session.query(CLink).filter(
            or_(CLink.l_desc.like('%' + keyStr + '%'), CLink.l_tag.like('%' + keyStr + '%'),
                CLink.l_title.like('%' + keyStr + '%'))).limit(tpage).offset(offset).all()
        totalList = session.query(CLink).filter(
            or_(CLink.l_desc.like('%' + keyStr + '%'), CLink.l_tag.like('%' + keyStr + '%'),
                CLink.l_title.like('%' + keyStr + '%'))).count()  # 总记录数
        data = []
        for item in querySQL:
            data.append(item.to_json())
        resJson['flag'] = "success"
        resJson['msg'] = "查询成功"
        resJson['data'] = data
        resJson['totalList'] = totalList
    except exc.InvalidRequestError:
        session.rollback()
        resJson['msg'] = "查询失败"
    except Exception as e:
        print(str(type(e)))
        resJson['msg']=repr(e)
        session.rollback()
    return resJson

@linkmanager.route("/delete",methods=["POST"])
def deleteLinkModel():
    if request.method == "POST":
        resJson=deleteLink(request)
        return jsonify(resJson)

def deleteLink(request):
    reqJson=requestBody(request)
    idStr=reqJson['id']
    resJson = {
        "flag":"error",
        "msg":""
    }
    try:
        session.query(CLink).filter(CLink.id == idStr).delete(synchronize_session=False)
        resJson['flag'] = "success"
        resJson['msg'] = "删除成功"
    except exc.InvalidRequestError:
        session.rollback()
        resJson['msg'] = "删除失败"
    except Exception as e:
        print(str(type(e)))
        resJson['msg']=repr(e)
        session.rollback()
    return resJson

@linkmanager.route("update",methods=["POST"])
def updateLinkModel():
    if request.method == "POST":
        resJson=updateLink(request)
        return jsonify(resJson)

def updateLink(request):
    reqJson=requestBody(request)
    resJson={"flag":"error","msg":"数据更新失败"}
    l_id=reqJson.get("l_id")
    l_title=reqJson.get("title")
    l_url=reqJson.get("url")
    l_tag=reqJson.get("tags")
    l_desc=reqJson.get("desc")
    l_rate=reqJson.get("rate")
    l_userid=reqJson.get("userid")
    if l_id == None or l_id == "":
        resJson['msg']="数据ID不存在"
        return resJson
    if l_userid == None or l_userid == "":
        resJson['msg']="用户标识ID不存在"
        return resJson
    try:
        queryLink = session.query(CLink).filter(CLink.id == l_id).all()
        if len(queryLink) != 0:
            queryLink[0].l_title=l_title
            queryLink[0].l_url=l_url
            queryLink[0].l_tag=l_tag
            queryLink[0].l_desc=l_desc
            queryLink[0].l_rate=l_rate
            session.commit()
            resJson["flag"]="success"
            resJson["msg"]="数据更新成功"
    except exc.InvalidRequestError:
        session.rollback()
        resJson["msg"]="数据更新失败"
    except Exception as e:
        print(str(type(e)))
        resJson['msg']=repr(e)
        session.rollback()
    return resJson