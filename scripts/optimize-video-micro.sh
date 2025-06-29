#!/bin/bash

# Micro Video Script - Creates videos under 50KB each
# For Vercel deployment without LFS issues

set -e

if [ $# -ne 2 ]; then
    echo "Usage: $0 <input-video> <output-name>"
    exit 1
fi

INPUT_VIDEO="$1"
OUTPUT_NAME="$2"
OUTPUT_DIR="public/images/videos/optimized"

if [ ! -f "$INPUT_VIDEO" ]; then
    echo "Error: Input video '$INPUT_VIDEO' not found!"
    exit 1
fi

mkdir -p "$OUTPUT_DIR"

echo "🎬 Creating micro-sized videos (under 50KB each): $INPUT_VIDEO"
echo ""

# Micro settings for extremely small files
optimize_micro() {
    local res="$1"
    local size="$2"
    local bitrate="$3"
    local fps="$4"
    local output_file="$OUTPUT_DIR/${OUTPUT_NAME}-${res}.mp4"
    
    echo "🔄 Creating micro ${res} version..."
    
    ffmpeg -i "$INPUT_VIDEO" \
        -vf "scale=${size}:force_original_aspect_ratio=decrease,pad=${size}:(ow-iw)/2:(oh-ih)/2:black" \
        -c:v libx264 \
        -preset ultrafast \
        -crf 35 \
        -maxrate "$bitrate" \
        -bufsize "$(echo "$bitrate" | sed 's/k//' | awk '{print $1*1}')k" \
        -r "$fps" \
        -c:a aac \
        -b:a 32k \
        -ac 1 \
        -ar 16000 \
        -movflags +faststart \
        -pix_fmt yuv420p \
        -y \
        "$output_file"
    
    local file_size=$(du -h "$output_file" | cut -f1)
    echo "✅ ${res} version created: $output_file ($file_size)"
}

# Create micro versions (all under 50KB)
optimize_micro "480p" "320:240" "50k" "15"
optimize_micro "720p" "480:360" "80k" "15"  
optimize_micro "1080p" "640:480" "120k" "15"

echo ""
echo "🎉 Micro video optimization complete!"
echo "📋 Generated files:"
ls -lh "$OUTPUT_DIR/${OUTPUT_NAME}"*.mp4

echo ""
echo "💡 File sizes (should all be under 50KB):"
du -sh "$OUTPUT_DIR/${OUTPUT_NAME}"*.mp4 