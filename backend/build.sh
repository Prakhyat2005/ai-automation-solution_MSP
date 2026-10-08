#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="$ROOT_DIR/build"

mkdir -p "$BUILD_DIR"

function build_api() {
  local outdir="$BUILD_DIR/api"
  rm -rf "$outdir" && mkdir -p "$outdir"
  python3 -m pip install -r "$ROOT_DIR/requirements.txt" -t "$outdir"
  # Include app and AI assistant module
  cp "$ROOT_DIR/app.py" "$outdir/"
  cp "$ROOT_DIR/ai_assistant.py" "$outdir/"
  (cd "$BUILD_DIR" && zip -r "api.zip" "api")
  echo "Built: $BUILD_DIR/api.zip"
}

function build_triage() {
  local outdir="$BUILD_DIR/triage"
  rm -rf "$outdir" && mkdir -p "$outdir"
  # Minimal deps; boto3 typically available in Lambda, but include for portability
  python3 -m pip install boto3 -t "$outdir"
  cp "$ROOT_DIR/triage_handler.py" "$outdir/"
  (cd "$BUILD_DIR" && zip -r "triage.zip" "triage")
  echo "Built: $BUILD_DIR/triage.zip"
}

function build_analytics() {
  local outdir="$BUILD_DIR/analytics"
  rm -rf "$outdir" && mkdir -p "$outdir"
  python3 -m pip install boto3 -t "$outdir"
  cp "$ROOT_DIR/analytics_handler.py" "$outdir/"
  (cd "$BUILD_DIR" && zip -r "analytics.zip" "analytics")
  echo "Built: $BUILD_DIR/analytics.zip"
}

build_api
build_triage
build_analytics

echo "All Lambda packages built under: $BUILD_DIR"