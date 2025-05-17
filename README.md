
# Convoy Management System

A convoy tracking and management system built with React, TypeScript, and Mapbox.

## Project info

**URL**: https://lovable.dev/projects/f63f19f6-d2fd-4268-b4fc-f3819030f8d3

## Important Setup Step

Before running the application, you need to add your Mapbox token to the code:

1. Create an account at [Mapbox](https://www.mapbox.com/) if you don't have one
2. Get your public access token from the Mapbox dashboard
3. Replace `YOUR_MAPBOX_TOKEN` in `src/components/MapComponent.tsx` with your actual token

## Features

- Live convoy tracking on a map with route visualization
- Multiple route options (primary and alternate routes)
- Vehicle selection between civil and military vehicles
- Load management functionality
- Team invitation system
- Support for halts and sub-halts

## How to run the project

```sh
# Install dependencies
npm i

# Start the development server
npm run dev
```

## Technologies used

- React with TypeScript
- Mapbox GL for map rendering
- TailwindCSS for styling
- shadcn/ui for UI components

## Deployment

Simply open [Lovable](https://lovable.dev/projects/f63f19f6-d2fd-4268-b4fc-f3819030f8d3) and click on Share -> Publish.
