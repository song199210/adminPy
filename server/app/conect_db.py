from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

connect = create_engine("mysql://root:root1234@localhost:3306/web_db?charset=utf8&autocommit=true",
                        convert_unicode=True, encoding="utf8", echo=True)  # 创建数据库连接引擎
session_class = sessionmaker(bind=connect)  # 生成数据库会话类
session = session_class()  # 连接数据库
Base = declarative_base()  # 让Base类的子类与数据库表关联
def init_db(): #创建数据库表结构
    Base.metadata.create_all(connect)

def drop_db(): #删除数据库表结构
    Base.metadata.drop_all(connect)