#!/bin/bash

# SWU Holocron Production Build Script
# This script builds the app for production release

set -e

echo "🚀 Starting SWU Holocron Production Build Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "app.json" ]; then
    print_error "app.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check if EAS CLI is available
print_status "Checking EAS CLI..."
if ! command -v eas &> /dev/null; then
    print_status "Installing EAS CLI..."
    npm install -g eas-cli
fi

# Run TypeScript check
print_status "Running TypeScript check..."
if npx tsc --noEmit; then
    print_success "TypeScript check passed"
else
    print_error "TypeScript check failed. Please fix errors before building."
    exit 1
fi

# Check if EAS is configured
if [ ! -f "eas.json" ]; then
    print_error "eas.json not found. Please ensure EAS is configured."
    exit 1
fi

# Build for Production
print_status "Starting EAS build for iOS Production..."
print_warning "This may take 10-20 minutes. You can monitor progress at https://expo.dev/"
echo ""
print_status "The build will automatically increment the build number."
echo ""

if npx eas build --platform ios --profile production --auto-submit; then
    print_success "Build completed and submitted successfully!"
    echo ""
    print_status "Next steps:"
    echo "1. Go to App Store Connect (https://appstoreconnect.apple.com/)"
    echo "2. Navigate to your app > App Store"
    echo "3. Complete the app information if needed"
    echo "4. Submit for review"
    echo ""
    print_success "🎉 Production build complete!"
else
    print_error "Build failed. Check the logs above for details."
    exit 1
fi

echo ""
print_success "✅ All done! Check App Store Connect to complete your submission."