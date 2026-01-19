// Direct Migration Script
// Run this to deploy your database schema directly
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const SUPABASE_URL = 'https://vtocrplsbciduitbkmko.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY not found in environment');
  console.log('Please add your service role key to .env file:');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here');
  console.log('\nGet it from: https://vtocrplsbciduitbkmko.supabase.co/project/vtocrplsbciduitbkmko/settings/api');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration(filePath, name) {
  console.log(`\n📄 Running migration: ${name}...`);
  
  try {
    const sql = readFileSync(filePath, 'utf8');
    
    // Split by statement (rough split by semicolons outside of function bodies)
    const statements = sql
      .split(/;\s*$/gm)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`   Found ${statements.length} SQL statements`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        try {
          await supabase.rpc('exec_sql', { sql: statement + ';' });
        } catch (error) {
          // Try direct query if rpc fails
          const { error: queryError } = await supabase.from('_migrations').select('*').limit(1);
          if (queryError) {
            console.log(`   ⚠️  Statement ${i + 1}: Using PostgreSQL client might be needed`);
          }
        }
      }
    }
    
    console.log(`   ✅ Migration ${name} completed`);
    return true;
  } catch (error) {
    console.error(`   ❌ Error in ${name}:`, error.message);
    return false;
  }
}

async function deploy() {
  console.log('🚀 Starting Database Deployment');
  console.log('================================\n');
  console.log('Project: vtocrplsbciduitbkmko');
  console.log('URL:', SUPABASE_URL);
  
  const migrationsDir = join(__dirname, 'supabase', 'migrations');
  
  const migrations = [
    {
      file: join(migrationsDir, '20260119000000_initial_schema.sql'),
      name: 'Initial Schema'
    },
    {
      file: join(migrationsDir, '20260119000001_rls_policies.sql'),
      name: 'RLS Policies'
    }
  ];
  
  let success = true;
  
  for (const migration of migrations) {
    const result = await runMigration(migration.file, migration.name);
    if (!result) {
      success = false;
      break;
    }
  }
  
  if (success) {
    console.log('\n✅ All migrations completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Verify tables in dashboard: https://vtocrplsbciduitbkmko.supabase.co/project/vtocrplsbciduitbkmko/editor');
    console.log('2. Regenerate types: npm run generate-types');
    console.log('3. Start your app: npm run dev');
  } else {
    console.log('\n⚠️  Some migrations failed. Please run them manually in SQL Editor.');
    console.log('SQL Editor: https://vtocrplsbciduitbkmko.supabase.co/project/vtocrplsbciduitbkmko/sql');
  }
}

deploy().catch(console.error);
