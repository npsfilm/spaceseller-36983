#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

/**
 * Automated Security Scanner
 * Detects type safety issues across the codebase
 */

interface SecurityIssue {
  file: string;
  line: number;
  type: 'any-type' | 'missing-zod' | 'unsafe-assertion' | 'untyped-param';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  code?: string;
}

const issues: SecurityIssue[] = [];

// Patterns to detect
const patterns = {
  anyType: /:\s*any\b/g,
  unsafeAssertion: /as\s+any\b/g,
  untypedParam: /\(([^:)]+)\)\s*=>/g,
  missingZodEdgeFunction: /export\s+default\s+async\s+function\s+handler\(req:\s*Request\)/g,
};

// Directories to scan
const scanDirs = [
  'src',
  'supabase/functions'
];

// Files to exclude
const excludePatterns = [
  /\.test\.ts$/,
  /\.spec\.ts$/,
  /node_modules/,
  /dist/,
  /\.d\.ts$/,
  /types\.ts$/,
  /vite-env\.d\.ts$/
];

function shouldScanFile(filePath: string): boolean {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return false;
  }
  return !excludePatterns.some(pattern => pattern.test(filePath));
}

function scanFile(filePath: string): void {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const relativePath = relative(process.cwd(), filePath);

    // Check for 'any' types
    lines.forEach((line, index) => {
      if (patterns.anyType.test(line)) {
        issues.push({
          file: relativePath,
          line: index + 1,
          type: 'any-type',
          severity: 'high',
          message: "Type 'any' detected - replace with specific type",
          code: line.trim()
        });
      }

      // Check for unsafe type assertions
      if (patterns.unsafeAssertion.test(line)) {
        issues.push({
          file: relativePath,
          line: index + 1,
          type: 'unsafe-assertion',
          severity: 'critical',
          message: "Unsafe 'as any' assertion detected",
          code: line.trim()
        });
      }

      // Check for untyped parameters (basic check)
      const untypedMatch = line.match(/\(([^:)]+)\)\s*=>/);
      if (untypedMatch && !line.includes(':') && !line.includes('//')) {
        const param = untypedMatch[1].trim();
        if (param && !['_', 'e', 'event'].includes(param)) {
          issues.push({
            file: relativePath,
            line: index + 1,
            type: 'untyped-param',
            severity: 'medium',
            message: `Untyped parameter '${param}' in arrow function`,
            code: line.trim()
          });
        }
      }
    });

    // Check edge functions for Zod validation
    if (filePath.includes('supabase/functions') && filePath.endsWith('index.ts')) {
      const hasZodImport = /import\s+.*\{\s*z\s*\}.*from\s+['"]zod['"]/.test(content);
      const hasValidation = /\.parse\(|\.safeParse\(/.test(content);
      
      if (!hasZodImport || !hasValidation) {
        issues.push({
          file: relativePath,
          line: 1,
          type: 'missing-zod',
          severity: 'critical',
          message: 'Edge function missing Zod validation for request body'
        });
      }
    }
  } catch (error) {
    console.error(`Error scanning ${filePath}:`, error);
  }
}

function scanDirectory(dir: string): void {
  try {
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!entry.startsWith('.') && entry !== 'node_modules') {
          scanDirectory(fullPath);
        }
      } else if (shouldScanFile(fullPath)) {
        scanFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
  }
}

function generateReport(): void {
  console.log('\n🔍 Security Scanner Results\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  if (issues.length === 0) {
    console.log('✅ No security issues detected!\n');
    return;
  }

  // Group by severity
  const bySeverity = {
    critical: issues.filter(i => i.severity === 'critical'),
    high: issues.filter(i => i.severity === 'high'),
    medium: issues.filter(i => i.severity === 'medium'),
    low: issues.filter(i => i.severity === 'low')
  };

  // Summary
  console.log('📊 Summary:');
  console.log(`   🔴 Critical: ${bySeverity.critical.length}`);
  console.log(`   🟠 High: ${bySeverity.high.length}`);
  console.log(`   🟡 Medium: ${bySeverity.medium.length}`);
  console.log(`   🟢 Low: ${bySeverity.low.length}`);
  console.log(`   Total: ${issues.length}\n`);

  // Detailed issues
  const severityOrder: Array<keyof typeof bySeverity> = ['critical', 'high', 'medium', 'low'];
  const severityIcons = { critical: '🔴', high: '🟠', medium: '🟡', low: '🟢' };

  severityOrder.forEach(severity => {
    const severityIssues = bySeverity[severity];
    if (severityIssues.length > 0) {
      console.log(`\n${severityIcons[severity]} ${severity.toUpperCase()} Issues (${severityIssues.length}):\n`);
      
      severityIssues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.file}:${issue.line}`);
        console.log(`   Type: ${issue.type}`);
        console.log(`   ${issue.message}`);
        if (issue.code) {
          console.log(`   Code: ${issue.code}`);
        }
        console.log('');
      });
    }
  });

  console.log('═══════════════════════════════════════════════════════════\n');
  
  // Exit with error code if critical issues found
  if (bySeverity.critical.length > 0) {
    console.log('❌ Critical issues detected. Please fix before deploying.\n');
    process.exit(1);
  }
}

// Run scanner
console.log('🚀 Starting security scan...\n');
scanDirs.forEach(dir => {
  console.log(`Scanning ${dir}/...`);
  scanDirectory(dir);
});

generateReport();
