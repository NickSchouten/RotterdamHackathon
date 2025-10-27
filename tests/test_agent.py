"""Basic tests for the Atlance agent."""


def test_basic():
    """A placeholder test to ensure pytest can run."""
    assert True


def test_agent_import():
    """Test that we can import the root_agent."""
    from src.atlance.agent import root_agent  # noqa: F401

    assert root_agent is not None
