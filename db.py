from config import DB_ENGINE, DB_CONNECTOR, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME
from sqlalchemy import create_engine

dbschema='travov'

engine = create_engine(
    f'{DB_ENGINE}+{DB_CONNECTOR}://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}',
    connect_args={'options': '-csearch_path={}'.format(dbschema)}
)