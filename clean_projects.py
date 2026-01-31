import json

with open('frontend/src/data/projects.json', 'r') as f:
    projects = json.load(f)

valid_projects = [p for p in projects if p['title'].strip() != ""]

with open('frontend/src/data/projects.json', 'w') as f:
    json.dump(valid_projects, f, indent=2, ensure_ascii=False)
