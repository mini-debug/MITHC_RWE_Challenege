#!/bin/bash

# Script to create a standalone HTML file with embedded CSS and JavaScript

cat > comparator-standalone.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Site Battle Comparator | Energy Grid Analysis</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
EOF

cat comparator.css >> comparator-standalone.html

cat >> comparator-standalone.html << 'EOF'
    </style>
</head>
<body>
EOF

# Extract body content from original HTML (between <body> and </body>)
sed -n '/<body>/,/<\/body>/p' comparator.html | sed '1d;$d' >> comparator-standalone.html

cat >> comparator-standalone.html << 'EOF'
    <script>
EOF

cat data-integration.js >> comparator-standalone.html
echo "" >> comparator-standalone.html
cat comparator.js >> comparator-standalone.html

cat >> comparator-standalone.html << 'EOF'
    </script>
</body>
</html>
EOF

echo "✅ Created comparator-standalone.html"
echo "This file contains all CSS and JavaScript inline."
echo "You can now share just this ONE file!"
