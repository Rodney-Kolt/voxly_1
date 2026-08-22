import type { OpenNextConfig } from '@opennextjs/aws';

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: 'cloudflare',
      converter: 'cloudflare',
    },
  },
  middleware: {
    external: true,
    override: {
      wrapper: 'cloudflare',
      converter: 'cloudflare',
    },
  },
};

export default config;
