#!/bin/bash

# SWU Holocron TestFlight Build Script
# This script builds and submits the app to TestFlight

set -e

echo "🚀 Starting SWU Holocron TestFlight Build Process..."

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

# Check if user is logged into Expo
print_status "Checking Expo authentication..."
if ! npx expo whoami > /dev/null 2>&1; then
    print_warning "Not logged into Expo. Please log in:"
    npx expo login
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
    print_warning "EAS not configured. Running eas build:configure..."
    npx eas build:configure
fi

# Prompt for version bump
current_version=$(grep '"version"' app.json | head -1 | sed 's/.*"version": "\(.*\)".*/\1/')
current_build=$(grep '"buildNumber"' app.json | sed 's/.*"buildNumber": "\(.*\)".*/\1/')

echo ""
print_status "Current version: $current_version (build $current_build)"
echo "Do you want to increment the build number? (y/n)"
read -r increment_build

if [[ $increment_build =~ ^[Yy]$ ]]; then
    new_build=$((current_build + 1))
    print_status "Incrementing build number to $new_build..."
    
    # Update build number in app.json
    sed -i.bak "s/\"buildNumber\": \"$current_build\"/\"buildNumber\": \"$new_build\"/" app.json
    rm app.json.bak
    
    print_success "Build number updated to $new_build"
fi

# Build for TestFlight
print_status "Starting EAS build for iOS (TestFlight profile)..."
print_warning "This may take 10-20 minutes. You can monitor progress at https://expo.dev/"

if npx eas build --platform ios --profile testflight --non-interactive; then
    print_success "Build completed successfully!"
else
    print_error "Build failed. Check the logs above for details."
    exit 1
fi

# Ask if user wants to submit to TestFlight
echo ""
echo "Do you want to submit the build to TestFlight now? (y/n)"
read -r submit_now

if [[ $submit_now =~ ^[Yy]$ ]]; then
    print_status "Submitting to TestFlight..."
    
    if npx eas submit --platform ios --latest --non-interactive; then
        print_success "Successfully submitted to TestFlight!"
        echo ""
        print_status "Next steps:"
        echo "1. Go to App Store Connect (https://appstoreconnect.apple.com/)"
        echo "2. Navigate to your app > TestFlight"
        echo "3. Wait for processing (usually 5-30 minutes)"
        echo "4. Add testers and send invitations"
        echo ""
        print_success "🎉 TestFlight deployment complete!"
    else
        print_error "Submission failed. Check the logs above for details."
        echo ""
        print_status "You can manually submit later with:"
        echo "npx eas submit --platform ios --latest"
        exit 1
    fi
else
    print_success "Build completed! You can submit later with:"
    echo "npx eas submit --platform ios --latest"
fi

echo ""
print_success "✅ All done! Check your email and App Store Connect for updates."