import {
	defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		host: '0.0.0.0', // 让服务器监听所有网络 IP（包括局域网）
		port: 5173 // 可选：你也可以自定义端口
	}
})