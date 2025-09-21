# Backend Agent

A Python backend agent project built with Google ADK.

## Prerequisites

- Python 3.11 or higher
- [uv](https://docs.astral.sh/uv/) package manager

## Installation

### 1. Install uv (if not already installed)

```bash
# On macOS and Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# On Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Or using pip
pip install uv
```

### 2. Clone and Setup Project

```bash
# Clone the repository
git clone <your-repo-url>
cd backend_agent

# Create virtual environment and install dependencies
uv sync
```

### 3. Activate Virtual Environment

```bash
# Activate the virtual environment
source .venv/bin/activate

# On Windows
.venv\Scripts\activate
```

### 4. Verify Installation

```bash
# Check Python version
python --version

# Check installed packages
uv pip list
```

## Development

### Running the Application

```bash
# Make sure virtual environment is activated
source .venv/bin/activate

# Navigate to the travel-agent directory
cd travel-agent

# Run the ADK API server
adk api_server --allow_origins="*"
```

The server will start and be accessible at the default ADK port (typically http://localhost:8000).

### Adding Dependencies

```bash
# Add a new dependency
uv add package-name

# Add a development dependency
uv add --dev package-name

# Sync dependencies after manual changes to pyproject.toml
uv sync
```

### Managing Virtual Environment

```bash
# Deactivate virtual environment
deactivate

# Remove virtual environment
rm -rf .venv

# Recreate virtual environment
uv sync
```

## Project Structure

```
backend_agent/
├── main.py                 # Main application entry point
├── pyproject.toml         # Project configuration and dependencies
├── uv.lock               # Locked dependency versions
├── .python-version       # Python version specification
├── travel-agent/         # Travel agent module (ADK project)
│   ├── README.md
│   └── travel_agent/
│       ├── __init__.py
│       ├── agent.py      # Main agent definition with Google ADK
│       └── instructions.py # Agent instructions and prompts
└── README.md
```

## ADK Server

This project uses Google's Agent Development Kit (ADK) to create a travel agent. The agent is defined in `travel-agent/travel_agent/agent.py` and includes:

- **Travel Agent**: Built with Google ADK using Gemini 2.0 Flash model
- **Tools**: Google Search integration for real-time information
- **Output Schema**: Structured travel itinerary with news, activities, hotels, restaurants, flights, and weather information

## Dependencies

- **google-adk**: Google Agent Development Kit for building AI agents

## Troubleshooting

### Common Issues

1. **Python version mismatch**: Ensure you have Python 3.11+ installed
   ```bash
   python --version
   ```

2. **uv not found**: Make sure uv is installed and in your PATH
   ```bash
   uv --version
   ```

3. **Virtual environment issues**: Remove and recreate the environment
   ```bash
   rm -rf .venv
   uv sync
   ```

4. **ADK server not starting**: Make sure you're in the correct directory
   ```bash
   # Ensure you're in the travel-agent directory
   cd travel-agent
   adk api_server --allow_origins="*"
   ```

5. **ADK command not found**: Ensure google-adk is properly installed
   ```bash
   uv pip list | grep google-adk
   ```

### Getting Help

- [uv Documentation](https://docs.astral.sh/uv/)
- [Python Virtual Environments Guide](https://docs.python.org/3/tutorial/venv.html)
