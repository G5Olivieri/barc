import os
import sys
from contextlib import asynccontextmanager

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from barc.appointment.infrastructure.routers import routers as appointment_routers
from barc.auth.routers import routers as auth_routers
from barc.barber.infrastructure.routers import routers as barber_routers
from barc.service.infrastructure.routers import routers as service_routers
from barc.dependencies import get_settings, get_db_engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    settings = get_settings()
    engine = get_db_engine(settings)
    await engine.dispose()

app = FastAPI(lifespan=lifespan)
app.include_router(appointment_routers)
app.include_router(barber_routers)
app.include_router(service_routers)
app.include_router(auth_routers)

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
