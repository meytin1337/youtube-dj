FROM python:3.11
WORKDIR /app
COPY Pipfile Pipfile.lock /app/
RUN pip install pipenv
RUN pipenv install
COPY . /app
CMD pipenv run gunicorn -w 3 -b 0.0.0.0:8000 app:app
