import MDXComponents from '@theme-original/MDXComponents';
import Quiz, {Question} from '@throughline/guide-kit/quiz';
import CodeChallenge from '@throughline/guide-kit/code-challenge';

/**
 * Register components that should be available in every MDX file
 * without an explicit import statement.
 */
export default {
  ...MDXComponents,
  Quiz,
  Question,
  CodeChallenge,
};
