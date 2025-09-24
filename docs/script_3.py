# Create comprehensive CSV files for all tiers of React interview questions
import csv
import json

# Function to create CSV files for each tier
def create_csv_file(questions, filename):
    with open(filename, 'w', newline='', encoding='utf-8') as file:
        fieldnames = ['rank', 'question', 'answer', 'difficulty', 'category']
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(questions)

# Create individual tier CSV files
create_csv_file(top_10_questions, 'top_10_react_interview_questions.csv')
create_csv_file(top_20_questions, 'top_20_react_interview_questions.csv')
create_csv_file(top_50_questions, 'top_50_react_interview_questions.csv')
create_csv_file(top_100_questions, 'top_100_react_interview_questions.csv')

print("✅ Created CSV files for all tiers:")
print("- top_10_react_interview_questions.csv")
print("- top_20_react_interview_questions.csv") 
print("- top_50_react_interview_questions.csv")
print("- top_100_react_interview_questions.csv")

# Create a comprehensive JSON file as well for easier parsing
with open('complete_react_interview_questions.json', 'w', encoding='utf-8') as f:
    json.dump({
        'top_10': top_10_questions,
        'top_20': top_20_questions,
        'top_50': top_50_questions,
        'top_100': top_100_questions,
        'metadata': {
            'total_questions': len(top_100_questions),
            'difficulty_distribution': difficulty_counts,
            'category_distribution': category_counts,
            'created_date': '2025-09-24',
            'description': 'Comprehensive React.js interview questions organized in tiers'
        }
    }, indent=2)

print("✅ Created JSON file: complete_react_interview_questions.json")

# Create a quick reference guide
quick_reference = []
for i, q in enumerate(top_10_questions):
    quick_reference.append({
        'rank': i + 1,
        'question': q['question'],
        'key_points': q['answer'][:150] + "..." if len(q['answer']) > 150 else q['answer'],
        'difficulty': q['difficulty']
    })

create_csv_file(quick_reference, 'react_top_10_quick_reference.csv')

print("✅ Created quick reference: react_top_10_quick_reference.csv")
print(f"\n📊 SUMMARY:")
print(f"Total unique questions created: {len(top_100_questions)}")
print(f"Tier structure: Top 10 → Top 20 → Top 50 → Top 100")
print(f"Difficulty levels: {list(difficulty_counts.keys())}")
print(f"Categories covered: {len(category_counts)} different categories")

# Show a sample of the top 10 for verification
print(f"\n🔥 TOP 10 SAMPLE:")
for i, q in enumerate(top_10_questions[:3]):
    print(f"{i+1}. {q['question']}")
    print(f"   Answer: {q['answer'][:100]}...")
    print(f"   Level: {q['difficulty']} | Category: {q['category']}\n")