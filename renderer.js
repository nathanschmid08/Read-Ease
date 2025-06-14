// Configure marked for GitHub-style rendering
marked.setOptions({
    highlight: function (code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
    },
    breaks: true,
    gfm: true
});

const uploadSection = document.getElementById('uploadSection');
const fileInput = document.getElementById('fileInput');
const contentContainer = document.getElementById('contentContainer');
const markdownContent = document.getElementById('markdownContent');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');

// File upload handling
fileInput.addEventListener('change', handleFile);

// Drag and drop handling
uploadSection.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadSection.classList.add('dragover');
});

uploadSection.addEventListener('dragleave', () => {
    uploadSection.classList.remove('dragover');
});

uploadSection.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadSection.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileUpload(files[0]);
    }
});

function handleFile(e) {
    const file = e.target.files[0];
    if (file) {
        handleFileUpload(file);
    }
}

function handleFileUpload(file) {
    // Check if file is markdown
    if (!file.name.toLowerCase().endsWith('.md')) {
        showError('Only markdown (.md) files are supported');
        return;
    }

    // Update file info
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);

    // Read file content
    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        renderMarkdown(content);
    };
    reader.onerror = function () {
        showError('Failed to read file');
    };
    reader.readAsText(file);
}

function renderMarkdown(content) {
    try {
        // Convert markdown to HTML
        const htmlContent = marked.parse(content);

        // Display content
        markdownContent.innerHTML = htmlContent;
        contentContainer.classList.add('visible');

        // Highlight code blocks
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });

    } catch (error) {
        showError('Failed to parse markdown content');
        console.error('Markdown parsing error:', error);
    }
}

function showError(message) {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
                <i class="fas fa-exclamation-triangle error-icon"></i>
                <span>${message}</span>
            `;

    uploadSection.parentNode.insertBefore(errorDiv, uploadSection.nextSibling);

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function clearContent() {
    contentContainer.classList.remove('visible');
    markdownContent.innerHTML = '';
    fileInput.value = '';

    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Make upload section clickable
uploadSection.addEventListener('click', (e) => {
    if (e.target.closest('.upload-button')) return;
    fileInput.click();
});