#!/usr/bin/env bash

# This script ensures your FastAPI app listens on the port provided by Render
# The uvicorn command format is: module.variable_name
uvicorn app.main:app --host 0.0.0.0 --port $PORT