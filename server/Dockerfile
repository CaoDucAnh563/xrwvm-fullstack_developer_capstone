# Giai đoạn 1: Build giao diện React
FROM node:18-slim AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN CI=false npm run build
FROM python:3.10-slim
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app

COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt gunicorn

COPY . /app/
COPY --from=frontend-builder /frontend/build /app/frontend/build

RUN python3 manage.py makemigrations --noinput && \
    python3 manage.py migrate --run-syncdb --noinput && \
    python3 manage.py collectstatic --noinput || true

EXPOSE 8000
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-8000} --workers 3 djangoproj.wsgi:application"]
