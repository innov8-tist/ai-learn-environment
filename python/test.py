import google.auth
from google.auth.transport.requests import Request
from google.auth import exceptions

# Get credentials and set the correct scopes
credentials, project = google.auth.default(scopes=["https://www.googleapis.com/auth/cloud-platform"])
print(project)
# Ensure credentials are refreshed before making requests
if credentials.expired and credentials.refresh_token:
    credentials.refresh(Request())
