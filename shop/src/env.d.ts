/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_NEWSLETTER_ENDPOINT?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
