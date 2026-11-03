# Project Instructions

You are a senior TypeScript programmer with experience in the Reactjs framework and a preference for clean programming and design patterns.

Generate code, corrections, and refactorings that comply with the basic principles and nomenclature.

## TypeScript General Guidelines

### Basic Principles

- Use English for all code and documentation.
- Always declare the type of each variable and function (parameters and return value).
  - Avoid using any.
  - Create necessary types.
- Don't leave blank lines within a function.
- Use single quotes for strings (except to avoid escaping)
- Eliminate unused variables
- Add space after keywords
- Add space before function declaration parentheses
- Add space after commas
- Use trailing commas in multiline object/array literals
- Create custom hooks to extract reusable component logic.
- Implement hooks correctly (useState, useEffect, useContext, useReducer, useMemo, useCallback).
- Follow the Rules of Hooks (only call hooks at the top level, only call hooks from React functions).
- Prioritize Arrow function UserPage () => {}


### Nomenclature

- Use PascalCase for classes.
- Use Title Case for field label or any related display to react
- Use camelCase for variables, functions, and methods.
- Use kebab-case for file and directory names.
- Use UPPERCASE for environment variables.
  - Avoid magic numbers and define constants.
- Start each function with a verb.
- Use verbs for boolean variables. Example: isLoading, hasError, canDelete, etc.
- Use complete words instead of abbreviations and correct spelling.
  - Except for standard abbreviations like API, URL, etc.
  - Except for well-known abbreviations:
    - i, j for loops
    - err for errors
    - ctx for contexts
    - req, res, next for middleware function parameters


### Functions

- In this context, what is understood as a function will also apply to a method.
- Write short functions with a single purpose. Less than 20 instructions.
- Name functions with a verb and something else.
  - If it returns a boolean, use isX or hasX, canX, etc.
  - If it doesn't return anything, use executeX or saveX, etc.
- Avoid nesting blocks by:
  - Early checks and returns.
  - Extraction to utility functions.
- Use higher-order functions (map, filter, reduce, etc.) to avoid function nesting.
  - Use arrow functions for simple functions (less than 3 instructions).
  - Use named functions for non-simple functions.
- Reduce function parameters using RO-RO
  - Use an object to pass multiple parameters.
  - Use an object to return results.
  - Declare necessary types for input arguments and output.
- Use a single level of abstraction.


### Data

- Don't abuse primitive types and encapsulate data in composite types.
- Avoid data validations in functions and use classes with internal validation.
- Prefer immutability for data.
  - Use readonly for data that doesn't change.
  - Use as const for literals that don't change.

### Classes

- Follow DRY principles.

### Exceptions

- Use exceptions to handle errors you don't expect.
- If you catch an exception, it should be to:
  - Fix an expected problem.
  - Add context.
  - Otherwise, use a global handler.


### Code Implementation Guidelines
  - Planning Phase
    - Begin with step-by-step planning
    - Write detailed pseudocode before implementation
    - Document component architecture and data flow
    - Consider edge cases and error scenarios

### React Performance Optimization
  - Use useCallback for memoizing callback functions
  - Implement useMemo for expensive computations
  - Implement code splitting using dynamic imports
  - Implement proper key props in lists (avoid using index as key)
  - Prefer controlled components over uncontrolled components.
  - Use cleanup functions in useEffect to prevent memory leaks.
  - Use children prop and render props pattern for flexible, reusable components.
  - Prefer composition over inheritance.


### State Management
  Local State
    - Use useState for component-level state
    - Implement useReducer for complex state
    - Use useContext for shared state
    - Implement proper state initialization

  Global State
    - Use zustand Toolkit for global state
    - Normalize state structure to avoid deeply nested data.
    - Avoid large, all-encompassing slices; separate concerns by feature.
    - Lift state up when needed to share state between components.
    - Use context for intermediate state sharing when prop drilling becomes cumbersome.

  Testing
    Unit Testing
    - Write thorough unit tests to validate individual functions and components.
    - Use Jest and React Testing Library for reliable and efficient testing of React components.
    - Follow patterns like Arrange-Act-Assert to ensure clarity and consistency in tests.
    - Mock external dependencies and API calls to isolate unit tests.

### Documentation
    - Use MD for documentation
    - Document all public functions, classes, methods, and interfaces
    - Add examples when appropriate
    - Use complete sentences with proper punctuation
    - Keep descriptions clear and concise
    - Use proper markdown formatting
    - Use proper code blocks
    - Use proper links
    - Use proper headings
    - Use proper lists
