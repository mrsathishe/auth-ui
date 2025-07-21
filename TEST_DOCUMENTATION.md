# Test Suite Documentation

## Overview

This test suite provides comprehensive coverage for the authentication system using React Testing Library and Jest.

## Test Structure

### 🔧 Configuration Files

- `jest.config.js` - Jest configuration with Next.js integration
- `jest.setup.js` - Global test setup and mocks

### 📁 Test Files Created

#### 1. **Login Component Tests**

- `src/app/login/__tests__/login.test.tsx`
- Tests form rendering, validation, user interaction
- Coverage: Form fields, validation errors, input changes

#### 2. **API Helper Tests**

- `src/app/helpers/__tests__/api.test.ts`
- Tests `loginUser()` and `registerUser()` functions
- Coverage: HTTP requests, error handling, environment variables

#### 3. **Auth Cache Tests**

- `src/app/helpers/__tests__/authCache.test.ts`
- Tests authentication caching functionality
- Coverage: Store, retrieve, expiration, localStorage handling

#### 4. **Callback Utils Tests**

- `src/app/helpers/__tests__/callbackUtils.test.ts`
- Tests URL construction and parameter handling
- Coverage: Success/error parameters, token handling

#### 5. **Component Tests**

- `src/app/components/__tests__/AuthStatus.test.tsx`
- `src/app/components/__tests__/SearchParamsWrapper.test.tsx`
- Coverage: Component rendering, user interactions, props handling

#### 6. **Register Page Tests**

- `src/app/register/__tests__/register.test.tsx`
- Tests registration form functionality
- Coverage: Form validation, password strength, phone input

#### 7. **Main Page Tests**

- `src/app/__tests__/page.test.ts`
- Tests home page redirect functionality

## 🚀 Running Tests

### Available Scripts

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Test Commands

```bash
# Run specific test file
npm test -- login.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="validation"

# Run tests with verbose output
npm test -- --verbose

# Update snapshots (if any)
npm test -- --updateSnapshot
```

## 📊 Test Coverage

The test suite covers:

- ✅ **Forms**: Login/Register form validation and submission
- ✅ **API Calls**: HTTP requests and error handling
- ✅ **Authentication**: Cache management and token handling
- ✅ **Components**: UI component rendering and interactions
- ✅ **Utilities**: URL construction and callback parameters
- ✅ **Navigation**: Page redirects and routing

## 🔍 Mocking Strategy

### External Dependencies Mocked:

- `next/navigation` - useSearchParams, redirect
- `react-toastify` - Toast notifications
- `axios` - HTTP client
- `react-phone-number-input` - Phone input component
- `localStorage` - Browser storage

### Global Mocks:

- `window.location` - Page navigation
- `Date.now()` - Consistent timestamps
- `URL` constructor - URL manipulation

## 🛠 Test Patterns

### 1. **Component Testing**

```typescript
// Arrange
render(<Component {...props} />);

// Act
fireEvent.click(screen.getByRole("button"));

// Assert
expect(screen.getByText("Expected")).toBeInTheDocument();
```

### 2. **Async Testing**

```typescript
await waitFor(() => {
  expect(mockFunction).toHaveBeenCalled();
});
```

### 3. **Mock Verification**

```typescript
expect(mockApi).toHaveBeenCalledWith(expectedParams);
expect(mockFunction).toHaveBeenCalledTimes(1);
```

## 🔧 Troubleshooting

### Common Issues:

1. **Import Errors**: Ensure all dependencies are mocked properly
2. **Async Issues**: Use `waitFor()` for async operations
3. **Component Props**: Verify prop types match component interfaces
4. **Mock Cleanup**: Clear mocks in `beforeEach()` hooks

### Debugging Tips:

```typescript
// Debug component output
screen.debug();

// Debug specific element
screen.debug(screen.getByTestId("element"));

// Check what's rendered
console.log(screen.getByRole("button").outerHTML);
```

## 📈 Coverage Goals

Target coverage levels:

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 85%
- **Lines**: > 80%

## 🚀 CI/CD Integration

The test suite is configured for CI environments:

- No watch mode in CI
- Coverage reports generated
- Exit codes for pass/fail status

## 📝 Adding New Tests

When adding new features:

1. Create test file in appropriate `__tests__` directory
2. Follow existing naming convention: `feature.test.tsx`
3. Include unit tests for all public functions
4. Test both success and error scenarios
5. Mock external dependencies appropriately

## 🎯 Best Practices

1. **Descriptive Test Names**: Use clear, specific test descriptions
2. **Arrange-Act-Assert**: Follow consistent test structure
3. **Mock Isolation**: Each test should be independent
4. **Error Testing**: Test error scenarios and edge cases
5. **User-Centric**: Test from user interaction perspective
