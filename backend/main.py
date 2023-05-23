import configparser

import uvicorn
import os

from pathlib import Path

from app import create_app

config = configparser.ConfigParser()
config.read(str(Path(__file__).parent) + r"/app/config.ini")


if __name__ == '__main__':
    uvicorn.run("main:app", host=config['SERVER']['Host'], port=int(config['SERVER']['Port']),
                log_level="info", reload=True, reload_dirs=["app"])
else:
    app = create_app()
