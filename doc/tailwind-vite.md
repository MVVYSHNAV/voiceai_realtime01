# Tailwin Installation in Vite + React

## Get started with Tailwind CSS
Tailwind CSS works by scanning all of your HTML files, JavaScript components, and any other templates for class names, generating the corresponding styles and then writing them to a static CSS file.
It's fast, flexible, and reliable — with zero-runtime.

## Installing Tailwind CSS as a Vite plugin is the most seamless way to integrate it with frameworks like Laravel, SvelteKit, React Router, Nuxt, and SolidJS.


### Install Tailwind CSS
> Install tailwindcss and @tailwindcss/vite via npm.
`npm install tailwindcss @tailwindcss/vite`

### Configure the Vite plugin
> Add the @tailwindcss/vite plugin to your Vite configuration.

file: vite.config.ts:
```
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```



### Import Tailwind CSS
> Add an @import to your CSS file that imports Tailwind CSS.

`@import "tailwindcss";`


### Start your build process
> Run your build process with npm run dev or whatever command is configured in your package.json file.

`npm run dev`

### Start using Tailwind in your HTML
> Make sure your compiled CSS is included in the <head> (your framework might handle this for you), then start using Tailwind’s utility classes to style your content.

HTML:
```
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="/src/styles.css" rel="stylesheet">
</head>
<body>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
</body>
</html>
```


# Alternative - PlayCDN

Use the Play CDN to try Tailwind right in the browser without any build step. The Play CDN is designed for development purposes only, and is not intended for production.


## Add the Play CDN script to your HTML
> Add the Play CDN script tag to the <head> of your HTML file, and start using Tailwind’s utility classes to style your content.

index.html:
```
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  </head>
  <body>
    <h1 class="text-3xl font-bold underline">
      Hello world!
    </h1>
  </body>
</html>
```

## Try adding some custom CSS
> Use type="text/tailwindcss" to add custom CSS that supports all of Tailwind's CSS features.

index.html:
```
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style type="text/tailwindcss">
      @theme {
        --color-clifford: #da373d;
      }
    </style>
  </head>
  <body>
    <h1 class="text-3xl font-bold underline text-clifford">
      Hello world!
    </h1>
  </body>
</html>
```