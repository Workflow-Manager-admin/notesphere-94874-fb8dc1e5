#!/bin/bash
cd /home/kavia/workspace/code-generation/notesphere-94874-fb8dc1e5/notes_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

