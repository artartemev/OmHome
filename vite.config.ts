
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

export default defineConfig({
  base: './',
  plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'vaul@1.1.2': 'vaul',
        'sonner@2.0.3': 'sonner',
        'recharts@2.15.2': 'recharts',
        'react-resizable-panels@2.1.7': 'react-resizable-panels',
        'react-hook-form@7.55.0': 'react-hook-form',
        'react-day-picker@8.10.1': 'react-day-picker',
        'next-themes@0.4.6': 'next-themes',
        'lucide-react@0.487.0': 'lucide-react',
        'input-otp@1.4.2': 'input-otp',
        'figma:asset/f95174cadaf3c67681fa9565a8d67d13fbabaae5.png': path.resolve(__dirname, './src/assets/f95174cadaf3c67681fa9565a8d67d13fbabaae5.png'),
        'figma:asset/f4d3c6ce4c81560ba135e103547da8562f44ed3a.png': path.resolve(__dirname, './src/assets/f4d3c6ce4c81560ba135e103547da8562f44ed3a.png'),
        'figma:asset/efe1e185f3a2326580e5a9601b8652ce49652d44.png': path.resolve(__dirname, './src/assets/efe1e185f3a2326580e5a9601b8652ce49652d44.png'),
        'figma:asset/e70830a5d50c21485811d96667a824a1cb39a5e5.png': path.resolve(__dirname, './src/assets/e70830a5d50c21485811d96667a824a1cb39a5e5.png'),
        'figma:asset/e5af353556f0ccc88d364bf9e9de41dab821cb94.png': path.resolve(__dirname, './src/assets/e5af353556f0ccc88d364bf9e9de41dab821cb94.png'),
        'figma:asset/cfedf5a9193ac76690698538c31643e06074839c.png': path.resolve(
          __dirname,
          './src/assets/seniors_support/cfedf5a9193ac76690698538c31643e06074839c.png'
        ),
        'figma:asset/ca4aea19419ba04cf0f90e9ab20624be82edf82a.png': path.resolve(
          __dirname,
          './src/assets/seniors_support/ca4aea19419ba04cf0f90e9ab20624be82edf82a.png'
        ),
        'figma:asset/837f30a0bcbad9644745da73b9a4f25e64c6f2c0.png': path.resolve(__dirname, './src/assets/837f30a0bcbad9644745da73b9a4f25e64c6f2c0.png'),
        'figma:asset/7079ed6ac33259adcd696c14440f8602d1e716fc.png': path.resolve(__dirname, './src/assets/7079ed6ac33259adcd696c14440f8602d1e716fc.png'),
        'figma:asset/6775cce1800612867a453bb21cc0771a92e645cc.png': path.resolve(__dirname, './src/assets/6775cce1800612867a453bb21cc0771a92e645cc.png'),
        'figma:asset/62045b0f21b8b1e4a29aa4c897296899aaf01741.png': path.resolve(__dirname, './src/assets/62045b0f21b8b1e4a29aa4c897296899aaf01741.png'),
        'figma:asset/57bdb3d6544af7253ac87496ecd348f669914c3b.png': path.resolve(
          __dirname,
          './src/assets/seniors_support/57bdb3d6544af7253ac87496ecd348f669914c3b.png'
        ),
        'figma:asset/49e7b10a1659d4b39f939b273c126b64498f3bd3.png': path.resolve(__dirname, './src/assets/49e7b10a1659d4b39f939b273c126b64498f3bd3.png'),
        'figma:asset/2730f52b4eb67de99a5640171106da588153391f.png': path.resolve(__dirname, './src/assets/2730f52b4eb67de99a5640171106da588153391f.png'),
        'figma:asset/195a1792d90fc32038b445cff4419cf3dcb0fc86.png': path.resolve(__dirname, './src/assets/195a1792d90fc32038b445cff4419cf3dcb0fc86.png'),
        'figma:asset/189c96f7c85e5b32d3927643564a8458fbead576.png': path.resolve(__dirname, './src/assets/189c96f7c85e5b32d3927643564a8458fbead576.png'),
        'figma:asset/0f6babe4268406b7ddf855a6d902d52cadf0cd93.png': path.resolve(
          __dirname,
          './src/assets/seniors_support/0f6babe4268406b7ddf855a6d902d52cadf0cd93.png'
        ),
        'figma:asset/0b917eac1956948274d79e317113450c54acfb78.png': path.resolve(__dirname, './src/assets/0b917eac1956948274d79e317113450c54acfb78.png'),
        'figma:asset/08a25526285379767f1b263f0136d84372b8d790.png': path.resolve(__dirname, './src/assets/08a25526285379767f1b263f0136d84372b8d790.png'),
        'embla-carousel-react@8.6.0': 'embla-carousel-react',
        'cmdk@1.1.1': 'cmdk',
        'class-variance-authority@0.7.1': 'class-variance-authority',
        '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
        '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
        '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
        '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
        '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
        '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
        '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
        '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
        '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
        '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
        '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
        '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
        '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
        '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
        '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
        '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
        '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
        '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
        '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
        '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
        '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
        '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
        '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
        '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
        '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      port: 3000,
      open: true,
    },
  });