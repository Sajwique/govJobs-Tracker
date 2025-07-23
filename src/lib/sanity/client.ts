import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

//Client safe config
export const config = {
  projectId: "he6pzppi",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
};

export const client = createClient(config);

//Admin level client

const adminConfig = {
  ...config,
  token: process.env.EXPO_PUBLIC_SANITY_TOKEN,
};

export const adminClient = createClient(adminConfig);

//Image URL Builder

const builder = imageUrlBuilder(config);
export const urlFor = (source: string) => builder.image(source);
