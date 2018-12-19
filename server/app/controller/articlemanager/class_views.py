from flask import Blueprint,request,jsonify
from sqlalchemy.exc import InvalidRequestError
from app.conect_db import session
from app.models import ClassArticleM
from ..common import requestBody
classarticle=Blueprint("classarticle",__name__)

@classarticle.route("query",methods=['POST'])
def queryCArticle():
    if request.method == "POST":
        resJson=queryCArticleModel(request)
        return jsonify(resJson)
def queryCArticleModel(request):
    reqJson=requestBody(request)
    userid=reqJson['userid']
    resData={
        "flag":"error",
        "msg":""
    }
    if userid == None or userid == "":
        resData['msg']="用户ID不存在"
    try:
        query=session.query(ClassArticleM).filter_by(ca_userid=userid).all()
        resData['flag']="success"
        if len(query) != 0:
            data=[]
            for item in query:
                data.append(item.to_json())
            resData['data']=data
        else:
            resData['data']=[]
    except InvalidRequestError:
        session.rollback()
        resData['msg']="文章类型查询失败"
    except Exception as e:
        session.rollback()
        resData['msg']=repr(e)
        print(repr(e))
    return resData