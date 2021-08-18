from sqlalchemy import Integer, String, Column, DateTime, \
    ForeignKey, Boolean, Text, ForeignKeyConstraint, PrimaryKeyConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'user'
    id = Column('user_id', Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    middle_name = Column(String(100))
    bornDate = Column(DateTime(), nullable=False)
    gender = Column(String, nullable=False)
    
    user_info = relationship('UserInfo', backref='user', uselist=False)

    __table_args__ = (
        PrimaryKeyConstraint('user_id'),
    )

class UserInfo(Base):
    __tablename__ = 'user_info'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.user_id'))
    education = Column(String(255))
    comment = Column(Text)
    citizenship = Column(Boolean, default=False)

    __table_args__ = (
        ForeignKeyConstraint(['user_id'], ['user.user_id']),
    )