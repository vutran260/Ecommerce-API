

.PHONY:
start-db:
	docker-compose -f database/docker-compose.yml up -d

.PHONY:
deploy:
	docker build --platform linux/amd64 -t linkpalette-be .
	docker image save linkpalette-be > app.tar
	scp ./app.tar root@167.179.91.247:/root/link_palette/app_be/app.tar
	ssh -t root@167.179.91.247 'cd /root/link_palette/app_be/; make deploy'
	rm -rf app.tar


.PHONY:
deploy-uat:
	docker build --platform linux/amd64 -t linkpalette-be-uat .
	docker image save linkpalette-be-uat > linkpalette-be-uat.tar
	scp ./linkpalette-be-uat.tar root@167.179.91.247:/root/link_palette/uat/app_be/linkpalette-be-uat.tar
	ssh -t root@167.179.91.247 'cd /root/link_palette/uat/app_be/; make deploy'
	rm -rf linkpalette-be-uat.tar