# GitHub 候发文案

## Repository name

sightline

## Short description

Local visual preflight for posters, social images, and UI screenshots.

## Suggested topics

accessibility, design-tools, color-contrast, color-blindness, visual-qa, privacy, offline-first, image-processing, chinese

## Release title

Sightline v0.1.0 — local visual preflight for exported design work

## Release body

Sightline is a small local-first tool for checking exported posters, social images, and UI screenshots before they go out.

It is designed for the moment after visual work leaves the source file: a designer or reviewer has a rendered image, not necessarily a Figma file or a CI pipeline.

### Included in v0.1.0

- Image import for PNG, JPG, WebP, GIF, and SVG
- Original, small-screen, grayscale, and approximate color-vision views
- Key-message area marking
- Pixel A/B contrast checks
- Dominant-color confusion-risk hints
- Local PNG and JSON exports
- Public validation examples and a five-minute tester script

### Privacy

Sightline is a static local app. Imported images stay in the browser and are not uploaded by the tool.

### Important boundary

This is a design-review aid, not a WCAG conformance report, medical simulator, or substitute for testing with real users.

### First feedback needed

Please try the public validation examples in the repository and report:

1. Whether you could complete the workflow without instructions;
2. Whether a view changed a real visual decision;
3. Which prompt was helpful or misleading;
4. What should be included in an exportable review record.

Do not attach client, personal, or unreleased images to public issues.
