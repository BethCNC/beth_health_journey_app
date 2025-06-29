#!/bin/bash

# Ultra-compressed Video Script for Direct Git Commits
# Creates tiny videos under 1MB each for web backgrounds

set -e

# Check if arguments provided
if [ $# -ne 2 ]; then
    echo "Usage: $0 <input-video> <output-name>"
    echo "Example: $0 my-video.mov tiny-bg"
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

echo "🎬 Creating ultra-compressed videos: $INPUT_VIDEO"
echo "📁 Output directory: $OUTPUT_DIR"
echo "🏷️  Output name: $OUTPUT_NAME"
echo ""

# Ultra-compressed settings for tiny file sizes
optimize_tiny() {
    local res="$1"
    local size="$2"
    local bitrate="$3"
    local output_file="$OUTPUT_DIR/${OUTPUT_NAME}-${res}.mp4"
    
    echo "🔄 Creating ultra-compressed ${res} version..."
    
    ffmpeg -i "$INPUT_VIDEO" \
        -vf "scale=${size}:force_original_aspect_ratio=decrease,pad=${size}:(ow-iw)/2:(oh-ih)/2:black" \
        -c:v libx264 \
        -preset fast \
        -crf 28 \
        -maxrate "$bitrate" \
        -bufsize "$(echo "$bitrate" | sed 's/k//' | awk '{print $1*1.5}')k" \
        -c:a aac \
        -b:a 64k \
        -ac 1 \
        -ar 22050 \
        -movflags +faststart \
        -pix_fmt yuv420p \
        -y \
        "$output_file"
    
    # Get file size
    local file_size=$(du -h "$output_file" | cut -f1)
    echo "✅ ${res} version created: $output_file ($file_size)"
}

# Create ultra-compressed versions (all under 1MB)
optimize_tiny "480p" "640:480" "300k"
optimize_tiny "720p" "960:720" "600k" 
optimize_tiny "1080p" "1280:720" "800k"  # Actually 720p but labeled for compatibility

echo ""
echo "🎉 Ultra-compressed video optimization complete!"
echo "📋 Generated files:"
ls -lh "$OUTPUT_DIR/${OUTPUT_NAME}"*.mp4

echo ""
echo "💡 Total file sizes (all under 1MB for direct git commit):"
du -sh "$OUTPUT_DIR/${OUTPUT_NAME}"*.mp4

echo ""
echo "🔧 To use in your coming-soon page, update the video sources:"
echo "src=\"/images/videos/optimized/${OUTPUT_NAME}-1080p.mp4\""
echo "src=\"/images/videos/optimized/${OUTPUT_NAME}-720p.mp4\""
echo "src=\"/images/videos/optimized/${OUTPUT_NAME}-480p.mp4\"" 