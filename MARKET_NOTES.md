# Why this project, and why not a generic image tool

This note records the initial product choice. It is not a claim that the project already has product-market fit.

## The demand signal

- WebAIM's 2025 scan of the top one million home pages found detectable WCAG failures on 94.8% of pages. Low-contrast text was the most frequent failure, present on 79.1% of home pages. Source: [WebAIM Million 2025](https://webaim.org/projects/million/2025).
- W3C's contrast guidance explicitly applies to text rendered into images as well as text in the browser. It uses 4.5:1 as the usual AA reference for normal text and 3:1 for large text. Source: [W3C contrast minimum](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html).
- The European Accessibility Act came into effect in June 2025 for relevant EU products and services. Source: [European Commission](https://commission.europa.eu/news-and-media/news/eu-becomes-more-accessible-all-2025-07-31_en).

These sources show that visual readability is a persistent problem, not that a new app will automatically be popular.

## What is already crowded

### Do not build another screenshot utility

Open-source screenshot products already cover capture, annotation, redaction and local export. Examples include [ScreenAI](https://getscreenai.com/) and [achu](https://www.achu.app/). A new project that only captures, annotates, blurs and exports would not have a strong enough reason to exist.

### Do not build only a color-blindness simulator

Figma has a contrast checker and accessibility tooling, while tools such as [Color Oracle](https://colororacle.org/) and [CoBlind](https://www.coblind.com/) already simulate color vision conditions. A single filter is useful, but too narrow to be a distinct project.

### Do not start with developer-only visual regression

There are mature testing platforms such as [Visual Regression Tracker](https://github.com/Visual-Regression-Tracker/Visual-Regression-Tracker). Rebuilding pixel diff or CI infrastructure would produce a worse version of an existing developer product.

## The intended wedge

Sightline begins with the exported visual artifact rather than the original design file:

1. A creator drops in a poster, social image or UI screenshot.
2. They identify the information that must survive the real viewing context.
3. They inspect that output on a small screen, in grayscale and in approximate color-vision simulations.
4. They make one or more explicit, inspectable contrast checks.
5. They export a local review record.

The key distinction is not “we invented contrast checking”. It is an image-first, privacy-first review workflow for people who have an output image but do not have a design system, Figma file or CI pipeline.

## First validation, before any public launch

Use only public, self-made or fully permissioned samples. Ask 6–10 designers, marketers or product people to perform one real task:

> “Before publishing this image, use Sightline to decide whether you would change anything.”

Record:

- Whether they successfully find the key controls without instruction;
- Whether they change a visual decision after the check;
- Which view is useful and which is noise;
- Whether they would use it again on the next delivery;
- What they expect the exported record to contain.

The right next step is to improve the feature users repeat, not to add AI or packaging merely because competitors have it.
