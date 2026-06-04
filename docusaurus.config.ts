import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Modern Security Engineer Guide',
  tagline: 'How security is actually done in 2026 — offensive and defensive, for absolute beginners and beyond',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://tonyx1998.github.io',
  baseUrl: '/modern-security-engineer-guide/',

  organizationName: 'tonyx1998',
  projectName: 'modern-security-engineer-guide',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',

  // "Technical Editorial" type system — Space Grotesk / Hanken Grotesk / JetBrains Mono.
  headTags: [
    {
      tagName: 'link',
      attributes: {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
    },
    {
      tagName: 'link',
      attributes: {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous'},
    },
  ],
  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
  ],

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themes: [
    '@docusaurus/theme-mermaid',
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/docs',
          // showLastUpdateTime requires a git repository — re-enable after `git init`.
          showLastUpdateTime: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.svg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
      options: {
        fontFamily: "'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif",
        flowchart: {curve: 'basis', htmlLabels: true, padding: 16, nodeSpacing: 55, rankSpacing: 55, useMaxWidth: false},
        sequence: {useMaxWidth: false, mirrorActors: false},
        gantt: {useMaxWidth: false},
        themeVariables: {
          darkMode: true,
          primaryColor: '#4c1d95',
          primaryTextColor: '#f1f5f9',
          primaryBorderColor: '#a78bfa',
          lineColor: '#a5b4cb',
          secondaryColor: '#334155',
          tertiaryColor: '#1e1b2b',
          fontSize: '15px',
          fontFamily: "'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif",
        },
        themeCSS: '.node rect{rx:8px;ry:8px} .node rect,.node polygon{stroke-width:1.5px} .edgePath .path{stroke-width:1.5px} .cluster rect{rx:10px;ry:10px}',
      },
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'Modern Security Engineer Guide',
      hideOnScroll: false,
      items: [
        {
          type: 'html',
          position: 'left',
          value: '<span class="nav-ver">2026</span>',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Guide',
        },
        {
          to: '/docs/glossary',
          label: 'Glossary',
          position: 'left',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Foundations & building',
          items: [
            {label: 'Introduction', to: '/'},
            {label: '1. Foundations', to: '/docs/foundations'},
            {label: '2. Cryptography', to: '/docs/cryptography'},
            {label: '3. Web & App Security', to: '/docs/appsec'},
            {label: '4. Secure SDLC', to: '/docs/secure-sdlc'},
          ],
        },
        {
          title: 'Offensive & defensive',
          items: [
            {label: '5. Pentesting & Red Team', to: '/docs/offensive'},
            {label: '6. Detection & Response', to: '/docs/detection'},
            {label: '7. Incident & Forensics', to: '/docs/incident-forensics'},
          ],
        },
        {
          title: 'Infra, cloud & governance',
          items: [
            {label: '8. Network Security', to: '/docs/network-security'},
            {label: '9. Cloud & Identity', to: '/docs/cloud-identity'},
            {label: '10. Compliance', to: '/docs/compliance'},
            {label: '11. AI Security', to: '/docs/ai-security'},
          ],
        },
        {
          title: 'Career & reference',
          items: [
            {label: '12. Career', to: '/docs/career'},
            {label: '13. Case Studies', to: '/docs/case-studies'},
            {label: '14. Glossary', to: '/docs/glossary'},
          ],
        },
        {
          title: 'Project',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/tonyx1998/modern-security-engineer-guide',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Modern Security Engineer Guide. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        'bash',
        'json',
        'yaml',
        'toml',
        'docker',
        'sql',
        'tsx',
        'jsx',
        'python',
        'http',
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
