#!/usr/bin/env python3
"""
Complete CSV to JSON Conversion Tool for React Interview Prep Repository
Converts CSV files to the JSON format expected by your React application
"""

import csv
import json
import re
import os
from typing import List, Dict, Any, Optional

def clean_text(text: str) -> str:
    """Clean and format text content"""
    if not text:
        return ""

    # Remove extra whitespace and normalize line breaks
    text = re.sub(r'\s+', ' ', text.strip())

    # Fix common encoding issues
    text = text.replace('\"', '"')
    text = text.replace('\n', '\n')

    return text

def extract_code_example(answer: str) -> Optional[Dict[str, str]]:
    """Extract code examples from answer text"""
    # Look for common code patterns
    code_patterns = [
        r'Example:\s*([^.]+)',
        r'```([\s\S]*?)```',
        r'<([^>]+)>',
        r'\w+\([^)]*\)\s*{[^}]*}',
    ]

    for pattern in code_patterns:
        match = re.search(pattern, answer)
        if match:
            code = match.group(1).strip()
            if len(code) > 10 and ('{' in code or '<' in code or 'function' in code):
                return {
                    "title": "Code Example",
                    "code": clean_text(code)
                }

    return None

def generate_key_points(answer: str, question: str) -> List[str]:
    """Generate key learning points from the answer"""
    key_points = []

    # Look for bullet points or numbered lists
    bullet_patterns = [
        r'\d+\. ([^\n]+)',  # Numbered lists
        r'- ([^\n]+)',        # Dash bullets
        r'\* ([^\n]+)',      # Asterisk bullets
        r'\• ([^\n]+)',      # Bullet points
    ]

    for pattern in bullet_patterns:
        matches = re.findall(pattern, answer)
        if matches:
            key_points.extend([clean_text(match) for match in matches[:4]])
            break

    # If no bullet points found, extract key phrases
    if not key_points:
        if 'Virtual DOM' in answer:
            key_points.append("Virtual DOM for performance")
        if 'component' in answer.lower():
            key_points.append("Component-based architecture")
        if 'state' in answer.lower():
            key_points.append("State management")
        if 'hook' in answer.lower():
            key_points.append("React Hooks")
        if 'prop' in answer.lower():
            key_points.append("Props and data flow")

    # Ensure we have at least 2-3 key points
    if len(key_points) < 2:
        if 'performance' in answer.lower():
            key_points.append("Performance optimization")
        if 'render' in answer.lower():
            key_points.append("Efficient rendering")
        if not key_points:
            # Fallback key points based on question
            if 'what is' in question.lower():
                key_points.append("Core concept understanding")
            if 'how' in question.lower():
                key_points.append("Implementation knowledge")

    return key_points[:4]  # Limit to 4 key points

def generate_follow_up_questions(question: str, category: str, difficulty: str) -> List[str]:
    """Generate relevant follow-up questions"""
    follow_ups = []

    # Category-based follow-ups
    category_questions = {
        'React Fundamentals': [
            "How does React differ from vanilla JavaScript?",
            "What are the benefits of using React?",
            "When would you choose React over other frameworks?"
        ],
        'React Hooks': [
            "What are the rules of hooks?",
            "How do custom hooks work?",
            "When should you use useCallback vs useMemo?"
        ],
        'State Management': [
            "What are the different ways to manage state in React?",
            "When should you lift state up?",
            "How do you avoid prop drilling?"
        ],
        'Performance': [
            "How do you measure React performance?",
            "What causes unnecessary re-renders?",
            "How do you optimize large lists?"
        ],
        'Forms': [
            "How do you handle form validation?",
            "What's the difference between controlled and uncontrolled components?",
            "How do you handle file uploads?"
        ]
    }

    # Get category-specific questions
    if category in category_questions:
        follow_ups.extend(category_questions[category][:2])

    # Difficulty-based questions
    if difficulty == 'Beginner':
        follow_ups.append("Can you provide a simple example?")
    elif difficulty == 'Advanced':
        follow_ups.append("How would you implement this in a production app?")

    # Question-specific follow-ups
    if 'useEffect' in question:
        follow_ups.append("How do you clean up effects?")
    elif 'Virtual DOM' in question:
        follow_ups.append("How does reconciliation work?")
    elif 'component' in question.lower():
        follow_ups.append("What are the lifecycle methods?")

    return follow_ups[:3]  # Limit to 3 follow-up questions

def convert_csv_to_json(csv_file_path: str, output_file_path: str, title_prefix: str = "") -> None:
    """
    Convert CSV file to JSON format matching your repository structure
    """
    questions = []

    try:
        with open(csv_file_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)

            for row in reader:
                try:
                    # Extract basic fields
                    rank = row.get('rank', '1')
                    question_text = clean_text(row.get('question', ''))
                    answer_text = clean_text(row.get('answer', ''))
                    difficulty = row.get('difficulty', 'Intermediate').strip()
                    category = row.get('category', 'React Fundamentals').strip()

                    if not question_text or not answer_text:
                        print(f"Skipping row with missing data: {rank}")
                        continue

                    # Generate unique ID
                    question_id = f"q{rank}"

                    # Create question object
                    question_obj = {
                        "id": question_id,
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
                    follow_ups = generate_follow_up_questions(question_text, category, difficulty)
                    if follow_ups:
                        question_obj["followUpQuestions"] = follow_ups

                    questions.append(question_obj)

                except Exception as e:
                    print(f"Error processing row {rank}: {str(e)}")
                    continue

        # Determine title based on number of questions
        if not title_prefix:
            title_prefix = f"Top {len(questions)}"

        # Create final JSON structure
        output_data = {
            "title": f"{title_prefix} React Interview Questions",
            "description": "Master the most frequently asked React interview questions with detailed explanations and examples",
            "lastUpdated": "2025-09-25",
            "totalQuestions": len(questions),
            "categories": list(set(q["category"] for q in questions)),
            "difficulties": list(set(q["difficulty"] for q in questions)),
            "questions": questions
        }

        # Write to JSON file
        with open(output_file_path, 'w', encoding='utf-8') as file:
            json.dump(output_data, file, indent=2, ensure_ascii=False)

        print(f"Successfully converted {len(questions)} questions to {output_file_path}")

        # Print summary
        categories = {}
        difficulties = {}
        for q in questions:
            categories[q["category"]] = categories.get(q["category"], 0) + 1
            difficulties[q["difficulty"]] = difficulties.get(q["difficulty"], 0) + 1

        print(f"Categories: {dict(categories)}")
        print(f"Difficulties: {dict(difficulties)}")

    except FileNotFoundError:
        print(f"Error: File {csv_file_path} not found")
    except Exception as e:
        print(f"Error converting {csv_file_path}: {str(e)}")

def batch_convert_files(input_dir: str = ".", output_dir: str = "json_output") -> None:
    """
    Convert all CSV files in the input directory
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Define file mappings
    file_mappings = [
        ("top_10_react_interview_questions.csv", "top-10-questions.json", "Top 10"),
        ("top_20_react_interview_questions.csv", "top-20-questions.json", "Top 20"),
        ("top_50_react_interview_questions.csv", "top-50-questions.json", "Top 50"),
        ("top_100_react_interview_questions.csv", "top-100-questions.json", "Top 100"),
    ]

    converted_files = []

    for csv_file, json_file, title_prefix in file_mappings:
        csv_path = os.path.join(input_dir, csv_file)
        json_path = os.path.join(output_dir, json_file)

        if os.path.exists(csv_path):
            print(f"\nConverting {csv_file}...")
            convert_csv_to_json(csv_path, json_path, title_prefix)
            converted_files.append(json_file)
        else:
            print(f"File not found: {csv_path}")

    print(f"\nConversion complete! Generated files:")
    for file in converted_files:
        print(f"   - {file}")

    return converted_files

if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        if sys.argv[1] == "batch":
            # Batch convert all files
            batch_convert_files()
        else:
            # Convert single file
            input_file = sys.argv[1]
            output_file = sys.argv[2] if len(sys.argv) > 2 else input_file.replace('.csv', '.json')
            convert_csv_to_json(input_file, output_file)
    else:
        # Interactive mode
        print("React Interview Questions CSV to JSON Converter")
        print("=" * 50)
        print("1. Convert all CSV files (batch mode)")
        print("2. Convert single file")

        choice = input("\nChoose an option (1 or 2): ").strip()

        if choice == "1":
            batch_convert_files()
        elif choice == "2":
            csv_file = input("Enter CSV file path: ").strip()
            json_file = input("Enter JSON output file path (optional): ").strip()
            if not json_file:
                json_file = csv_file.replace('.csv', '.json')
            convert_csv_to_json(csv_file, json_file)
        else:
            print("Invalid choice. Exiting.")
