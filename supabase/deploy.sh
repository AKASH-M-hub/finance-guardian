#!/bin/bash
# FYF Database Deployment Script (Linux/Mac)
# Run this script to deploy migrations to Supabase

echo "🚀 FYF Database Deployment Script"
echo "=================================="
echo ""

# Configuration
PROJECT_REF="vtocrplsbciduitbkmko"
MIGRATIONS_DIR="supabase/migrations"

# Check if Supabase CLI is installed
echo "📋 Checking prerequisites..."
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found!"
    echo "Install it with: npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if migrations directory exists
if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "❌ Migrations directory not found: $MIGRATIONS_DIR"
    exit 1
fi

echo "📁 Found migrations directory"
echo ""

# List migration files
echo "📄 Available migrations:"
ls -1 $MIGRATIONS_DIR/*.sql | xargs -n 1 basename
echo ""

# Ask for confirmation
read -p "Do you want to deploy these migrations to project $PROJECT_REF? (yes/no): " confirmation

if [ "$confirmation" != "yes" ]; then
    echo "❌ Deployment cancelled"
    exit 0
fi

echo ""
echo "🔗 Linking to Supabase project..."

# Link to project
if supabase link --project-ref $PROJECT_REF; then
    echo "✅ Successfully linked to project"
    echo ""
else
    echo "❌ Failed to link to project. Please check your credentials."
    echo "You may need to run: supabase login"
    exit 1
fi

# Push migrations
echo "📤 Pushing migrations to Supabase..."

if supabase db push; then
    echo ""
    echo "✅ Migrations deployed successfully!"
else
    echo ""
    echo "❌ Failed to push migrations"
    exit 1
fi

# Verify deployment
echo ""
echo "🔍 Verifying deployment..."

if supabase db diff; then
    echo ""
    echo "✅ Verification complete!"
else
    echo ""
    echo "⚠️  Could not verify deployment"
fi

echo ""
echo "=================================="
echo "🎉 Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with Supabase credentials"
echo "2. Test the database connection in your app"
echo "3. Run your application: npm run dev"
echo ""
