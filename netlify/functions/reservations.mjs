import { getStore } from "@netlify/blobs";
import { handle } from "../lib/reservations-core.mjs";

export default async (req) =>
  handle(req, getStore({ name: "rezervace", consistency: "strong" }));

export const config = { path: "/api/reservations" };
