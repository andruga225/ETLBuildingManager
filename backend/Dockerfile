# Base image
FROM python:3.9
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/backend
COPY ./requirements.txt /usr/src/app/backend/requirements.txt
WORKDIR /usr/src/app/backend
RUN pip install -r requirements.txt
ENV HOST=0.0.0.0
ENV PORT=5000
COPY . .
EXPOSE 5000
CMD [ "python", "./main.py"]