# Let's create a quick setup script that users can run to get everything ready

setup_script = '''#!/usr/bin/env python3
"""
Quick Setup Script for CSV to JSON Conversion
Automatically sets up the conversion environment and runs the conversion
"""

import os
import sys
import subprocess

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 6):
        print("❌ Python 3.6+ required. Current version:", sys.version)
        return False
    print(f"✅ Python version: {version.major}.{version.minor}")
    return True

def check_csv_files():
    """Check if CSV files exist"""
    csv_files = [
        "top_10_react_interview_questions.csv",
        "top_20_react_interview_questions.csv", 
        "top_50_react_interview_questions.csv",
        "top_100_react_interview_questions.csv"
    ]
    
    found_files = []
    for file in csv_files:
        if os.path.exists(file):
            found_files.append(file)
            print(f"✅ Found: {file}")
        else:
            print(f"⚠️  Not found: {file}")
    
    return found_files

def create_directories():
    """Create necessary directories"""
    dirs = ["json_output", "backup"]
    for dir_name in dirs:
        if not os.path.exists(dir_name):
            os.makedirs(dir_name)
            print(f"📁 Created directory: {dir_name}")

def backup_existing_json():
    """Backup existing JSON files"""
    json_files = [
        "data/top-10-questions.json",
        "data/top-20-questions.json", 
        "data/top-50-questions.json",
        "data/top-100-questions.json"
    ]
    
    backup_count = 0
    for file in json_files:
        if os.path.exists(file):
            backup_name = f"backup/{os.path.basename(file)}.backup"
            try:
                import shutil
                shutil.copy2(file, backup_name)
                print(f"💾 Backed up: {file}")
                backup_count += 1
            except Exception as e:
                print(f"⚠️  Could not backup {file}: {e}")
    
    return backup_count

def run_conversion():
    """Run the conversion script"""
    if not os.path.exists("convert_csv_to_json.py"):
        print("❌ Conversion script not found!")
        return False
    
    try:
        print("\\n🔄 Running conversion...")
        result = subprocess.run([sys.executable, "convert_csv_to_json.py", "batch"], 
                              capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Conversion completed successfully!")
            print(result.stdout)
            return True
        else:
            print("❌ Conversion failed!")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ Error running conversion: {e}")
        return False

def main():
    print("🚀 React Interview Questions CSV to JSON Setup")
    print("=" * 50)
    
    # Check prerequisites
    if not check_python_version():
        sys.exit(1)
    
    # Check for CSV files
    csv_files = check_csv_files()
    if not csv_files:
        print("❌ No CSV files found! Please ensure CSV files are in the current directory.")
        sys.exit(1)
    
    print(f"\\n📊 Found {len(csv_files)} CSV files ready for conversion")
    
    # Create directories
    create_directories()
    
    # Backup existing files
    backup_count = backup_existing_json()
    if backup_count > 0:
        print(f"💾 Backed up {backup_count} existing JSON files")
    
    # Run conversion
    if run_conversion():
        print("\\n🎉 Setup Complete!")
        print("\\n📁 Generated files in json_output/:")
        
        for file in os.listdir("json_output"):
            if file.endswith(".json"):
                file_path = os.path.join("json_output", file)
                size = os.path.getsize(file_path)
                print(f"   - {file} ({size:,} bytes)")
        
        print("\\n📋 Next Steps:")
        print("1. Review generated JSON files in json_output/")
        print("2. Copy files to your repository's data/ directory")
        print("3. Test your React application")
        print("4. Deploy updates")
        
        print("\\n💡 To copy files to repository:")
        print("   cp json_output/*.json data/")
        
    else:
        print("❌ Setup failed. Please check errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
'''

# Save the setup script
with open('setup_conversion.py', 'w', encoding='utf-8') as f:
    f.write(setup_script)

print("🛠️ Created setup script: setup_conversion.py")
print("\n🎯 COMPLETE SOLUTION SUMMARY:")
print("="*50)

files_created = [
    ("convert_csv_to_json.py", "Main conversion script with smart processing"),
    ("CSV_to_JSON_Conversion_Guide.md", "Complete step-by-step guide"),  
    ("setup_conversion.py", "Automated setup and conversion script")
]

for filename, description in files_created:
    print(f"✅ {filename}")
    print(f"   └─ {description}")

print("\n🚀 QUICK START (Choose one method):")
print("\nMethod 1 - Automated Setup:")
print("   python setup_conversion.py")

print("\nMethod 2 - Manual Conversion:")  
print("   python convert_csv_to_json.py batch")

print("\nMethod 3 - Interactive Mode:")
print("   python convert_csv_to_json.py")
print("   (then choose option 1)")

print("\n💡 All methods will:")
print("- Process all your CSV files")
print("- Generate enhanced JSON with code examples")
print("- Create key points and follow-up questions") 
print("- Provide progress feedback and error handling")
print("- Save files ready for your React repository")