#!/usr/bin/env python3
"""
V0 Anti-Pattern Checker

Scans Vue/TypeScript files for common anti-patterns that should use v0 composables instead.
"""

import os
import re
import argparse
from pathlib import Path
from typing import List, Dict, Tuple

class PatternChecker:
    def __init__(self, project_path: str):
        self.project_path = Path(project_path)
        self.issues = []
        
    def check_project(self) -> List[Dict]:
        """Scan project for anti-patterns."""
        vue_files = list(self.project_path.rglob("*.vue"))
        js_files = list(self.project_path.rglob("*.js"))
        ts_files = list(self.project_path.rglob("*.ts"))
        
        all_files = vue_files + js_files + ts_files
        
        for file_path in all_files:
            if "node_modules" in str(file_path):
                continue
            self._check_file(file_path)
            
        return self.issues
    
    def _check_file(self, file_path: Path):
        """Check individual file for anti-patterns."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except (UnicodeDecodeError, FileNotFoundError):
            return
            
        self._check_selection_patterns(file_path, content)
        self._check_context_patterns(file_path, content)
        self._check_browser_patterns(file_path, content)
        self._check_form_patterns(file_path, content)
        
    def _check_selection_patterns(self, file_path: Path, content: str):
        """Check for manual selection logic."""
        patterns = [
            {
                'pattern': r'ref<.*\[\]>\(\[\]\)',
                'message': 'Manual array selection - consider createSelection()',
                'suggestion': 'Replace with createSelection({ multiple: true })',
                'severity': 'warning'
            },
            {
                'pattern': r'\.includes\(.*\)\s*\?\s*.*\.filter\(',
                'message': 'Manual selection filtering - v0 handles this automatically',
                'suggestion': 'Use selection.isSelected() and selection composables',
                'severity': 'info'
            },
            {
                'pattern': r'splice\(\w+,\s*1\)',
                'message': 'Manual array manipulation for selection',
                'suggestion': 'Use selection.toggle() or selection.remove()',
                'severity': 'warning'
            },
            {
                'pattern': r'selected\.value\s*=\s*selected\.value\s*===\s*.*\s*\?\s*null',
                'message': 'Manual single selection toggle logic',
                'suggestion': 'Use createSingle() composable',
                'severity': 'warning'
            }
        ]
        
        self._apply_patterns(file_path, content, patterns, 'selection')
    
    def _check_context_patterns(self, file_path: Path, content: str):
        """Check for manual provide/inject usage."""
        patterns = [
            {
                'pattern': r'inject\([\'"][^"\']*[\'\"]\)',
                'message': 'Unsafe provide/inject - no type safety',
                'suggestion': 'Use createContext() for type-safe DI',
                'severity': 'error'
            },
            {
                'pattern': r'provide\([\'"][^"\']*[\'"],',
                'message': 'Manual provide - consider createContext()',
                'suggestion': 'Use createContext() for better error handling',
                'severity': 'warning'
            }
        ]
        
        self._apply_patterns(file_path, content, patterns, 'context')
    
    def _check_browser_patterns(self, file_path: Path, content: str):
        """Check for manual browser/SSR detection."""
        patterns = [
            {
                'pattern': r'typeof window !== [\'"]undefined[\'"]',
                'message': 'Manual SSR check - not tree-shakeable',
                'suggestion': 'Use IN_BROWSER constant from @vuetify/v0/constants',
                'severity': 'info'
            },
            {
                'pattern': r'new ResizeObserver',
                'message': 'Manual ResizeObserver - no auto-cleanup',
                'suggestion': 'Use useResizeObserver() composable',
                'severity': 'warning'
            },
            {
                'pattern': r'addEventListener\([\'"]resize[\'"]',
                'message': 'Manual resize listener - memory leak potential',
                'suggestion': 'Use useEventListener() for auto-cleanup',
                'severity': 'warning'
            },
            {
                'pattern': r'new IntersectionObserver',
                'message': 'Manual IntersectionObserver setup',
                'suggestion': 'Use useIntersectionObserver() composable',
                'severity': 'info'
            }
        ]
        
        self._apply_patterns(file_path, content, patterns, 'browser')
    
    def _check_form_patterns(self, file_path: Path, content: str):
        """Check for manual form validation."""
        patterns = [
            {
                'pattern': r'ref<string>\(\'\'\).*Error.*ref<string>',
                'message': 'Manual form field validation state',
                'suggestion': 'Use createForm() for integrated validation',
                'severity': 'info'
            },
            {
                'pattern': r'if\s*\(\s*!\w+\.value\s*\)\s*{\s*\w+Error',
                'message': 'Manual validation logic',
                'suggestion': 'Use form.register() with rules array',
                'severity': 'warning'
            }
        ]
        
        self._apply_patterns(file_path, content, patterns, 'forms')
    
    def _apply_patterns(self, file_path: Path, content: str, patterns: List[Dict], category: str):
        """Apply pattern matching to content."""
        lines = content.split('\n')
        
        for pattern_def in patterns:
            pattern = pattern_def['pattern']
            message = pattern_def['message']
            suggestion = pattern_def['suggestion']
            severity = pattern_def['severity']
            
            for line_num, line in enumerate(lines, 1):
                if re.search(pattern, line):
                    self.issues.append({
                        'file': str(file_path.relative_to(self.project_path)),
                        'line': line_num,
                        'category': category,
                        'severity': severity,
                        'message': message,
                        'suggestion': suggestion,
                        'code': line.strip()
                    })

def main():
    parser = argparse.ArgumentParser(description="Check for v0 anti-patterns")
    parser.add_argument("project_path", help="Path to project directory")
    parser.add_argument("--format", choices=["text", "json"], default="text")
    parser.add_argument("--severity", choices=["error", "warning", "info"], help="Minimum severity level")
    
    args = parser.parse_args()
    
    checker = PatternChecker(args.project_path)
    issues = checker.check_project()
    
    # Filter by severity if specified
    if args.severity:
        severity_levels = {"error": 3, "warning": 2, "info": 1}
        min_level = severity_levels[args.severity]
        issues = [i for i in issues if severity_levels[i['severity']] >= min_level]
    
    if args.format == "json":
        import json
        print(json.dumps(issues, indent=2))
    else:
        print_text_report(issues)

def print_text_report(issues: List[Dict]):
    """Print human-readable report."""
    if not issues:
        print("✅ No anti-patterns found!")
        return
    
    print(f"🔍 Found {len(issues)} potential improvements:\n")
    
    # Group by file
    by_file = {}
    for issue in issues:
        file = issue['file']
        if file not in by_file:
            by_file[file] = []
        by_file[file].append(issue)
    
    for file, file_issues in by_file.items():
        print(f"📄 {file}")
        
        for issue in file_issues:
            severity_icon = {
                "error": "❌",
                "warning": "⚠️", 
                "info": "ℹ️"
            }[issue['severity']]
            
            print(f"  {severity_icon} Line {issue['line']}: {issue['message']}")
            print(f"     Code: {issue['code']}")
            print(f"     💡 {issue['suggestion']}")
            print()
        
        print()

if __name__ == "__main__":
    main()