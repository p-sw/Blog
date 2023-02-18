FROM python:3.11.1-alpine

WORKDIR /app

COPY server.py pydantic_models.py Pipfile Pipfile.lock prodlog.ini db /app/

RUN pip install pipenv && pipenv install --system --deploy

EXPOSE 8000

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000", "--log-config", "prodlog.ini"]