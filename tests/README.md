# Testing Guide

This project includes comprehensive testing for the UI components and utility functions.

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### Run tests with coverage:
```bash
npm run test:coverage
```

## Test Structure

### Unit Tests
- **`tests/utils.test.js`** - Tests for utility functions (formatFileSize, formatDate)

### Integration Tests
- **`tests/ui.test.js`** - Tests for UI components and DOM manipulation

## Manual Testing

### Test Page
Access the interactive test page at:
```
http://localhost:3000/test
```

The test page includes:
- Utility function tests
- DOM element validation
- File format tests
- Mock API tests
- Interactive UI testing

### Test Features
1. **Utility Functions**: Test file size and date formatting
2. **DOM Elements**: Verify all required elements exist
3. **File Format**: Test various file size conversions
4. **API Tests**: Test API endpoint availability
5. **Interactive UI**: Test actual upload and file listing functionality

## Writing New Tests

### Example Test Structure:
```javascript
describe('Feature Name', () => {
    beforeEach(() => {
        // Setup
    });

    test('should do something', () => {
        // Test implementation
        expect(result).toBe(expected);
    });
});
```

## Test Coverage

The test suite covers:
- ✅ Utility functions (formatFileSize, formatDate)
- ✅ DOM element existence
- ✅ File display rendering
- ✅ Form validation
- ✅ Error handling







