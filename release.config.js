module.exports = {
  branches: ['main'],
  // Ensure semantic-release can always resolve the GitHub owner/repo correctly in CI.
  repositoryUrl: 'https://github.com/huaichaow/marked-toc-extension.git',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        provenance: true,
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: 'lib/**',
          },
        ],
      },
    ],
    '@semantic-release/git',
  ],
};
