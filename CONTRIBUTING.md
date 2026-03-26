# Contributing to Procreation AI

First off, thank you for considering contributing to Procreation AI! It's people like you that make this project a great tool for the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to:
- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Respect different viewpoints and experiences

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Follow the [installation instructions](./README.md#installation)
4. Create a new branch for your contribution

## Development Workflow

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/procreation-ai.git
cd procreation-ai

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local with your API keys

# 4. Set up database
npx prisma migrate dev

# 5. Create a branch
git checkout -b feature/your-feature-name

# 6. Make changes and commit
git add .
git commit -m "feat: add your feature"

# 7. Push and create PR
git push origin feature/your-feature-name
```

## Pull Request Process

1. **Update documentation** - If you're adding features, update the README and relevant docs
2. **Add tests** - Write tests for new functionality
3. **Ensure CI passes** - Make sure all GitHub Actions checks pass
4. **Fill out the PR template** - Describe what your PR does and why
5. **Link issues** - Reference any related issues with "Fixes #123"
6. **Request review** - Maintainers will review your PR

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Code is commented, especially in hard-to-understand areas
- [ ] Corresponding documentation changes made
- [ ] Tests added for new functionality
- [ ] All tests pass locally
- [ ] No console errors or warnings

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types - define proper interfaces
- Enable strict mode in `tsconfig.json`

```typescript
// Good
interface GenerationConfig {
  prompt: string;
  modelId: string;
  width?: number;
  height?: number;
}

// Avoid
const config: any = { ... };
```

### React Components

- Use functional components with hooks
- Follow the existing component structure
- Use `shadcn/ui` components when possible

```typescript
// Good
export function MyComponent({ title }: { title: string }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>{title}</h1>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
    </div>
  );
}
```

### Styling

- Use Tailwind CSS classes
- Follow the existing color scheme (primary, secondary, accent)
- Use semantic color names

```tsx
// Good
<div className="bg-primary/10 border border-primary/20 rounded-lg">

// Avoid hardcoded colors
<div className="bg-blue-500 border border-blue-600">
```

### File Structure

```
components/
  feature/
    feature-card.tsx      # Component file
    feature-list.tsx      # Related component
    index.ts              # Re-exports
    types.ts              # Feature-specific types
lib/
  modules/
    feature/
      feature.ts          # Business logic
      utils.ts            # Helper functions
```

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, semicolons, etc)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples

```bash
feat(generation): add support for new DALL-E 3 model
fix(chat): resolve streaming response issue
docs(readme): update installation instructions
style(dashboard): fix indentation in stats component
refactor(api): simplify error handling in image route
test(nft): add tests for minting flow
chore(deps): update Next.js to 14.2
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

- Test components with React Testing Library
- Test API routes with jest and supertest
- Mock external APIs and services

```typescript
// Example component test
import { render, screen } from '@testing-library/react';
import { StatCard } from '@/components/dashboard/stats-overview';

describe('StatCard', () => {
  it('renders the value correctly', () => {
    render(<StatCard label="Credits" value={100} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});
```

## Documentation

- Update README.md if adding features
- Add JSDoc comments to complex functions
- Include examples in documentation
- Update API documentation when changing endpoints

## Questions?

Feel free to:
- Open an issue for questions
- Join our Discord community
- Email maintainers at dev@procreation.ai

Thank you for contributing!

## Attribution

This contributing guide is adapted from various open source projects and best practices.
