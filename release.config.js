module.exports = {
  branches: ['main', 'customized/*'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    ['@semantic-release/github', {
      assets: [
        {
          path: 'lib/**',
        },
      ],
    }],
    '@semantic-release/git',
  ],
};
