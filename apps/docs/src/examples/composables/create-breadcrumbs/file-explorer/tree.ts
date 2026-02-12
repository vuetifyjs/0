export interface FolderNode {
  name: string
  children?: FolderNode[]
}

export const tree: FolderNode = {
  name: 'Home',
  children: [
    {
      name: 'Documents',
      children: [
        {
          name: 'Projects',
          children: [
            {
              name: 'v0-app',
              children: [
                {
                  name: 'src',
                  children: [
                    {
                      name: 'components',
                      children: [
                        { name: 'AppHeader.vue' },
                        { name: 'AppFooter.vue' },
                      ],
                    },
                    {
                      name: 'composables',
                      children: [
                        { name: 'useAuth.ts' },
                        { name: 'useTheme.ts' },
                      ],
                    },
                    { name: 'main.ts' },
                    { name: 'App.vue' },
                  ],
                },
                { name: 'package.json' },
                { name: 'README.md' },
              ],
            },
            { name: 'portfolio' },
          ],
        },
        { name: 'Cover Letter.pdf' },
        { name: 'Resume.pdf' },
      ],
    },
    {
      name: 'Photos',
      children: [
        { name: 'Vacation' },
        { name: 'Family' },
      ],
    },
    { name: 'Music' },
  ],
}
