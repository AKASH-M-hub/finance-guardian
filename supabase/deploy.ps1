# FYF Database Deployment Script
# Run this script to deploy migrations to Supabase

Write-Host "🚀 FYF Database Deployment Script" -ForegroundColor Cyan
Write-Host "==================================`n" -ForegroundColor Cyan

# Configuration
$PROJECT_REF = "vtocrplsbciduitbkmko"
$MIGRATIONS_DIR = "supabase/migrations"

# Check if Supabase CLI is installed
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow
$supabaseInstalled = Get-Command supabase -ErrorAction SilentlyContinue

if (-not $supabaseInstalled) {
    Write-Host "❌ Supabase CLI not found!" -ForegroundColor Red
    Write-Host "Install it with: npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Supabase CLI found`n" -ForegroundColor Green

# Check if migrations directory exists
if (-not (Test-Path $MIGRATIONS_DIR)) {
    Write-Host "❌ Migrations directory not found: $MIGRATIONS_DIR" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Found migrations directory`n" -ForegroundColor Green

# List migration files
Write-Host "📄 Available migrations:" -ForegroundColor Cyan
Get-ChildItem -Path $MIGRATIONS_DIR -Filter "*.sql" | ForEach-Object {
    Write-Host "   - $($_.Name)" -ForegroundColor White
}
Write-Host ""

# Ask for confirmation
$confirmation = Read-Host "Do you want to deploy these migrations to project $PROJECT_REF? (yes/no)"

if ($confirmation -ne "yes") {
    Write-Host "❌ Deployment cancelled" -ForegroundColor Yellow
    exit 0
}

Write-Host "`n🔗 Linking to Supabase project..." -ForegroundColor Yellow

# Link to project
try {
    supabase link --project-ref $PROJECT_REF
    Write-Host "✅ Successfully linked to project`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to link to project. Please check your credentials." -ForegroundColor Red
    Write-Host "You may need to run: supabase login" -ForegroundColor Yellow
    exit 1
}

# Push migrations
Write-Host "📤 Pushing migrations to Supabase..." -ForegroundColor Yellow

try {
    supabase db push
    Write-Host "`n✅ Migrations deployed successfully!" -ForegroundColor Green
} catch {
    Write-Host "`n❌ Failed to push migrations" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Verify deployment
Write-Host "`n🔍 Verifying deployment..." -ForegroundColor Yellow

try {
    supabase db diff
    Write-Host "`n✅ Verification complete!`n" -ForegroundColor Green
} catch {
    Write-Host "`n⚠️  Could not verify deployment" -ForegroundColor Yellow
}

Write-Host "==================================`n" -ForegroundColor Cyan
Write-Host "🎉 Database setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Update your .env file with Supabase credentials" -ForegroundColor White
Write-Host "2. Test the database connection in your app" -ForegroundColor White
Write-Host "3. Run your application: npm run dev`n" -ForegroundColor White
