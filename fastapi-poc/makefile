up:
	docker compose up -d

down: 
	docker compose kill
	docker compose rm -f

logs:
	docker compose logs -f app

shell:
	docker compose run --rm app sh

revision:
	docker compose run --rm app poetry run alembic revision --autogenerate -m "$(m)"

migrate:
	docker compose run --rm app poetry run alembic upgrade head

create_user:
	docker compose run --rm app poetry run python create_user.py
	