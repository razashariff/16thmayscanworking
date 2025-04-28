
FROM ghcr.io/zaproxy/zaproxy:stable

# Install Python and pip
USER root
RUN apt-get update && apt-get install -y python3 python3-pip

# Install FastAPI and other dependencies
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Copy the API code
COPY app.py .
COPY zap_handler.py .

# Expose the port
EXPOSE 8000

# Run the FastAPI app
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
