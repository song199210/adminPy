from flask import Flask,Blueprint,request,make_response,jsonify
from app.models import User
from app.conect_db import session
from sqlalchemy.exc import InvalidRequestError
#引入公共文件common
from ..common import requestBody

login=Blueprint("login",__name__)

@login.route("/",methods=['POST'],strict_slashes=False)
def to_login():
    if request.method == "POST":
        dataJson=requestBody(request)
        res=isLogin(dataJson)
    return jsonify(res)

def isLogin(loginData):
    uname=loginData.get("uname")
    pwd=loginData.get("pwd")
    resData={ #返回的JSON字符串
        "flag":"error",
        "msg":""
    }
    try:
        ures = session.query(User).filter(User.uname == uname).all()
        if len(ures) != 0:
            dictUser = ures[0].to_json()
            if dictUser['pwd'] == pwd:
                if dictUser['active'] == 0:
                    resData['msg'] = "对不起，该账号还未激活!"
                else:
                    resData['flag'] = "success"
                    resData['msg'] = "登录成功!"
                    data = {"userid": dictUser["userid"]}
                    resData['data'] = data
            else:
                resData['msg'] = "密码错误!"
        else:
            resData['msg'] = "用户名错误!"
    except InvalidRequestError:
        session.rollback()
        resData['msg']="查询失败"
    except Exception as e:
        print(str(type(e)))
        resData['msg']=repr(e)
        session.rollback()

    return resData