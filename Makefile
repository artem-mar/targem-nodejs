install:
	npm install

full-install:
	make install & make install-client

start:
	npm start


start-client:
	npm run start & npm run client