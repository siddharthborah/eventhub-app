# EventHub Logo Assets

This directory contains the EventHub logo in various formats for different use cases.

## Files

### Logo Files
- `logo.svg` - Main logo with text (colored version for light backgrounds)
- `logo-white.svg` - White version for dark backgrounds
- `logo-samples.html` - Preview page showing all logo concepts

### Favicon Files
- `favicon.svg` - Icon-only version for favicon (SVG format)
- `favicon-32x32.png` - 32x32 PNG favicon
- `favicon-16x16.png` - 16x16 PNG favicon

## Usage

### In React Components
Use the `EventHubLogo` component:

```jsx
import EventHubLogo from './components/EventHubLogo';

// Default logo
<EventHubLogo />

// White version for dark backgrounds
<EventHubLogo variant="white" />

// Icon only
<EventHubLogo variant="icon-only" />

// Custom size
<EventHubLogo height={48} width={168} />
```

### In HTML Templates
Favicon links are already included in all templates:

```html
<link rel="icon" type="image/svg+xml" href="/static/img/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/static/img/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/static/img/favicon-16x16.png">
```

### Direct SVG Usage
You can also use the SVG files directly:

```html
<img src="/static/img/logo.svg" alt="EventHub" height="40">
```

## Design Details

- **Colors**: Primary `#667eea`, Secondary `#764ba2`
- **Font**: Inter (700 weight)
- **Concept**: Hub/network connectivity representing community gathering
- **Style**: Minimalist, modern, professional

## Converting to Other Formats

To create additional formats:

```bash
# Convert to PNG
magick logo.svg -resize 200x200 logo-200x200.png

# Convert to ICO (for older browsers)
magick favicon-32x32.png favicon-16x16.png favicon.ico
``` 