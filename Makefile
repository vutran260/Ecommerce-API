

.PHONY:
start-db:
	docker-compose -f database/docker-compose.yml up -d

.PHONY:
gen-db-entity:
	npx typeorm-model-generator -h localhost -d link-palette-dev -u link-palette -x P@ssw0rd -e postgres -o ./src/entity/. -s public -p 1111