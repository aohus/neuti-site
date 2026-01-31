import csv
import json
import re

def parse_projects():
    projects = []
    
    # Read the file content
    with open('assets/content_text/공사실적.md', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Skip header
    data_lines = lines[1:]
    
    current_id = 1
    
    for line in data_lines:
        line = line.strip()
        if not line:
            continue
            
        # Basic CSV parsing (handling simple commas)
        # The format is: 연번, 공종, 공사명, 원도급/하도급, 발주처
        # Some lines might be malformed
        
        parts = [p.strip() for p in line.split(',')]
        
        if len(parts) < 3:
            continue
            
        # Attempt to map fields
        # Ideally: [id, category, title, role, client]
        
        category = parts[1] if len(parts) > 1 else "기타"
        title = parts[2] if len(parts) > 2 else ""
        role = parts[3] if len(parts) > 3 else ""
        client = parts[4] if len(parts) > 4 else ""
        
        # Extract year from title
        year_match = re.search(r'(20\d{2})', title)
        year = year_match.group(1) if year_match else "2024" # Default to 2024 if not found, or maybe just undefined
        
        # Clean up category
        if "조경" in category:
            category = "조경식재"
        elif "나무병원" in category:
            category = "나무병원"
        
        project = {
            "id": current_id,
            "title": title,
            "category": category,
            "client": client,
            "role": role,
            "year": year,
            "description": f"{client} {title}",
            "tags": [category],
            "image": "/images/projects/placeholder.jpg" # Placeholder for now
        }
        
        projects.append(project)
        current_id += 1
        
    print(json.dumps(projects, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    parse_projects()
