import urllib.request
import json
import ssl

api_key = "xpl_0254e846fa9ca81a0126cc23f96798c3ba2db75d"
ctx = ssl.create_default_context()

print("1. Validating API Key against Experiential Labs endpoint (https://api.experientiallabs.ai/v1/models)...")
req = urllib.request.Request(
    "https://api.experientiallabs.ai/v1/models",
    headers={"Authorization": f"Bearer {api_key}"}
)

try:
    with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
        if resp.getcode() == 200:
            data = json.loads(resp.read().decode('utf-8'))
            models_count = len(data.get('data', []))
            print(f"   STATUS: 200 OK")
            print(f"   Authenticated successfully! {models_count} models retrieved.")
            print("\n---------------------------------------------------")
            print("API Key Status: WORKING & VALID (Experiential Labs Gateway)")
            print("---------------------------------------------------")
        else:
            print(f"   Unexpected status code: {resp.getcode()}")
except urllib.error.HTTPError as e:
    print(f"   HTTP Error {e.code}: {e.reason}")
    body = e.read().decode('utf-8') if e.fp else ""
    print(f"   Details: {body[:200]}")
except Exception as e:
    print(f"   Error: {e}")
