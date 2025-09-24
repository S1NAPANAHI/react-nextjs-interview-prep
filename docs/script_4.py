# Fix the JSON creation and complete the file generation
import json

# Create a comprehensive JSON file (fixing the previous error)
data_to_export = {
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
}

with open('complete_react_interview_questions.json', 'w', encoding='utf-8') as f:
    json.dump(data_to_export, f, indent=2, ensure_ascii=False)

print("✅ Successfully created all files!")

# Create a quick reference guide for the top 10
quick_reference = []
for q in top_10_questions:
    quick_reference.append({
        'rank': q['rank'],
        'question': q['question'],
        'key_points': q['answer'][:150] + "..." if len(q['answer']) > 150 else q['answer'],
        'difficulty': q['difficulty']
    })

with open('react_top_10_quick_reference.csv', 'w', newline='', encoding='utf-8') as file:
    fieldnames = ['rank', 'question', 'key_points', 'difficulty']
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(quick_reference)

print("\n🎉 ALL FILES CREATED SUCCESSFULLY!")
print("\n📁 Files Generated:")
print("1. top_10_react_interview_questions.csv - The absolute must-know questions")
print("2. top_20_react_interview_questions.csv - Essential + important questions")
print("3. top_50_react_interview_questions.csv - Comprehensive intermediate preparation")
print("4. top_100_react_interview_questions.csv - Complete advanced preparation")
print("5. react_top_10_quick_reference.csv - Quick reference for top 10")
print("6. complete_react_interview_questions.json - All data in JSON format")

print(f"\n📊 FINAL STATISTICS:")
print(f"✨ Total Questions Created: {len(top_100_questions)}")
print(f"🎯 Difficulty Breakdown:")
for difficulty, count in difficulty_counts.items():
    print(f"   • {difficulty}: {count} questions ({count}%)")

print(f"\n🏷️  Category Coverage: {len(category_counts)} categories")
print("   Most covered categories:")
sorted_categories = sorted(category_counts.items(), key=lambda x: x[1], reverse=True)
for category, count in sorted_categories[:5]:
    print(f"   • {category}: {count} questions")

print("\n🔥 TOP 5 MUST-KNOW QUESTIONS PREVIEW:")
for i in range(5):
    q = top_10_questions[i]
    print(f"{i+1}. {q['question']}")
    print(f"   📝 {q['answer'][:100]}...")
    print(f"   🎚️  {q['difficulty']} | 📂 {q['category']}\n")

print("🚀 You now have a complete React interview preparation resource!")
print("📚 Study the tiers progressively: 10 → 20 → 50 → 100")
print("💡 Focus on understanding concepts, not memorizing answers!")