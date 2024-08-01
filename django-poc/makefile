up:
	docker compose up -d

down: 
	docker compose kill
	docker compose rm -f

logs:
	docker compose logs -f app

shell:
	docker compose run --rm app sh

migrations:
	docker compose run --rm app poetry run python manage.py makemigrations

migrate:
	docker compose run --rm app poetry run python manage.py migrate

createsuperuser:
	docker compose run --rm app poetry run python manage.py createsuperuser --username glayson --email glayson@email.com --skip-checks
	