# 代码管理系统
### 利用flask技术实现web后台服务，react框架实现前端功能
#### 实现功能
1. 登录和注册账号功能(邮箱验证，邮箱激活)
1. 网址管理功能模块(查询，分页，新增，编辑，删除功能)
1. 代码管理功能模块(查询，新增，编辑，删除功能)
#### 项目利用技术
1. python的Flask框架
1. Mysql数据库
1. React框架
1. antd框架（属于React UI框架）
1. react-ace组件实现代码在线编辑功能

## 安装方式
##### web目录配置安装
1. 安装create-react-app脚手架工具
1. 将web/src中的src目录复制替换脚手架生成的src目录
1. 运行npm start命令执行项目
##### server目录配置安装
> python版本3.5.2，pip版本18.0
1. 安装python虚拟环境，这里用的是venv(python -m flask，这里flask为虚拟环境名称)
1. 在安装目录下运行flask\Scripts\activate命令进入虚拟环境
1. 安装__init__.py文件中出现的依赖包(pip install xxx)
1. 运行python home.py runserver命令启动web服务