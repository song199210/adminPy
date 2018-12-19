from flask import Flask,Blueprint,request,jsonify
from ..common import requestBody
from app.models import session,CodeM
from sqlalchemy import or_
from sqlalchemy.exc import InvalidRequestError
codemanager=Blueprint("codemanager",__name__)

'''
查询codem表中数据列表
filter关键字进行过滤
or_关键字需要从sqlalchemy中引入
like关键字做模糊查询
'''
@codemanager.route("/query",methods=["POST"])
def queryCode():
    print(request.method)
    if request.method == "POST":
        resJson=queryCodeModel(request)
        return jsonify(resJson)
def queryCodeModel(request):
    reqJson=requestBody(request)
    resJson={}
    data=[]
    keyStr=reqJson.get("keyStr")
    c_userid=reqJson.get("userid")
    resJson['flag'] = "error"
    resJson['msg'] = "查询失败"
    if c_userid == None or c_userid == "":
        resJson['msg']="用户ID不存在"
        return resJson
    try:
        queryData = session.query(CodeM).filter(
            or_(CodeM.c_title.like('%' + keyStr + '%'), CodeM.c_tag.like('%' + keyStr + '%'),
                CodeM.c_desc.like('%' + keyStr + '%s'))).all()
        if len(queryData) != 0:
            for item in queryData:
                print(type(item))
                data.append(item.to_json())
        else:
            data=[]
        resJson['flag']="success"
        resJson['msg']="查询成功"
        resJson['data']=data
    except InvalidRequestError:
        session.rollback()
        resJson['msg']="查询失败"
    except Exception as e:
        print(str(type(e)))
        resJson['msg']=repr(e)
        session.rollback()
    return resJson

#新增codem表中数据
@codemanager.route("/add",methods=["POST"])
def addCode():
    if request.method == "POST":
        resJson=addCodeModel(request)
        return jsonify(resJson)

def addCodeModel(request):
    reqJson=requestBody(request)
    resJson={"flag":"error","msg":"数据新增失败"}
    c_title=reqJson['c_title']
    c_tags=reqJson['c_tags']
    c_desc=reqJson['c_desc']
    c_userid=reqJson['userid']
    c_code=reqJson['code']
    c_code_type=reqJson['code_type']
    c_code_theme=reqJson['code_theme']
    c_code_fsize=reqJson['code_fsize']
    try:
        if c_userid == None or c_userid == "":
            resJson['msg']="用户标识不存在"
            return resJson
        codem=CodeM(c_title,c_tags,c_desc,c_userid,c_code,c_code_type,c_code_theme,c_code_fsize)
        session.add(codem)
        session.commit()
        resJson['flag']='success'
        resJson['msg']='数据新增成功'
    except InvalidRequestError:
        session.rollback()
        resJson['msg']='数据新增失败'
    except Exception as e:
        print(str(type(e)))
        resJson['msg']=repr(e)
        session.rollback()
    return resJson

#更新数据
@codemanager.route("/update",methods=["POST"])
def updateCode():
    if request.method == "POST":
        resJson=updateCodeModel(request)
        return jsonify(resJson)

def updateCodeModel(request):
    reqJson=requestBody(request)
    resJson={"flag":"error","msg":"数据更新失败"}
    c_id=reqJson['c_id']
    c_title=reqJson['c_title']
    c_tags=reqJson['c_tags']
    c_desc=reqJson['c_desc']
    c_userid=reqJson['userid']
    c_code=reqJson['code']
    c_code_type=reqJson['code_type']
    c_code_theme=reqJson['code_theme']
    c_code_fsize=reqJson['code_fsize']
    if c_userid == None or c_userid == "":
        resJson['msg']="用户标识ID不存在"
        return resJson
    try:
        queryData=session.query(CodeM).filter(CodeM.id==c_id).all()
        if len(queryData) != 0:
            dataJson=queryData[0]
            dataJson.c_title=c_title
            dataJson.c_tag=c_tags
            dataJson.c_desc=c_desc
            dataJson.c_code=c_code
            dataJson.c_code_type=c_code_type
            dataJson.c_code_theme=c_code_theme
            dataJson.c_code_fsize=c_code_fsize
            session.commit()
            resJson['flag']="success"
            resJson['msg']="数据更新成功"
    except InvalidRequestError:
        session.rollback()
        resJson['msg']="数据更新失败"
    except Exception as e:
        print(str(type(e)))
        resJson['msg']=repr(e)
        session.rollback()
    return resJson

#删除数据
@codemanager.route("delete",methods=['POST'])
def deleteCode():
    if request.method == "POST":
        resJson=deleteCodeModel(request)
        return jsonify(resJson)

def deleteCodeModel(request):
    reqJson=requestBody(request)
    resJson={"flag":"error","msg":"数据删除失败"}
    c_userid=reqJson['userid']
    c_id=reqJson['c_id']
    if c_userid == None or c_userid == "":
        resJson['msg']="用户表示不存在"
        return resJson
    elif c_id == None or c_id == "":
        resJson['msg']="请选择需要删除的记录"
        return resJson
    try:
        session.query(CodeM).filter(CodeM.id == c_id).delete(synchronize_session=False)
        resJson['flag']="success"
        resJson['msg']="删除成功"
    except InvalidRequestError:
        resJson['msg']="删除失败"
    except Exception as e:
        print(str(type(e)))
        resJson['msg']=repr(e)
        session.rollback()
    return resJson