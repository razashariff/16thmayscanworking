// Script to list all user IDs (top-level folders) in the Supabase 'scan-reports' bucket
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jjdzrxfriezvfxjacche.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqZHpyeGZyaWV6dmZ4amFjY2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4ODIyMjcsImV4cCI6MjA2MDQ1ODIyN30.gx3n1fKedtU4s4OqKIqPWvUlBQzajOz80rJit1STFwY';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const bucket = 'scan_reports';

async function listAll(prefix = '', depth = 0) {
  const indent = '  '.repeat(depth);
  const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 100 });
  if (error) {
    console.error(`Error listing ${prefix || '[root]'}:`, error.message);
    return;
  }
  if (!data || data.length === 0) {
    console.log(`${indent}${prefix || '[root]'}: [empty]`);
    return;
  }
  for (const item of data) {
    if (item.metadata === null) {
      // Folder
      console.log(`${indent}[Folder] ${prefix}${item.name}/`);
      await listAll(`${prefix}${item.name}/`, depth + 1);
    } else {
      // File
      console.log(`${indent}[File] ${prefix}${item.name}`);
    }
  }
}

listAll();
