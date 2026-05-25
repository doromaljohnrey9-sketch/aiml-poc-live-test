import { withWorkflow } from "workflow/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
};

export default withWorkflow(nextConfig);
