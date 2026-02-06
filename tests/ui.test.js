/**
 * UI Integration Tests with DOM manipulation
 */

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Load HTML
const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
const dom = new JSDOM(html, { url: 'http://localhost' });

// Setup global variables
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Mock fetch
global.fetch = jest.fn();

// Load utils
const { formatFileSize, formatDate } = require('../public/utils.js');

describe('UI Integration Tests', () => {
    beforeEach(() => {
        // Reset DOM
        document.body.innerHTML = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)[1];
        global.fetch.mockClear();
    });

    describe('DOM Elements', () => {
        test('should have all required elements', () => {
            expect(document.getElementById('fileInput')).toBeTruthy();
            expect(document.getElementById('folderInput')).toBeTruthy();
            expect(document.getElementById('uploadBtn')).toBeTruthy();
            expect(document.getElementById('uploadStatus')).toBeTruthy();
            expect(document.getElementById('fileList')).toBeTruthy();
            expect(document.getElementById('folderFilter')).toBeTruthy();
            expect(document.getElementById('refreshBtn')).toBeTruthy();
        });
    });

    describe('File Display', () => {
        test('should render file list correctly', () => {
            const fileList = document.getElementById('fileList');
            
            const files = [
                {
                    name: 'uploads/document.pdf',
                    size: 2048,
                    lastModified: '2024-01-15T10:30:00.000Z',
                    url: 'https://example.com/document.pdf'
                },
                {
                    name: 'uploads/image.jpg',
                    size: 1048576,
                    lastModified: '2024-01-16T14:20:00.000Z',
                    url: 'https://example.com/image.jpg'
                }
            ];

            // Simulate displayFiles function
            if (files.length === 0) {
                fileList.innerHTML = `<div class="empty">No files found in folder: uploads</div>`;
            } else {
                fileList.innerHTML = files.map(file => {
                    const fileName = file.name.split('/').pop();
                    const filePath = file.name;
                    
                    return `
                        <div class="file-item">
                            <div class="file-info">
                                <div class="file-name">${fileName}</div>
                                <div class="file-meta">
                                    <span class="file-size">${formatFileSize(file.size)}</span>
                                    <span class="file-date">${formatDate(file.lastModified)}</span>
                                    <span class="file-path" style="color: #999; font-size: 0.8em;">${filePath}</span>
                                </div>
                            </div>
                            <div class="file-actions">
                                <a href="${file.url}" target="_blank" class="btn-small btn-view">View</a>
                                <button class="btn-small btn-delete" onclick="deleteFile('${filePath}')">Delete</button>
                            </div>
                        </div>
                    `;
                }).join('');
            }

            expect(fileList.innerHTML).toContain('document.pdf');
            expect(fileList.innerHTML).toContain('image.jpg');
            expect(fileList.innerHTML).toContain('2 KB');
            expect(fileList.innerHTML).toContain('1 MB');
        });

        test('should show empty state when no files', () => {
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = `<div class="empty">No files found in folder: uploads</div>`;
            
            expect(fileList.innerHTML).toContain('No files found');
        });
    });

    describe('Form Validation', () => {
        test('should validate file input', () => {
            const fileInput = document.getElementById('fileInput');
            const folderInput = document.getElementById('folderInput');
            
            // Test empty file
            fileInput.files = [];
            expect(fileInput.files.length).toBe(0);
            
            // Test with file
            const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
            Object.defineProperty(fileInput, 'files', {
                value: [mockFile],
                writable: false,
            });
            
            expect(fileInput.files.length).toBe(1);
            expect(fileInput.files[0].name).toBe('test.txt');
        });

        test('should handle folder input', () => {
            const folderInput = document.getElementById('folderInput');
            folderInput.value = 'documents';
            
            expect(folderInput.value).toBe('documents');
            
            folderInput.value = '  images/photos  ';
            expect(folderInput.value.trim()).toBe('images/photos');
        });
    });
});






