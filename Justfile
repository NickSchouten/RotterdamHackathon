# Justfile for deploying newstrail
ARGS_TEST := env("_UV_RUN_ARGS_TEST", "")

# Default recipe - show available commands
default:
    @just --list

# ============================================================================
# Local Development
# ============================================================================

# Install dependencies using uv
[group('lifecycle')]
install:
    uv sync

# Install pre-commit hooks
[group('lifecycle')]
install-precommit:
    uvx pre-commit install

# Run the ADK UI server
[group('run')]
agent-ui:
    cd python && uv run --env-file=.env adk web .

# Run linter
[group('dev')]
lint:
    uv run ruff check .

# Format code
[group('dev')]
format:
    uv run ruff format .

# Run pre-commit hooks on all files
[group('dev')]
precommit:
    uvx pre-commit run --all-files

# Run all tests
[group('dev')]
test:
    uv run --env-file=.env pytest tests {{ ARGS_TEST }}

# Authenticate with Google Cloud
[group('dev')]
auth:
    gcloud auth application-default login
