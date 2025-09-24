import re
import json
import uuid

def parse_blocks(text):
    blocks = []
    # Split by --- (separator)
    raw_blocks = text.strip().split('\n---\n')
    for b in raw_blocks:
        data = {"id": str(uuid.uuid4())}  # Or custom numbering
        # Question
        qmatch = re.search(r'^Q: (.+)', b, re.MULTILINE)
        if qmatch:
            data["question"] = qmatch.group(1).strip()
        # Answer
        amatch = re.search(r'^A:([\s\S]+?)(^Code Example:|^Key Points:|^Follow Up:|$)', b, re.MULTILINE)
        if amatch:
            data["answer"] = amatch.group(1).strip()
        # Code Example
        cmatch = re.search(r'^Code Example:\n([\s\S]+?)(^Key Points:|^Follow Up:|$)', b, re.MULTILINE)
        if cmatch:
            data["codeExample"] = {
                "title": "",
                "code": cmatch.group(1).strip()
            }
        # Key Points
        kmatch = re.search(r'^Key Points:\n([\s\S]+?)(^Follow Up:|$)', b, re.MULTILINE)
        if kmatch:
            data["keyPoints"] = [line.strip('- ') for line in kmatch.group(1).strip().split('\n') if line.strip()]
        # Follow Up
        fmatch = re.search(r'^Follow Up:\n([\s\S]+)', b, re.MULTILINE)
        if fmatch:
            data["followUpQuestions"] = [line.strip('- ') for line in fmatch.group(1).strip().split('\n') if line.strip()]
        # Defaults
        data["difficulty"] = "Intermediate"
        data["category"] = "React"
        blocks.append(data)
    return blocks

def main():
    # Input file can be provided as CLI argument
    input_path = "questions_input.md"
    output_path = "react-top-20.json"
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    questions = parse_blocks(content)
    o = {
        "title": "Top 20 React Interview Questions",
        "description": "A comprehensive set of React interview questions with categories, code and key points.",
        "questions": questions
    }
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(o, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    main()