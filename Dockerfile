#RUN npm install

# build necessary, even if no static files are needed,
# since it builds the server as well
#RUN npm run build

# expose 5000 on container
#EXPOSE 5000

# set app serving to permissive / assigned
#ENV NUXT_HOST=0.0.0.0
#ENV HOST 0.0.0.0
# set app port
#ENV NUXT_PORT=5000

# start the app
#CMD [ "npm", "run", "start" ]

FROM node:16.13.1
ENV APP_ROOT /pomogatorus.ru

# ENV NODE_ENV production

WORKDIR ${APP_ROOT}
ADD . ${APP_ROOT}

RUN npm ci
RUN npm run build

CMD ["npm", "run", "start"]
