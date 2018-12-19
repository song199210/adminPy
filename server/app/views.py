# -*- coding: utf-8 -*-
from flask import Flask,redirect,render_template,url_for,jsonify,g,request,current_app
from app import app

from .controller.login.views import login
from .controller.regin.views import regin
from .controller.linkmanager.views import linkmanager
from .controller.codemanager.views import codemanager
from .controller.articlemanager.views import articlemanager
from .controller.articlemanager.class_views import classarticle

app.register_blueprint(login,url_prefix="/login")
app.register_blueprint(regin,url_prefix="/regin")
app.register_blueprint(linkmanager,url_prefix="/linkmanager")
app.register_blueprint(codemanager,url_prefix="/codemanager")
app.register_blueprint(articlemanager,url_prefix="/articlemanager")
app.register_blueprint(classarticle,url_prefix="/classarticle")

@app.route("/test",methods=["GET"])
def test():
    obj={"title":"测试服务","content":"启动成功"}
    return render_template("test.html",data=obj)

@app.errorhandler(404)
def page_not_fount(error):
    resData=dict(flag="error",msg="404不存在")
    return jsonify(resData)

@app.errorhandler(500)
def page_error_500(error):
    resData=dict(flag="error",msg="500服务器内部错误")
    return jsonify(resData)

@app.before_first_request
def before_first_request():
    print("before first request started")
    print(request.url)

@app.before_request
def before_request():
    print("before request started")
    print(request.url)
    g.name="SampleApp"

@app.after_request
def after_request(response):
    print("after request finished")
    print(request.url)
    response.headers['key']="value"
    return response

@app.teardown_request
def teardown_request(exception):
    print("teardown request")
    print(request.url)
    