#!/bin/bash

# SWU Holocron TestFlight Submission Script
# This script submits your built app to TestFlight using environment variables

set -e

echo "🚀 Starting TestFlight Submission..."

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
if [ ! -f ".env" ]; then
    print_error ".env file not found. Please create and configure your .env file first."
    echo ""
    echo "Required .env variables:"
    echo "APPLE_ID=your-apple-id@example.com"
    echo "ASC_APP_ID=1234567890"
    echo "APPLE_TEAM_ID=ABC123DEFG"
    exit 1
fi

# Load environment variables
print_status "Loading environment variables from .env file..."
export $(cat .env | grep -v '^#' | xargs)

# Validate required environment variables
if [ -z "$APPLE_ID" ] || [ -z "$ASC_APP_ID" ] || [ -z "$APPLE_TEAM_ID" ]; then
    print_error "Missing required environment variables in .env file"
    echo ""
    echo "Please ensure .env contains:"
    echo "APPLE_ID=your-apple-id@example.com"
    echo "ASC_APP_ID=1234567890 (numeric)"
    echo "APPLE_TEAM_ID=ABC123DEFG (10 characters)"
    exit 1
fi

# Check for placeholder values
if [[ "$APPLE_ID" == *"example.com"* ]] || [[ "$ASC_APP_ID" == "1234567890" ]] || [[ "$APPLE_TEAM_ID" == "ABC123DEFG" ]]; then
    print_error "Please update .env with your real Apple credentials"
    echo ""
    echo "Current values appear to be placeholders:"
    echo "APPLE_ID=$APPLE_ID"
    echo "ASC_APP_ID=$ASC_APP_ID"
    echo "APPLE_TEAM_ID=$APPLE_TEAM_ID"
    exit 1
fi

print_success "Environment variables loaded successfully"

# Check if user is logged into EAS
print_status "Checking EAS authentication..."
if ! npx eas whoami > /dev/null 2>&1; then
    print_warning "Not logged into EAS. Please log in:"
    npx eas login
fi

# Submit to TestFlight
print_status "Submitting latest build to TestFlight..."
print_warning "This may take 5-10 minutes..."

if npx eas submit --platform ios --latest --non-interactive; then
    print_success "Successfully submitted to TestFlight!"
    echo ""
    print_status "Next steps:"
    echo "1. Go to App Store Connect (https://appstoreconnect.apple.com/)"
    echo "2. Navigate to your app > TestFlight"
    echo "3. Wait for processing (usually 5-30 minutes)"
    echo "4. Add testers and send invitations"
    echo ""
    print_success "🎉 TestFlight submission complete!"
else
    print_error "Submission failed. Check the logs above for details."
    echo ""
    print_status "Common issues:"
    echo "- App not created in App Store Connect with correct Bundle ID"
    echo "- Invalid Apple credentials in .env file"
    echo "- App-specific password needed (generate at appleid.apple.com)"
    echo "- Apple Developer account not active"
    exit 1
fi

echo ""
print_success "✅ Check your email and App Store Connect for updates!"