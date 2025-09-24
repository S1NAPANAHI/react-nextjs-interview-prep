# Create a step-by-step guide document
guide_content = """# 🚀 Complete Guide: Converting CSV to JSON for React Interview Prep

## 📖 Overview
This guide shows you how to convert your CSV interview questions to the JSON format your React application expects.

## 🛠️ Prerequisites
- Python 3.6+ installed on your system
- Your CSV files (top_10, top_20, top_50, top_100)
- Basic command line knowledge

## 📂 File Structure
```
your-project/
├── convert_csv_to_json.py          # Conversion script
├── top_10_react_interview_questions.csv
├── top_20_react_interview_questions.csv
├── top_50_react_interview_questions.csv
├── top_100_react_interview_questions.csv
└── json_output/                    # Generated JSON files
    ├── top-10-questions.json
    ├── top-20-questions.json
    ├── top-50-questions.json
    └── top-100-questions.json
```

## 🔄 Conversion Process

### Step 1: Prepare the Conversion Script
1. Save the `convert_csv_to_json.py` script to your project directory
2. Make sure it's in the same folder as your CSV files
3. Ensure Python is installed: `python --version`

### Step 2: Run the Conversion

#### Option A: Batch Convert All Files (Recommended)
```bash
# Convert all CSV files at once
python convert_csv_to_json.py batch
```

#### Option B: Interactive Mode
```bash
# Run in interactive mode
python convert_csv_to_json.py
# Then choose option 1 for batch conversion
```

#### Option C: Convert Individual Files
```bash
# Convert specific file
python convert_csv_to_json.py top_20_react_interview_questions.csv top-20-questions.json
```

### Step 3: Verify Output
The script will create a `json_output/` directory with converted files:
- ✅ top-10-questions.json
- ✅ top-20-questions.json  
- ✅ top-50-questions.json
- ✅ top-100-questions.json

## 📋 What the Script Does

### 🔍 Data Processing
- **Cleans text**: Removes extra whitespace and fixes encoding
- **Generates IDs**: Converts rank numbers to q1, q2, q3 format
- **Extracts code**: Automatically finds code examples in answers
- **Creates key points**: Generates 2-4 key learning points per question
- **Adds follow-ups**: Creates relevant follow-up questions

### 🎯 Output Format
Each question becomes a complete JSON object:
```json
{
  "id": "q1",
  "question": "What is React and why would you use it?",
  "difficulty": "Beginner",
  "category": "React Fundamentals", 
  "answer": "Detailed explanation...",
  "codeExample": {
    "title": "Basic Example",
    "code": "function App() { return <h1>Hello React!</h1>; }"
  },
  "keyPoints": [
    "Component-based architecture",
    "Virtual DOM for performance"
  ],
  "followUpQuestions": [
    "How does React differ from vanilla JavaScript?"
  ]
}
```

## 🔧 Integration with Your Repository

### Step 4: Update Your Repository
1. **Backup existing files**: Copy current `data/top-*-questions.json` files
2. **Replace with new files**: Copy generated JSON files to `data/` directory
3. **Update file names** to match your repository structure:
   ```bash
   cp json_output/top-10-questions.json data/
   cp json_output/top-20-questions.json data/
   cp json_output/top-50-questions.json data/
   cp json_output/top-100-questions.json data/
   ```

### Step 5: Test Your Application
1. **Start your application**: `npm start` or `python -m http.server 8000`
2. **Check the Top 20 Questions feature**: Should load new questions
3. **Verify all categories**: Make sure questions display correctly
4. **Test search and filtering**: Ensure all functionality works

## 🛡️ Quality Assurance

### ✅ Validation Checklist
- [ ] All CSV files converted successfully
- [ ] JSON files have correct structure
- [ ] Questions display in application
- [ ] Search/filter functionality works
- [ ] Code examples render properly
- [ ] Key points show correctly
- [ ] Follow-up questions appear

### 🔍 Troubleshooting

#### Common Issues:
1. **"File not found" error**:
   - Ensure CSV files are in the same directory as script
   - Check file names match exactly

2. **"Invalid JSON" error**:
   - Check for special characters in your CSV
   - Run script again with clean CSV data

3. **Missing fields in output**:
   - Verify CSV headers match: rank,question,answer,difficulty,category
   - Ensure no empty rows in CSV

4. **Application not loading questions**:
   - Check file paths in your React code
   - Verify JSON structure matches existing format

## 🔄 Update Workflow

### For Future Updates:
1. **Edit CSV files**: Add/modify questions in CSV format
2. **Re-run conversion**: `python convert_csv_to_json.py batch`
3. **Copy to repository**: Update files in `data/` directory  
4. **Test and deploy**: Verify changes work correctly

## 📊 Expected Results

After conversion, you'll have:
- **Enhanced JSON files** with rich metadata
- **Code examples** automatically extracted
- **Key learning points** for each question
- **Follow-up questions** for deeper learning
- **Better structure** for your React application

## 💡 Pro Tips

1. **Keep CSV as source**: Edit questions in CSV, then convert to JSON
2. **Version control**: Commit both CSV and JSON files
3. **Backup before changes**: Always backup before major updates
4. **Test thoroughly**: Check all features after updating
5. **Gradual rollout**: Update one file at a time to catch issues early

## 🎯 Success Metrics

Your conversion is successful when:
- ✅ All CSV files convert without errors
- ✅ JSON files load in your application
- ✅ Questions display with proper formatting
- ✅ Code examples render correctly
- ✅ Search and filtering work
- ✅ User experience is improved

## 🚀 Next Steps

After successful conversion:
1. **Deploy updates**: Push changes to your live site
2. **Monitor performance**: Check for any issues
3. **Gather feedback**: See how users respond to enhanced format
4. **Plan improvements**: Consider adding more metadata or features

---

*This guide ensures your React Interview Prep repository has the best possible question format for effective learning!*
"""

# Save the guide
with open('CSV_to_JSON_Conversion_Guide.md', 'w', encoding='utf-8') as f:
    f.write(guide_content)

print("📚 Created comprehensive guide: CSV_to_JSON_Conversion_Guide.md")
print("\n🎯 You now have:")
print("✅ Complete conversion script (convert_csv_to_json.py)")
print("✅ Step-by-step guide (CSV_to_JSON_Conversion_Guide.md)")
print("✅ Quality assurance checklist")
print("✅ Troubleshooting instructions")
print("✅ Integration workflow")

print("\n🚀 Ready to convert your files! Run:")
print("   python convert_csv_to_json.py batch")