
# -*- coding: utf-8 -*-
from sqlalchemy import Column,String,Integer,Text,DateTime,Float,ForeignKey
from .conect_db import session,Base,init_db
import datetime,uuid

class User(Base): #创建用户表
    __tablename__="user"
    id=Column(Integer,primary_key=True)
    uname=Column(String(80),unique=True)
    pwd=Column(String(100)) #密码
    email=Column(String(80),unique=True)
    userid=Column(String(80),unique=True)
    datetime=Column(DateTime)
    active=Column(Integer,default=0)

    def __init__(self,uname,pwd,email):
        self.uname=uname
        self.pwd=pwd
        self.email=email
        self.userid=str(uuid.uuid1())
        self.datetime=datetime.datetime.now()

    def to_json(self):
        dict=self.__dict__
        if "_sa_instance_state" in dict:
            del dict['_sa_instance_state']
        return dict

    def __repr__(self):
        return '<User %r>' % self.uname

class CLink(Base): #网址连接收藏功能
    __tablename__="clink"
    id=Column(Integer,primary_key=True) #link址id
    l_title=Column(String(100))  #link标题
    l_url=Column(String(100))    #link url
    l_tag=Column(String(80)) #link标签
    l_desc=Column(Text) #link描述
    l_rate=Column(Float)
    l_userid=Column(String(60)) #用户ID
    l_datetime=Column(DateTime) #link收藏时间
    def __init__(self,l_title,l_url,l_tag,l_desc,l_rate,l_userid):
        self.l_title=l_title    #标题
        self.l_url=l_url #url
        self.l_tag=l_tag    #标签
        self.l_desc=l_desc  #备注
        self.l_rate=l_rate
        self.l_userid=l_userid  #用户ID
        self.l_datetime=datetime.datetime.now() #创建时间
    def __repr__(self):
        return '<Link %r>' % self.l_title
    def to_json(self):
        dict = self.__dict__
        dict['l_datetime']=dict['l_datetime'].strftime('%Y-%m-%d %H:%M:%S')
        if "_sa_instance_state" in dict:
            del dict["_sa_instance_state"]
        return dict

class CodeM(Base):
    __tablename__="codem"
    id=Column(Integer,primary_key=True)
    c_title=Column(String(100))
    c_tag=Column(String(100))
    c_desc=Column(Text)
    c_datetime=Column(DateTime)
    c_userid=Column(String(60))
    c_code=Column(Text)
    c_code_type=Column(String(40))
    c_code_theme=Column(String(40))
    c_code_fsize=Column(Integer)
    def __init__(self,c_title,c_tag,c_desc,c_userid,c_code,c_code_type,c_code_theme,c_code_fsize):
        self.c_title=c_title
        self.c_tag=c_tag
        self.c_desc=c_desc
        self.c_userid=c_userid
        self.c_datetime=datetime.datetime.now()
        self.c_code=c_code
        self.c_code_type=c_code_type
        self.c_code_theme=c_code_theme
        self.c_code_fsize=c_code_fsize
    def to_json(self): #将CodeM转成字典数据
        dict = self.__dict__
        dict['c_datetime'] = dict['c_datetime'].strftime('%Y-%m-%d %H:%M:%S')
        if "_sa_instance_state" in dict:
            del dict["_sa_instance_state"]
            return dict
    def __repr__(self):
        return '<CodeM %r>' %self.__tablename__

class ArticleM(Base):
    __tablename__="article"
    id=Column(Integer,primary_key=True)
    a_title=Column(String(100)) #标题
    a_content=Column(Text(length=(2**32)-1))  #内容
    a_classid=Column(String(60)) #分类ID
    a_tag=Column(String(100)) #标签
    a_desc=Column(Text) #文章简介
    a_userid=Column(String(60)) #用户ID
    a_datetime=Column(DateTime) #时间
    def __init__(self,a_title,a_content,a_classid,a_tag,a_desc,a_useid):
        self.a_title=a_title
        self.a_content=a_content
        self.a_classid=a_classid
        self.a_tag=a_tag
        self.a_desc=a_desc
        self.a_userid=a_useid
        self.a_datetime=datetime.datetime.now()
    def to_json(self):
        dict=self.__dict__
        dict['a_datetime']=dict['a_datetime'].strftime('%Y-%m-%d %H:%M:%S')
        if "_sa_instance_state" in dict:
            del dict['_sa_instance_state']
        return dict
    def __repr__(self):
        return '<ArticleM %r>' %self.__tablename__

class ClassArticleM(Base):  #文章分类
    __tablename__="classarticle"
    id=Column(Integer,primary_key=True)
    ca_title=Column(String(60))
    ca_userid=Column(String(60))
    ca_datetime=Column(DateTime)
    def __init__(self,ca_title,ca_userid):
        self.ca_title=ca_title
        self.ca_userid=ca_userid
        self.ca_datetime=datetime.datetime.now()
    def __repr__(self):
        return '<ClassArticleM %r>' %self.__tablename__
    def to_json(self):
        dict=self.__dict__
        #dict['ca_datetime']=dict['ca_datetime'].strftime('%Y-%h-%d %H:%M:%S')
        if "_sa_instance_state" in dict:
            del dict['_sa_instance_state']
        return dict

init_db()