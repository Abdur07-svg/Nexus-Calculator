import os
import glob

html_files = glob.glob('e:/PROJECT/Calculator/other/*.html')

old_style = 'style="position: relative; display: flex; align-items: center; justify-content: center; padding: 24px 0 10px 0;"'
new_style = 'style="position: sticky; top: -16px; background-color: var(--calc-bg); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 24px 0 10px 0;"'

for f_path in html_files:
    with open(f_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace(old_style, new_style)
    
    with open(f_path, 'w', encoding='utf-8') as f:
        f.write(content)
