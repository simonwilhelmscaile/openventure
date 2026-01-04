module.exports = {
  ci: {
    collect: {
      // URLs to test - will be updated dynamically based on deployed site
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/blog',
        'http://localhost:3000/about',
      ],
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'Ready',
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        // SEO must be >= 95
        'categories:seo': ['error', { minScore: 0.95 }],
        // Performance must be >= 90
        'categories:performance': ['warn', { minScore: 0.90 }],
        // Accessibility must be >= 90
        'categories:accessibility': ['error', { minScore: 0.90 }],
        // Best practices must be >= 90
        'categories:best-practices': ['warn', { minScore: 0.90 }],
      },
    },
    upload: {
      // Don't upload to LHCI server by default
      target: 'temporary-public-storage',
    },
  },
};
