module.exports = {
    preset: 'ts-jest', // używamy ts-jest do przekształcania plików TypeScript
    testEnvironment: 'node', // środowisko testowe: Node.js
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Transformacja plików .ts i .tsx
    },
    testPathIgnorePatterns: ['/node_modules/', '/build/'], // Ignorowanie niepotrzebnych folderów
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'], // Obsługiwane rozszerzenia plików
    transformIgnorePatterns: [
      '/node_modules/(?!@prisma/client)', // Jeśli używasz Prisma, to musisz zamockować @prisma/client
    ],
  };
  