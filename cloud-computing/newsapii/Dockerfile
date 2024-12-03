# Gunakan image Python sebagai base image
FROM python:3.13-slim

# Set direktori kerja
WORKDIR /app

# Salin file requirements.txt dan instal dependensi
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Salin semua file aplikasi ke dalam container
COPY . .

# Ekspos port yang digunakan oleh Flask
EXPOSE 8080

# Perintah untuk menjalankan aplikasi Flask
CMD ["python", "app.py"]
