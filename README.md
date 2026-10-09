# Samsy Frontend (React + Vite)

## Run
```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build in /dist
```

## Structure
```
src/
  App.jsx                 routes
  main.jsx                entry
  data/siteData.js        ALL text, links, numbers, news, roadmap  <- edit here
  assets/                 logo.svg, hero-globe.svg, skyline.svg, ecosystem-stack.svg,
                          founder.svg, lion.svg, eagle.svg   <- replace with real images
  components/             Navbar, Footer, Logo, Icon, PageHero, Sparkline
  components/home/        HeroSection, MarketStrip, EcosystemSection, AboutSection, NewsCommunity
  pages/                  Home, About, Ecosystem, SMZToken, SM9Project,
                          BlockchainExplorer, Roadmap, Whitepaper, News, Contact, NotFound
  styles/                 global.css (colors/variables), layout.css, home.css, pages.css
```

## Replacing assets
Overwrite files in `src/assets/` keeping the same name. If your new file is a PNG/JPG,
change the import extension (e.g. `founder.svg` -> `founder.png`) in the component.
Put `whitepaper.pdf` in `/public`.

## Connecting your MERN backend
Search for `TODO` in the code: contact form, newsletter and explorer search.
