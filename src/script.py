import os
import re

input_folder = './styles'
output_folder = './output-css'

# Create output folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

# Process all CSS files
for filename in os.listdir(input_folder):
    if filename.endswith('.css'):
        input_path = os.path.join(input_folder, filename)
        output_path = os.path.join(output_folder, filename)
        
        print(f"\nProcessing: {filename}")
        
        with open(input_path, 'r', encoding='utf-8') as f:
            css = f.read()
        
        # Replace vw with rem and log changes
        def replace_and_log(match):
            vw_value = float(match.group(1))
            rem_value = vw_value * 1.2
            rem_str = f"{rem_value:.4f}".rstrip('0').rstrip('.')
            print(f"  {vw_value}vw -> {rem_str}rem")
            return f"{rem_str}rem"
        
        css = re.sub(r'(\d+\.?\d*)vw', replace_and_log, css)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(css)

print('\nCSS files transformed successfully!')
