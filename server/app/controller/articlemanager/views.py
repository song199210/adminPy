from flask import request,Blueprint,jsonify
from app.models import ArticleM,ClassArticleM
from sqlalchemy import or_,and_
from sqlalchemy.exc import InvalidRequestError
from app.conect_db import session
from ..common import requestBody

articlemanager=Blueprint("articlemanager",__name__)

@articlemanager.route("/query",methods=['POST'])
def queryArticle():
    if request.method == "POST":
        resJson=queryArticleModel(request)
        return jsonify(resJson)
def queryArticleModel(request):
    reqJson=requestBody(request)
    ca_userid=reqJson['ca_userid']
    ca_keystr=reqJson['ca_keystr']  #关键字
    ca_classid=reqJson['ca_classid'] #分类ID
    pageno=reqJson['pageno']    #当前页
    pagesize=reqJson['pagesize']    #单页总记录数
    resData={
        "flag":"error",
        "msg":""
    }
    if ca_userid == None or ca_userid == "":
        resData['msg']="用户ID不存在"
        return resData
    try:
        queryData=session.query(ArticleM,ClassArticleM).outerjoin(ClassArticleM,ClassArticleM.id==ArticleM.a_classid).filter(or_(or_(ArticleM.a_title.like('%'+ca_keystr+'%'),ArticleM.a_tag.like('%'+ca_keystr+'%')),ArticleM.a_classid==ca_classid)).limit(pagesize).offset((pageno-1)*pagesize).all()
        totalNum=session.query(ArticleM).filter(or_(or_(ArticleM.a_title.like('%'+ca_keystr+'%'),ArticleM.a_tag.like('%'+ca_keystr+'%')),ArticleM.a_classid==ca_classid)).count()
        resData['flag']="success"
        resData['msg']="数据查询成功"
        data=[]
        for item in queryData:
            obj={}
            if len(item) != 0:
                for cItem in item:
                    obj.update(cItem.to_json())
            data.append(obj)
        resData['data']=data
        resData['total']=totalNum
    except InvalidRequestError:
        session.rollback()
        resData['msg']="数据查询失败"
    except Exception as e:
        print(str(type(e)))
        resData['msg']=repr(e)
        session.rollback()
    return resData
@articlemanager.route("/add",methods=['POST'])
def addArticle():
    if request.method == "POST":
        resJson=addArticleModel(request)
        return jsonify(resJson)
def addArticleModel(request):
    reqJson=requestBody(request)
    a_title=reqJson['a_title']
    a_content=reqJson['a_content']
    a_tag=reqJson['a_tag']
    a_desc=reqJson['a_desc']
    a_userid=reqJson['a_userid']
    a_classid=reqJson['a_classid']
    resData={
        "flag":"error",
        "msg":""
    }
    if a_userid == None or a_userid == "":
        resData['msg']="用户ID不存在"
        return resData
    try:
        articlem=ArticleM(a_title,a_content,a_classid,a_tag,a_desc,a_userid)
        session.add(articlem)
        session.commit()
        resData['flag']="success"
        resData['msg']="文章新增成功"
    except InvalidRequestError:
        session.rollback()
        resData['msg']="文章新增失败"
    except Exception as e:
        print(str(type(e)))
        resData['msg']=repr(e)
        session.rollback()
    return resData

@articlemanager.route("/update",methods=['POST'])
def updateArticle():
    if request.method == "POST":
        resJson=updateArticleModel(request)
        return jsonify(resJson)

def updateArticleModel(request):
    reqJson=requestBody(request)
    a_id=reqJson['a_id']
    a_title=reqJson['a_title']
    a_content=reqJson['a_content']
    a_tag=reqJson['a_tag']
    a_desc=reqJson['a_desc']
    a_userid=reqJson['a_userid']
    a_classid=reqJson['a_classid']
    resData={
        "flag":"error",
        "msg":""
    }
    if a_id == None or a_id == "":
        resData['msg']="文章ID不存在"
        return resData
    if a_userid == None or a_userid == "":
        resData['msg']="用户ID不存在"
        return resData
    try:
        queryData=session.query(ArticleM).filter_by(id=a_id).all()
        if len(queryData) !=0:
            queryData[0].a_title=a_title
            queryData[0].a_content=a_content
            queryData[0].a_classid=a_classid
            queryData[0].a_tag=a_tag
            queryData[0].a_desc=a_desc
            queryData[0].a_userid=a_userid
            session.commit()
            resData['flag']="success"
            resData['msg']="修改成功"
    except InvalidRequestError:
        session.rollback()
        resData['msg']="文章修改失败"
    except Exception as e:
        print(str(type(e)))
        resData['msg']=repr(e)
        session.rollback()
    return resData

@articlemanager.route("/delete",methods=["POST"])
def deleteArticle():
    if request.method == "POST":
        resJson=deleteArticleModel(request)
        return jsonify(resJson)
def deleteArticleModel(request):
    reqJson=requestBody(request)
    a_id=reqJson['a_id']
    a_userid=reqJson['a_userid']
    resData={
        "flag":"error",
        "msg":""
    }
    if a_id == None or a_id == "":
        resData['msg']="文章ID不存在"
        return resData
    if a_userid == None or a_userid == "":
        resData['msg']="用户ID不存在"
        return resData
    try:
        session.query(ArticleM).filter_by(id=a_id).delete(synchronize_session=False)
        resData['flag']="success"
        resData['msg']="删除成功"
    except InvalidRequestError:
        session.rollback()
        resData['msg']="删除失败"
    except Exception as e:
        print(str(type(e)))
        resData['msg']=repr(e)
        session.rollback()
    return resData