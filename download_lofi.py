import urllib.request
import os

url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
dest_path = r"c:\Users\ayu12\Desktop\birthday\assets\sharmili.mp3"

os.makedirs(os.path.dirname(dest_path), exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

try:
    print(f"Downloading test audio fallback to {dest_path}...")
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=20) as response:
        with open(dest_path, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
    print(f"Successfully downloaded audio fallback! ({len(data)} bytes)")
except Exception as e:
    print(f"Error downloading audio: {e}")
