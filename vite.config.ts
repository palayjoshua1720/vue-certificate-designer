import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import path from 'path'

export default defineConfig({
	plugins: [
		vue(),
		dts({
			insertTypesEntry: true,
			tsconfigPath: path.resolve(__dirname, 'tsconfig.json'),
			include: ['src/**/*.ts', 'src/**/*.vue'],
			exclude: ['src/**/*.stories.ts', 'src/**/*.test.ts'],
			rollupTypes: true,
      		// skipDiagnostics: false,
		}),
	],
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: 'CertificateDesigner',
			fileName: (format) => `certificate-designer.${format}.js`,
			formats: ['es', 'umd'],
		},
		rollupOptions: {
			external: ['vue', 'konva', 'vue-konva'],
			output: {
				exports: 'named',
				globals: {
					vue: 'Vue',
					konva: 'Konva',
					'vue-konva': 'VueKonva',
				}
			}
		}
	}
})