#!/bin/bash

# Video Optimization Script for Health Journey App
# Usage: ./scripts/optimize-video.sh input-video.mov output-name
# Example: ./scripts/optimize-video.sh my-video.mov health-bg

set -e

# Check if arguments provided
if [ $# -ne 2 ]; then
    echo "Usage: $0 <input-video> <output-name>"
    echo "Example: $0 my-video.mov health-background"
    exit 1
fi

INPUT_VIDEO="$1"
OUTPUT_NAME="$2"
OUTPUT_DIR="public/images/videos/optimized"

# Check if input file exists
if [ ! -f "$INPUT_VIDEO" ]; then
    echo "Error: Input video '$INPUT_VIDEO' not found!"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

echo "🎬 Optimizing video: $INPUT_VIDEO"
echo "📁 Output directory: $OUTPUT_DIR"
echo "🏷️  Output name: $OUTPUT_NAME"
echo ""

# Get input video info
echo "📊 Analyzing input video..."
ffprobe -v quiet -print_format json -show_format -show_streams "$INPUT_VIDEO" > /tmp/video_info.json

# Function to optimize video at specific resolution
optimize_resolution() {
    local res="$1"
    local size="$2"
    local bitrate="$3"
    local output_file="$OUTPUT_DIR/${OUTPUT_NAME}-${res}.mp4"
    
    echo "🔄 Creating ${res} version (${size}, ${bitrate})..."
    
    ffmpeg -i "$INPUT_VIDEO" \
        -vf "scale=${size}:force_original_aspect_ratio=decrease,pad=${size}:(ow-iw)/2:(oh-ih)/2:black" \
        -c:v libx264 \
        -preset slow \
        -crf 23 \
        -maxrate "$bitrate" \
        -bufsize "$(echo "$bitrate" | sed 's/k//' | awk '{print $1*2}')k" \
        -c:a aac \
        -b:a 128k \
        -movflags +faststart \
        -pix_fmt yuv420p \
        -y \
        "$output_file"
    
    # Get file size
    local file_size=$(du -h "$output_file" | cut -f1)
    echo "✅ ${res} version created: $output_file ($file_size)"
}

# Create all resolution versions
optimize_resolution "480p" "854:480" "800k"
optimize_resolution "720p" "1280:720" "1500k" 
optimize_resolution "1080p" "1920:1080" "3000k"

echo ""
echo "🎉 Video optimization complete!"
echo "📋 Generated files:"
ls -lh "$OUTPUT_DIR/${OUTPUT_NAME}"*.mp4

echo ""
echo "🔧 To use in your coming-soon page, update the video sources:"
echo "src=\"/images/videos/optimized/${OUTPUT_NAME}-1080p.mp4\""
echo "src=\"/images/videos/optimized/${OUTPUT_NAME}-720p.mp4\""
echo "src=\"/images/videos/optimized/${OUTPUT_NAME}-480p.mp4\""

echo ""
echo "💡 Total file sizes:"
du -sh "$OUTPUT_DIR/${OUTPUT_NAME}"*.mp4

# Cleanup
rm -f /tmp/video_info.json 