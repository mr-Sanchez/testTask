from db import engine
import models

engine.connect()

#models.Base.metadata.create_all(engine)
#models.Base.metadata.tables["user_phone"].create(bind = engine)
