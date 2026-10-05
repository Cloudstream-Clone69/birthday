import os
import shutil

temp_dir = r"C:\Users\ayu12\.gemini\antigravity\brain\ae154fa1-0ae0-4eb7-8f03-7dea7bf8542b"
dest_dir = r"c:\Users\ayu12\Desktop\birthday\assets"

os.makedirs(dest_dir, exist_ok=True)

# Map filenames based on sorting
temp_files = sorted([f for f in os.listdir(temp_dir) if f.startswith("media__") and f.endswith(".jpg")])

mapping = {
    0: "pink_front.jpg",     # First sent: pink dress front
    1: "pink_side.jpg",      # Second sent: pink dress side
    2: "black_rock.jpg",     # Third sent: black dress rock sign
    3: "black_selfie.jpg",   # Fourth sent: black dress selfie
    4: "blue_walkway.jpg",   # Fifth sent: blue dress walkway
    5: "blue_closeup.jpg",   # Sixth sent: blue dress close up
    6: "blue_side.jpg"       # Seventh sent: blue dress side view
}

print(f"Found {len(temp_files)} files in temp media storage.")
for i, filename in enumerate(temp_files):
    if i in mapping:
        src = os.path.join(temp_dir, filename)
        dest = os.path.join(dest_dir, mapping[i])
        try:
            shutil.copy(src, dest)
            print(f"Copied {filename} -> {mapping[i]}")
        except Exception as e:
            print(f"Error copying {filename}: {e}")
