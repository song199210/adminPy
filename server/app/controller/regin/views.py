from flask import Blueprint,request,jsonify,redirect,url_for
from app.models import User
from app.conect_db import session
from ..common import requestBody
from app.mail import send_email,generate_confirmation_token,confirm_token
from sqlalchemy.exc import InvalidRequestError

from config import LINK_URI #URI配置文件

regin=Blueprint("regin",__name__)

@regin.route("/",methods=['POST'],strict_slashes=False)
def to_regin():
    if request.method == "POST":
        dataJson=requestBody(request)
        result=isRegin(dataJson)
    return jsonify(result)

def isRegin(reginData):
    uname=reginData.get("uname")
    pwd=reginData.get("pwd")
    email=reginData.get("email")
    resData={
        "flag":"error",
        "msg":""
    }  #返回的JSON字符串
    try:
        qData1 = session.query(User).filter_by(uname=uname).all()
        qData2 = session.query(User).filter_by(email=email).all()
        if len(qData1) != 0:
            resData['msg']="用户已存在"
        elif len(qData2) != 0:
            resData['msg']="该邮箱已注册"
        else:
            user=User(uname,pwd,email)
            session.add(user)
            session.commit()
            resData['flag']="success"
            resData['msg']="账号注册成功"
            token=generate_confirmation_token(email)
            htmlStr='<h4>欢迎您注册，请单击<a href="'+LINK_URI+'/regin/email?qt='+token+'" target="_blank">立即激活</a>进行激活</h4>'
            send_email("测试邮件",htmlStr,email)
    except InvalidRequestError:
        session.rollback()
        resData['msg']="账号注册失败"
    except Exception as e:
        print(str(type(e)))
        resData['msg']=repr(e)
        session.rollback()
    return resData

@regin.route("/email",methods=["GET"],strict_slashes=False)
def rEmail():
    data=requestBody(request)
    emailStr=confirm_token(data['qt'])
    try:
        query = session.query(User).filter_by(email=emailStr).all()
        if len(query) != 0:
            query[0].active = 1
            session.commit()
    except InvalidRequestError:
        session.rollback()
    except Exception as e:
        print(e)

    return redirect(LINK_URI+"/#/email")

