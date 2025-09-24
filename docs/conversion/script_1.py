# Now let's create a demonstration by converting one of your CSV files
import csv
import json
import re
from io import StringIO

# Sample data from your top_20_react_interview_questions.csv
sample_csv_data = """rank,question,answer,difficulty,category
1,What is React and why would you use it?,"React is a JavaScript library developed by Facebook for building user interfaces, particularly single-page applications. It uses a component-based architecture, Virtual DOM for efficient updates, and follows a declarative programming paradigm. Key benefits include reusable components, better performance through Virtual DOM, strong community support, and excellent developer tools.",Beginner,React Fundamentals
2,What is JSX and how does it work?,"JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML-like code within JavaScript. It makes React components more readable and easier to write. JSX gets transpiled by tools like Babel into React.createElement() calls. Example: <div>Hello World</div> becomes React.createElement('div', null, 'Hello World').",Beginner,React Fundamentals"""

def clean_text(text: str) -> str:
    """Clean and format text content"""
    if not text:
        return ""
    return text.strip().replace('\\"', '"')

def extract_code_example(answer: str) -> dict:
    """Extract code examples from answer text"""
    # Look for Example: pattern
    example_match = re.search(r'Example:\s*([^.]+)', answer)
    if example_match:
        code = example_match.group(1).strip()
        return {
            "title": "JSX Example",
            "code": code
        }
    return None

def generate_key_points(answer: str, question: str) -> list:
    """Generate key learning points from the answer"""
    key_points = []
    
    if 'React' in question:
        if 'Virtual DOM' in answer:
            key_points.append("Virtual DOM for performance")
        if 'component' in answer.lower():
            key_points.append("Component-based architecture")
        if 'reusable' in answer.lower():
            key_points.append("Reusable components")
        if 'JavaScript' in answer:
            key_points.append("JavaScript library for UI")
    
    if 'JSX' in question:
        if 'syntax extension' in answer:
            key_points.append("Syntax extension for JavaScript")
        if 'HTML-like' in answer:
            key_points.append("HTML-like code in JavaScript")
        if 'transpiled' in answer:
            key_points.append("Transpiled to React.createElement")
    
    return key_points[:4]  # Limit to 4 key points

def generate_follow_up_questions(question: str, category: str) -> list:
    """Generate relevant follow-up questions"""
    follow_ups = []
    
    if 'React' in question and 'what is' in question.lower():
        follow_ups = [
            "How does React differ from vanilla JavaScript?",
            "What are the main benefits of using React?",
            "When would you choose React over other frameworks?"
        ]
    elif 'JSX' in question:
        follow_ups = [
            "What are the differences between JSX and HTML?",
            "How does Babel transform JSX?",
            "Can you write React without JSX?"
        ]
    
    return follow_ups

# Process the sample data
reader = csv.DictReader(StringIO(sample_csv_data))
questions = []

for row in reader:
    rank = row['rank']
    question_text = clean_text(row['question'])
    answer_text = clean_text(row['answer'])
    difficulty = row['difficulty']
    category = row['category']
    
    # Create question object
    question_obj = {
        "id": f"q{rank}",
        "question": question_text,
        "difficulty": difficulty,
        "category": category,
        "answer": answer_text
    }
    
    # Extract code example if present
    code_example = extract_code_example(answer_text)
    if code_example:
        question_obj["codeExample"] = code_example
    
    # Generate key points
    key_points = generate_key_points(answer_text, question_text)
    if key_points:
        question_obj["keyPoints"] = key_points
    
    # Generate follow-up questions
    follow_ups = generate_follow_up_questions(question_text, category)
    if follow_ups:
        question_obj["followUpQuestions"] = follow_ups
    
    questions.append(question_obj)

# Create final JSON structure
output_data = {
    "title": "Top 20 React Interview Questions",
    "description": "Master the most frequently asked React interview questions with detailed explanations and examples",
    "lastUpdated": "2025-09-25",
    "totalQuestions": len(questions),
    "questions": questions
}

# Display the converted JSON
print("🎯 SAMPLE CONVERSION RESULT")
print("=" * 50)
print(json.dumps(output_data, indent=2)[:2000] + "...")
print("\n✅ This shows how your CSV data will be converted to JSON format!")

# Show the structure comparison
print("\n📋 STRUCTURE COMPARISON")
print("=" * 30)
print("Original CSV fields: rank, question, answer, difficulty, category")
print("Generated JSON fields: id, question, difficulty, category, answer, codeExample, keyPoints, followUpQuestions")
print("\n💡 The conversion script automatically:")
print("- Converts 'rank' to 'id' format (q1, q2, etc.)")
print("- Extracts code examples from answers")
print("- Generates key learning points")
print("- Creates relevant follow-up questions")
print("- Adds metadata like lastUpdated, totalQuestions")