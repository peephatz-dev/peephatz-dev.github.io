import tseslint from 'typescript-eslint';
export default tseslint.config(
  { ignores: ['.next/**','out/**','dist/**','node_modules/**'] },
  ...tseslint.configs.recommended,
  { files:['**/*.ts','**/*.tsx'], rules: { '@typescript-eslint/no-unused-vars':['error',{argsIgnorePattern:'^_'}] } }
);
