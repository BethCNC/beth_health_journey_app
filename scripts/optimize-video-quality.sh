#!/bin/bash

# High-Quality Video Optimization Script for Background Videos
# Balances quality and file size for web use
# Usage: ./scripts/optimize-video-quality.sh input-video.mp4 output-name

set -e

# Check if arguments provided
if [ $# -ne 2 ]; then
    echo "Usage: $0 <input-video> <output-name>"
    echo "Example: $0 zebra.mp4 zebra-hq"
    exit 1
fi

INPUT_VIDEO="$1"
OUTPUT_NAME="$2"
OUTPUT_DIR="public"

# Check if input file exists
if [ ! -f "$INPUT_VIDEO" ]; then
    echo "Error: Input video '$INPUT_VIDEO' not found!"
    exit 1
fi

echo "🎬 Creating high-quality optimized videos: $INPUT_VIDEO"
echo ""

# Function to optimize video with better quality
optimize_hq() {
    local res="$1"
    local size="$2"
    local crf="$3"
    local maxrate="$4"
    local output_file="$OUTPUT_DIR/${OUTPUT_NAME}-${res}.mp4"
    
    echo "🔄 Creating high-quality ${res} version..."
    
    ffmpeg -i "$INPUT_VIDEO" \
        -vf "scale=${size}:force_original_aspect_ratio=decrease:force_divisible_by=2,pad=${size}:(ow-iw)/2:(oh-ih)/2:black" \
        -c:v libx264 \
        -preset slow \
        -crf "$crf" \
        -maxrate "$maxrate" \
        -bufsize "$(echo "$maxrate" | sed 's/k//' | awk '{print $1*2}')k" \
        -c:a aac \
        -b:a 96k \
        -ac 1 \
        -ar 44100 \
        -movflags +faststart \
        -pix_fmt yuv420p \
        -profile:v baseline \
        -level 3.0 \
        -y \
        "$output_file"
    
    # Get file size
    local file_size=$(du -h "$output_file" | cut -f1)
    echo "✅ ${res} version created: $output_file ($file_size)"
}

# Create high-quality versions with better CRF values and bitrates
optimize_hq "480p" "854:480" "20" "1200k"
optimize_hq "720p" "1280:720" "18" "2500k" 
optimize_hq "1080p" "1920:1080" "16" "4500k"

echo ""
echo "🎉 High-quality video optimization complete!"
echo "📋 Generated files:"
ls -lh "$OUTPUT_DIR/${OUTPUT_NAME}"*.mp4

echo ""
echo "💡 File sizes:"
du -sh "$OUTPUT_DIR/${OUTPUT_NAME}"*.mp4 