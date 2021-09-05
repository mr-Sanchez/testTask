from config import DB_ENGINE, DB_CONNECTOR, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

dbschema='travov'

engine = create_engine(
    f'{DB_ENGINE}+{DB_CONNECTOR}://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}',
    connect_args={'options': '-csearch_path={}'.format(dbschema)}
)

session = sessionmaker(bind=engine)

def start_session(func):
    def wrapper(*args, **kwargs):
        s = session()
        result = func(*args, s, **kwargs)
        s.commit()
        s.close()
        return result
    return wrapper