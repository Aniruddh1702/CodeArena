import * as vm from 'vm';

describe('Sandbox Isolation and Timeout Protection', () => {
  it('should terminate infinite loops within the timeout window and throw execution timeout', () => {
    const maliciousCode = `
      var counter = 0;
      while (true) {
        counter++;
      }
    `;

    const sandbox = { counter: 0 };
    const context = vm.createContext(sandbox);
    const script = new vm.Script(maliciousCode);

    const start = Date.now();
    let threw = false;

    try {
      script.runInContext(context, { timeout: 100 });
    } catch (err: any) {
      threw = true;
      expect(err.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT' || err.message.includes('timed out')).toBe(true);
    }

    const elapsed = Date.now() - start;
    expect(threw).toBe(true);
    expect(elapsed).toBeLessThan(1000); // Definitely aborts quickly without freezing thread
  });

  it('should prevent access to process and require inside isolated sandbox context', () => {
    const sandbox: any = {
      Math,
      JSON,
      Array,
      Object,
      String,
      Number,
    };
    const context = vm.createContext(sandbox);

    const script = new vm.Script(`
      var hasProcess = typeof process !== 'undefined';
      var hasRequire = typeof require !== 'undefined';
      var res = { hasProcess: hasProcess, hasRequire: hasRequire };
      res;
    `);

    const result = script.runInContext(context, { timeout: 500 });
    expect(result.hasProcess).toBe(false);
    expect(result.hasRequire).toBe(false);
  });

  it('should redact hidden test case inputs and expected outputs during contest submissions', () => {
    const publicCount = 2;
    const isSubmission = true;
    const rawResults = [
      { caseIndex: 0, passed: true, input: '[2,7,11,15], target=9', expectedOutput: '[0,1]', actualOutput: '[0,1]' },
      { caseIndex: 1, passed: true, input: '[3,2,4], target=6', expectedOutput: '[1,2]', actualOutput: '[1,2]' },
      { caseIndex: 2, passed: false, input: '[1,999,99999], target=1000', expectedOutput: '[0,1]', actualOutput: '[]' },
    ];

    const sanitized = rawResults.map((r, idx) => {
      if (isSubmission && idx >= publicCount) {
        return {
          ...r,
          input: '[Hidden Test Case]',
          expectedOutput: '[Hidden]',
          actualOutput: r.passed ? '[Hidden]' : '[Hidden]',
          diffExplanation: r.passed ? undefined : 'Hidden test case failed. Check your logic for edge cases.',
        };
      }
      return r;
    });

    // Public test cases retained
    expect(sanitized[0].input).toBe('[2,7,11,15], target=9');
    expect(sanitized[1].expectedOutput).toBe('[1,2]');

    // Hidden test case protected
    expect(sanitized[2].input).toBe('[Hidden Test Case]');
    expect(sanitized[2].expectedOutput).toBe('[Hidden]');
    expect(sanitized[2].actualOutput).toBe('[Hidden]');
  });
});
