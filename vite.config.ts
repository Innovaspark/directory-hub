import { defineConfig } from 'vite';
import graphqlPlugin from 'vite-plugin-graphql';

export default defineConfig({
  plugins: [graphqlPlugin()],
});
