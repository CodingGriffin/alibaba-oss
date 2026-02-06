/**
 * UI Integration Tests
 * Tests for the main application functions
 */

// Mock DOM elements
function createMockDOM() {
    document.body.innerHTML = `
        <input type="file" id="fileInput">
        <input type="text" id="folderInput" value="uploads">
        <button id="uploadBtn">
            <span class="btn-text">Upload File</span>
            <span class="btn-loader" style="display: none;">Uploading...</span>
        </button>
        <div id="uploadStatus"></div>
        <div id="fileList"></div>
        <input type="text" id="folderFilter" value="uploads">
        <button id="refreshBtn">Refresh</button>
    `;
}

// Mock fetch responses
function mockFetchResponse(data, ok = true) {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok,
            json: () => Promise.resolve(data),
        })
    );
}

describe('UI Functions', () => {
    beforeEach(() => {
        createMockDOM();
        global.fetch.mockClear();
        jest.clearAllTimers();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('showStatus', () => {
        test('should display success message', () => {
            const uploadStatus = document.getElementById('uploadStatus');
            const { showStatus } = require('./app.js');
            
            showStatus('Test success', 'success');
            
            expect(uploadStatus.textContent).toBe('Test success');
            expect(uploadStatus.className).toContain('success');
        });

        test('should display error message', () => {
            const uploadStatus = document.getElementById('uploadStatus');
            const { showStatus } = require('./app.js');
            
            showStatus('Test error', 'error');
            
            expect(uploadStatus.textContent).toBe('Test error');
            expect(uploadStatus.className).toContain('error');
        });
    });

    describe('displayFiles', () => {
        test('should display files correctly', () => {
            const fileList = document.getElementById('fileList');
            const { displayFiles } = require('./app.js');
            
            const files = [
                {
                    name: 'uploads/test.txt',
                    size: 1024,
                    lastModified: '2024-01-15T10:30:00.000Z',
                    url: 'https://example.com/test.txt'
                }
            ];
            
            displayFiles(files, 'uploads');
            
            expect(fileList.innerHTML).toContain('test.txt');
            expect(fileList.innerHTML).toContain('1 KB');
        });

        test('should show empty message when no files', () => {
            const fileList = document.getElementById('fileList');
            const { displayFiles } = require('./app.js');
            
            displayFiles([], 'uploads');
            
            expect(fileList.innerHTML).toContain('No files found');
        });
    });
});






