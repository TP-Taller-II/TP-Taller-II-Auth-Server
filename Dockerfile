FROM node:12

ENV DD_ENV "prod"
# ARG DD_API_KEY

# Add Datadog repository and signing keys
RUN sh -c "echo 'deb https://apt.datadoghq.com/ stable 7' > /etc/apt/sources.list.d/datadog.list"
RUN apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 A2923DFF56EDA6E76E55E492D3A80E30382E94DE
RUN apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 D75CEA17048B9ACBF186794B32637D44F14F620E

# Install the Datadog agent
RUN apt-get update && apt-get -y --force-yes install --reinstall datadog-agent

# RUN DD_AGENT_MAJOR_VERSION=7 DD_API_KEY=<> DD_SITE="datadoghq.com" bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_script.sh)"

WORKDIR /app
COPY package*.json ./

RUN npm install nodemon
RUN npm install --production

COPY . .

# Copy Datadog configuration
COPY datadog-config/ /etc/datadog-agent/

EXPOSE $PORT
CMD [ "npm", "run", "heroku:start" ]
