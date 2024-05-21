FROM mhart/alpine-node:12.19.1

LABEL "com.github.actions.name"="Image 2 Map"
LABEL "com.github.actions.description"="Generate Map Tiles"
LABEL "com.github.actions.icon"="message-square"
LABEL "com.github.actions.color"="gray-dark"

LABEL "repository"="https://github.com/LeGitHubDeTai/Map_Display"
LABEL "homepage"="https://github.com/LeGitHubDeTai/Map_Display"
LABEL "maintainer"="Tai Studio <tai.studio@outlook.fr>"
LABEL "version"="1.0.0"

ADD package.json package-lock.json /
RUN npm install
ADD main.js /
RUN chmod +x /main.js

ENTRYPOINT ["node", "/main.js"]