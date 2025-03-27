import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'HackerRank Guide',
  description: 'A VitePress Site',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Angular', link: '/docs/es/angular/intermediate' },
      { text: 'DotNet', link: '/docs/es/dotnet/basic' },
      { text: 'React Native', link: '/docs/es/react-native/basic' },
      { text: 'Sql', link: '/docs/es/sql/intermediate' },
      { text: 'TypeScript', link: '/docs/es/typescript/intermediate' },
      {
        text: 'Language',
        items: [
          { text: 'English', link: '/docs/en/angular/intermediate' },
          { text: 'Español', link: '/docs/es/angular/intermediate' },
        ],
      },
    ],

    sidebar: [
      {
        text: 'Angular',
        items: [
          { text: 'Intermedio', link: '/docs/es/angular/intermediate' },
          { text: 'Avanzado', link: '/docs/es/angular/advanced' },
        ],
      },
      {
        text: 'DotNet',
        items: [
          { text: 'Básico', link: '/docs/es/dotnet/basic' },
          { text: 'Intermedio', link: '/docs/es/dotnet/intermediate' },
        ],
      },
      {
        text: 'React Native',
        items: [
          { text: 'Básico', link: '/docs/es/react-native/basic' },
          { text: 'Intermedio', link: '/docs/es/react-native/intermediate' },
        ],
      },
      {
        text: 'Sql',
        items: [
          { text: 'Intermedio', link: '/docs/es/sql/intermediate' },
          { text: 'Avanzado', link: '/docs/es/sql/advanced' },
        ],
      },
      {
        text: 'TypeScript',
        items: [{ text: 'Intermedio', link: '/docs/es/typescript/intermediate' }],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
});
