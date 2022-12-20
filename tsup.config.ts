import {
	defineConfig
} from "tsup";

export default defineConfig([{
	entry: ["index.ts"],
	outDir: "build",
	target: "node16",
	platform: "node",
	format: ["esm"],
	splitting: false,
	sourcemap: true,
	minify: false,
	shims: true,
	dts: true
}]);