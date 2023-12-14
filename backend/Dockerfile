FROM python:3.11
WORKDIR /app
COPY . /app
RUN pip install pipenv
RUN pipenv install
CMD pipenv run gunicorn -w 3 app:app
