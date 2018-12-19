from flask_mail import Message
from threading import Thread
from itsdangerous import URLSafeTimedSerializer
from app import app,mail

def send_email(subject,template,email):
    msg=Message(
        subject="Hello,eMail",
        sender='1821908096@qq.com',
        recipients=[email]
    )
    msg.body = 'sended by flask-email'
    msg.html = template
    thread=Thread(target=send_async_email,args=(app,msg))
    thread.start()
    print("邮件发送成功")

def send_async_email(app,msg):
    with app.app_context():
        mail.send(msg)

    
 #生成令牌字符串
def generate_confirmation_token(email):
    s=URLSafeTimedSerializer(app.config['SECRET_KEY'])
    urlStr=s.dumps(email,salt=app.config['SECURITY_PASSWORD_SALT'])
    return urlStr

#解析令牌字符串
def confirm_token(token,expiration=3600):
    serializer=URLSafeTimedSerializer(app.config['SECRET_KEY'])
    try:
        email=serializer.loads(
            token,
            salt=app.config['SECURITY_PASSWORD_SALT'],
            max_age=expiration
        )
    except:
        return False
    return email