import os
import shutil

temp_dir = r"C:\Users\ayu12\.gemini\antigravity\brain\ae154fa1-0ae0-4eb7-8f03-7dea7bf8542b"
dest_dir = r"c:\Users\ayu12\Desktop\birthday\assets"

os.makedirs(dest_dir, exist_ok=True)

temp_files = sorted([f for f in os.listdir(temp_dir) if f.startswith("media__") and f.endswith(".jpg")])

print(f"Total files in temp: {len(temp_files)}")

# If the original design screenshot is first, let's remove it
if len(temp_files) >= 8:
    screenshot_file = temp_files[0]
    print(f"Skipping screenshot file: {screenshot_file}")
    temp_files = temp_files[1:]

mapping = {
    0: "pink_front.jpg",     # Pink dress front near pool
    1: "pink_side.jpg",      # Pink dress side near pool
    2: "black_rock.jpg",     # Black dress sunglasses rock sign
    3: "black_selfie.jpg",   # Black dress selfie
    4: "blue_walkway.jpg",   # Blue dress under wooden arbor
    5: "blue_closeup.jpg",   # Blue dress close up portrait
    6: "blue_side.jpg"       # Blue dress standing side angle
}

for i, filename in enumerate(temp_files):
    if i in mapping:
        src = os.path.join(temp_dir, filename)
        dest = os.path.join(dest_dir, mapping[i])
        try:
            shutil.copy(src, dest)
            print(f"Copied {filename} -> {mapping[i]}")
        except Exception as e:
            print(f"Error copying {filename}: {e}")
