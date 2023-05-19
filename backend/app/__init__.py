from fastapi import FastAPI
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request

from app.API.v1.database import db_router
from app.API.v1.etl import etl_router


def create_app():
    origins = ['*']

    middleware = [
        Middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"]
        )
    ]
    app = FastAPI(middleware=middleware)

    app.include_router(etl_router, prefix="/api")
    app.include_router(db_router, prefix="/api")
    # engine = create_db_engine()
    #
    # local_session_factory = create_session_factory(engine)

    # @app.middleware("http")
    # async def db_session_middleware(request: Request, call_next):
    #     # response = Response("Internal server error", status_code=500)
    #     # try:
    #     #     #request.state.db = local_session_factory()
    #     #     #request.state.db = db
    #     #     response = await call_next(request)
    #     # except ValueError as e:
    #     #     response = JSONResponse({"err": str(e)}, status_code=400)
    #     # finally:
    #     #     request.state.db.close()
    #     # return response
    #     print('before')
    #     response = await call_next(request)
    #     print('after')
    #     return response

    return app

