FROM python:3.9

RUN apt-get update
RUN curl -LO https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install -y ./google-chrome-stable_current_amd64.deb
RUN rm google-chrome-stable_current_amd64.deb 

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./main.py /code/

# Do this so chrome can run 
# https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-in-docker
# RUN useradd -rm -d /home/ubuntu -s /bin/bash -g root -G sudo -u 1001 ubuntu
# USER ubuntu
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]

# RUN COMMMAND 
# docker build -t gorjus-imagen .
# docker run --privileged -p 9000:80 -v test:/app gorjus-imagen:latest
