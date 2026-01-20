export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // If it's the main page, serve HTML
    if (url.pathname === '/') {
      return new Response(getHTML(), {
        headers: {
          'content-type': 'text/html;charset=UTF-8',
        },
      });
    }
    
    // If it's the image generation endpoint
    if (url.pathname === '/generate') {
      const prompt = url.searchParams.get('prompt') || 'cyberpunk cat';
      const num_steps = parseInt(url.searchParams.get('num_steps') || '20');
      
      const inputs = {
        prompt: prompt,
        num_steps: num_steps
      };
      
      const response = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        inputs
      );
      
      return new Response(response, {
        headers: {
          "content-type": "image/png"
        }
      });
    }
    
    return new Response('Not found', { status: 404 });
  }
};

function getHTML() {
  return `<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>AI Image Generator</title>
	<style>
		:root {
			--primary-color: #f6821f;
			--primary-hover: #e67e22;
			--light-bg: #f9fafb;
			--border-color: #e5e7eb;
			--text-color: #1f2937;
			--text-light: #6b7280;
			--user-msg-bg: #fff2e6;
			--assistant-msg-bg: #f3f4f6;
		}

		body.dark {
			--light-bg: #1f1f1f;
			--border-color: #333;
			--text-color: #f5f5f5;
			--text-light: #aaa;
			--user-msg-bg: #2a2a2a;
			--assistant-msg-bg: #252525;
			background-color: #121212;
			color: var(--text-color);
		}

		* {
			box-sizing: border-box;
			margin: 0;
			padding: 0;
		}

		body {
			font-family:
				-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
				Cantarell, sans-serif;
			line-height: 1.6;
			color: var(--text-color);
			max-width: 800px;
			margin: 0 auto;
			padding: 1rem;
			transition: background-color 0.3s, color 0.3s;
		}

		header {
			text-align: center;
			margin-bottom: 2rem;
			padding: 1rem 0;
			border-bottom: 1px solid var(--border-color);
			position: relative;
		}

		h1 {
			font-size: 1.5rem;
			color: var(--primary-color);
		}

		.theme-toggle {
			position: absolute;
			top: 1rem;
			right: 1rem;
			background: var(--primary-color);
			color: #fff;
			border: none;
			padding: 0.5rem 1rem;
			border-radius: 4px;
			cursor: pointer;
			transition: background 0.2s;
		}

		.theme-toggle:hover {
			background: var(--primary-hover);
		}

		.container {
			border: 1px solid var(--border-color);
			border-radius: 8px;
			overflow: hidden;
			background-color: var(--light-bg);
			transition: background-color 0.3s;
		}

		.content {
			padding: 2rem;
		}

		.input-group {
			margin-bottom: 1.5rem;
		}

		label {
			display: block;
			margin-bottom: 0.5rem;
			font-weight: 500;
			color: var(--text-color);
		}

		input[type="text"],
		input[type="number"] {
			width: 100%;
			padding: 0.75rem;
			border: 1px solid var(--border-color);
			border-radius: 4px;
			font-family: inherit;
			background-color: white;
			color: var(--text-color);
			transition: background-color 0.3s, color 0.3s, border-color 0.3s;
		}

		body.dark input[type="text"],
		body.dark input[type="number"] {
			background-color: var(--user-msg-bg);
		}

		#generate-button {
			width: 100%;
			padding: 0.75rem;
			background-color: var(--primary-color);
			color: white;
			border: none;
			border-radius: 4px;
			cursor: pointer;
			transition: background-color 0.2s;
			font-size: 1rem;
			font-weight: 500;
		}

		#generate-button:hover {
			background-color: var(--primary-hover);
		}

		#generate-button:disabled {
			background-color: var(--text-light);
			cursor: not-allowed;
		}

		.loading {
			display: none;
			text-align: center;
			padding: 2rem;
			font-style: italic;
			color: var(--text-light);
		}

		.loading.visible {
			display: block;
		}

		.image-container {
			margin-top: 2rem;
			text-align: center;
		}

		.image-container img {
			max-width: 100%;
			border-radius: 8px;
			border: 1px solid var(--border-color);
		}

		#export-button {
			margin-top: 1rem;
			padding: 0.75rem 1.5rem;
			background-color: var(--primary-color);
			color: white;
			border: none;
			border-radius: 4px;
			cursor: pointer;
			transition: background-color 0.2s;
			font-size: 1rem;
			font-weight: 500;
			display: none;
		}

		#export-button.visible {
			display: inline-block;
		}

		#export-button:hover {
			background-color: var(--primary-hover);
		}

		footer {
			margin-top: 1rem;
			text-align: center;
			font-size: 0.85rem;
			color: var(--text-light);
		}
	</style>
</head>
<body>
	<header>
		<h1>text-to-image-ai.callaback.com</h1>
		<p>@cf/stabilityai/stable-diffusion-xl-base-1.0</p>
		<button class="theme-toggle" id="theme-toggle">Dark</button>
	</header>

	<div class="container">
		<div class="content">
			<div class="input-group">
				<label for="prompt">Prompt</label>
				<input
					type="text"
					id="prompt"
					placeholder="cyberpunk cat"
					value="cyberpunk cat"
				/>
			</div>

			<div class="input-group">
				<label for="num-steps">Number of Steps (1-50)</label>
				<input
					type="number"
					id="num-steps"
					min="1"
					max="50"
					value="20"
				/>
			</div>

			<button id="generate-button">Generate Image</button>

			<div class="loading" id="loading">
				Generating your image...
			</div>

			<div class="image-container" id="image-container"></div>
			<button id="export-button">Download Image</button>
		</div>
	</div>

	<footer>
		<p>Powered by Cloudflare Workers AI &copy; 2025</p>
	</footer>

	<script>
		const toggleButton = document.getElementById('theme-toggle');
		toggleButton.addEventListener('click', () => {
			document.body.classList.toggle('dark');
		});

		const generateButton = document.getElementById('generate-button');
		const promptInput = document.getElementById('prompt');
		const stepsInput = document.getElementById('num-steps');
		const loading = document.getElementById('loading');
		const imageContainer = document.getElementById('image-container');
		const exportButton = document.getElementById('export-button');

		let currentImageBlob = null;
		let currentPrompt = '';

		generateButton.addEventListener('click', async () => {
			const prompt = promptInput.value || 'cyberpunk cat';
			const numSteps = stepsInput.value || 20;
			currentPrompt = prompt;

			generateButton.disabled = true;
			loading.classList.add('visible');
			imageContainer.innerHTML = '';
			exportButton.classList.remove('visible');

			try {
				const response = await fetch(\`/generate?prompt=\${encodeURIComponent(prompt)}&num_steps=\${numSteps}\`);
				
				if (!response.ok) {
					throw new Error('Failed to generate image');
				}

				const blob = await response.blob();
				currentImageBlob = blob;
				const imageUrl = URL.createObjectURL(blob);
				
				const img = document.createElement('img');
				img.src = imageUrl;
				img.alt = prompt;
				imageContainer.appendChild(img);
				
				exportButton.classList.add('visible');
			} catch (error) {
				imageContainer.innerHTML = \`<p style="color: red;">Error: \${error.message}</p>\`;
			} finally {
				generateButton.disabled = false;
				loading.classList.remove('visible');
			}
		});

		exportButton.addEventListener('click', () => {
			if (currentImageBlob) {
				const url = URL.createObjectURL(currentImageBlob);
				const a = document.createElement('a');
				a.href = url;
				a.download = \`\${currentPrompt.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png\`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
			}
		});
	</script>
</body>
</html>`;
}
